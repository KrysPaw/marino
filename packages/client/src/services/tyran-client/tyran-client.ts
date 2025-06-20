import {
	isTyranCommand,
	isTyranCommandValid,
	type TyranCommandAction,
	type TyranCommandPayloadType,
	type TyranCommandsType,
	type ValueOf,
} from '@shared';
import { Storage } from 'src/storage/storage';
import type { z } from 'zod/v4';
import type { TyranRequest } from '../../../../shared/src/types/tyran-request';

type RequestSubscription<T extends ValueOf<typeof TyranCommandAction>> = {
	id: string;
	action: T;
	callback: (payload: z.infer<TyranCommandsType[T]['request']>) => void;
};

type ResponseSubscription<T extends ValueOf<typeof TyranCommandAction>> = {
	refId: string;
	action: T;
	callback: (payload: TyranCommandPayloadType<T, 'response'>) => void;
};

// Communicate with a web socket server
export class TyranClient {
	private static instance: TyranClient;
	private client!: WebSocket;
	private serverRequestSubscriptions: {
		[K in ValueOf<typeof TyranCommandAction>]?: Record<
			RequestSubscription<K>['id'],
			RequestSubscription<K>
		>;
	} = {};
	private serverResponseSubscriptions: {
		[K in ValueOf<typeof TyranCommandAction>]?: Record<
			ResponseSubscription<K>['refId'],
			ResponseSubscription<K>
		>;
	} = {};

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
		console.log('Connect triggered', this.client?.readyState);
		if (this.client && this.client.readyState === WebSocket.OPEN) {
			console.warn('WebSocket is already connected.');
			return;
		}

		this.client = new WebSocket('ws://localhost:3000');

		// Assign on connect and on disconnect handlers
		this.client.onopen = () => {
			console.log('Connected to server');

			Storage.getInstance().setState((state) => {
				state.general.connected = true;
				state.general.connectionLost = false;
				return state;
			});
		};

		this.client.onclose = () => {
			Storage.getInstance().setState((state) => {
				state.general.connected = false;
				state.general.connectionLost = true;
				return state;
			});
			console.log('Disconnected from server');
		};

		this.client.onmessage = (event) => {
			const data = JSON.parse(event.data);

			this.onRawMessage(data);
		};
	}

	private onRawMessage(data: unknown): void {
		if (!isTyranCommand(data)) {
			console.error('Received invalid command:', data);
			return;
		}

		if (!isTyranCommandValid(data)) {
			console.error('Received invalid command structure:', data);
			return;
		}

		// Handle response message
		if ('refId' in data) {
			const subscription =
				this.serverResponseSubscriptions[data.action]?.[data.refId];

			if (subscription) {
				subscription.callback(data.payload);
			}
		}
	}

	subscribe<T extends ValueOf<typeof TyranCommandAction>>(
		action: T,
		callback: (payload: z.infer<TyranCommandsType[T]['request']>) => void,
	): string {
		const id = crypto.randomUUID();
		const subscription: RequestSubscription<T> = { id, action, callback };

		if (!this.serverRequestSubscriptions[action]) {
			this.serverRequestSubscriptions[action] = {};
		}

		this.serverRequestSubscriptions[action][id] = subscription;

		return id;
	}

	unsubscribe<T extends ValueOf<typeof TyranCommandAction>>(
		id: string,
		action: T,
	): boolean {
		if (this.serverRequestSubscriptions[action]?.[id]) {
			delete this.serverRequestSubscriptions[action][id];
			return true;
		}

		return false;
	}

	sendRequestCommand<T extends ValueOf<typeof TyranCommandAction>>(
		action: T,
		payload: TyranCommandPayloadType<T, 'request'>,
		onServerResponse?: (
			payload: TyranCommandPayloadType<T, 'response'>,
		) => void,
	): void {
		if (!this.client || this.client.readyState !== WebSocket.OPEN) {
			console.error('WebSocket is not open. Cannot send command.');
			return;
		}

		const id = crypto.randomUUID();
		const command: TyranRequest = {
			id,
			action,
			payload,
		};

		// Handle server response if needed
		if (onServerResponse) {
			const responseSubscription: ResponseSubscription<T> = {
				refId: id,
				action,
				callback: onServerResponse,
			};

			if (!this.serverResponseSubscriptions[action]) {
				this.serverResponseSubscriptions[action] = {};
			}

			this.serverResponseSubscriptions[action][id] = responseSubscription;
		}

		this.client.send(JSON.stringify(command));
	}
}
