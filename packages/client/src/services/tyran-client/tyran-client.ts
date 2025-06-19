import { TyranCommandAction, type TyranCommandsType, type ValueOf } from '@shared';
import type { z } from 'zod/v4';

type RequestSubscription<T extends ValueOf<typeof TyranCommandAction>> = {
  id: string;
  action: T;
  callback: (payload: z.infer<TyranCommandsType[T]['serverRequestSchema']>) => void;
};

type ResponseSubscription<T extends ValueOf<typeof TyranCommandAction>> = {
  refId: string;
  id: string;
  action: T;
  callback: (payload: z.infer<TyranCommandsType[T]['serverResponseSchema']>) => void;
};


// Communicate with a web socket server
export class TyranClient {
  private static instance: TyranClient;
  private client!: WebSocket;
  private serverRequestSubscriptions: { [K in ValueOf<typeof TyranCommandAction>]?: Record<RequestSubscription<K>['id'], RequestSubscription<K>> } = {};
  private serverResponseSubscriptions: { [K in ValueOf<typeof TyranCommandAction>]?: Record<ResponseSubscription<K>['refId'], ResponseSubscription<K>> } = {};

  private constructor() {
    // Private constructor to prevent instantiation
    this.connect();
  }

  public static getInstance(): TyranClient {
    if (!TyranClient.instance) {
      TyranClient.instance = new TyranClient();
    }

    return TyranClient.instance;
  }

  public async connect(): Promise<void> {
    this.client = new WebSocket('ws://localhost:3000');

    // Assign on connect and on disconnect handlers
    this.client.onopen = () => {
      console.log('Connected to server');
    };

    this.client.onclose = () => {
      console.log('Disconnected from server');
    };

    this.client.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.action === '_HANDSHAKE_') {
        this.client.send(
          JSON.stringify({
            action: '_HANDSHAKE_',
            payload: {
              key: 'this.publicKey',
            },
          }),
        );

        return;
      } else if (data.action === '_HANDSHAKE_COMPLETE_') {
        console.log('Handshake complete', data.payload);
        return;
      } else {
        this.onRawMessage(data);
      }
    };
  }

  private onRawMessage(data: unknown): void {
    console.log('Message received:', data);
  }

  subscribe<T extends ValueOf<typeof TyranCommandAction>>(
    action: T,
    callback: (payload: z.infer<TyranCommandsType[T]['serverRequestSchema']>) => void,
  ): string {
    const id = crypto.randomUUID();
    const subscription: RequestSubscription<T> = { id, action, callback };

    if (!this.serverRequestSubscriptions[action]) {
      this.serverRequestSubscriptions[action] = {};
    }

    this.serverRequestSubscriptions[action][id] = subscription;

    return id;
  }

  unsubscribe<T extends ValueOf<typeof TyranCommandAction>>(id: string, action: T): boolean {
    if (this.serverRequestSubscriptions[action] && this.serverRequestSubscriptions[action][id]) {
      delete this.serverRequestSubscriptions[action][id];
      return true;
    }

    return false;
  }

  sendCommand<T extends ValueOf<typeof TyranCommandAction>>(
    action: T,
    payload: z.infer<TyranCommandsType[T]['clientRequestSchema']>,
    onServerResponse?: (payload: z.infer<TyranCommandsType[T]['serverResponseSchema']>) => void,
  ): void {
    if (!this.client || this.client.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not open. Cannot send command.');
      return;
    }

    const refId = crypto.randomUUID();
    const message = {
      refId,
      action,
      payload,
    };

    // Handle server response if needed
    if (onServerResponse) {
      const responseSubscription: ResponseSubscription<T> = {
        id: crypto.randomUUID(),
        refId,
        action,
        callback: onServerResponse,
      };

      if (!this.serverResponseSubscriptions[action]) {
        this.serverResponseSubscriptions[action] = {};
      }

      this.serverResponseSubscriptions[action][refId] = responseSubscription;
    }

    this.client.send(JSON.stringify(message));
  }
}