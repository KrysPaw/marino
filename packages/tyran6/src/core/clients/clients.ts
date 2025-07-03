import { omit } from 'lodash';
import type { WebSocket } from 'ws';
import { Status } from '../enums';
import { Client, type OptionalSchema, type Tyran6Config } from '../types';
import type { ClientsCollection } from '../types/clients-collection';

type ReactiveClientResult<C extends Tyran6Config> =
  | {
    status: typeof Status.SUCCESS;
    client: Client<OptionalSchema<C['clientStateSchema']>>;
  }
  | {
    status: typeof Status.ERROR;
    errorCode: 'SESSION_NOT_FOUND';
  };

export class Clients<C extends Tyran6Config> {
  private connectedClientsById: ClientsCollection<C, 'id'> = new Map();
  private connectedClientsBySessionId: ClientsCollection<C, 'sessionId'> =
    new Map();
  private disconnectedClientsBySessionId: ClientsCollection<C, 'sessionId'> =
    new Map();

  constructor(
    private clientDefaultState: OptionalSchema<
      C['clientStateSchema']
    > | null = null,
  ) { }

  private onClientsChange() {
    const connectedClients = this.getConnectedClients();
    const disconnectedClients = this.getDisconnectedClients();

    connectedClients.forEach((client) => {
      client.webSocket.send(
        JSON.stringify({
          id: crypto.randomUUID(),
          action: 'DEV_MODE_STATE_UPDATE',
          payload: {
            connectedClients: connectedClients.map((client) =>
              omit(client, ['webSocket'])),
            disconnectedClients: disconnectedClients.map((client) =>
              omit(client, ['webSocket'])),
          },
        }),
      );
    });
  }

  getConnectedClients(): Array<Client<OptionalSchema<C['clientStateSchema']>>> {
    return Array.from(this.connectedClientsById.values());
  }

  getDisconnectedClients(): Array<
    Client<OptionalSchema<C['clientStateSchema']>>
  > {
    return Array.from(this.disconnectedClientsBySessionId.values());
  }

  getConnectedClientById(
    id: string,
  ): Client<OptionalSchema<C['clientStateSchema']>> | undefined {
    return this.connectedClientsById.get(id);
  }

  getConnectedClientBySessionId(
    sessionId: string,
  ): Client<OptionalSchema<C['clientStateSchema']>> | undefined {
    return this.connectedClientsBySessionId.get(sessionId);
  }

  updateDefaultState(
    newState: OptionalSchema<C['clientStateSchema']> | null,
  ): void {
    this.clientDefaultState = newState;
  }

  addClient(
    ws: WebSocket,
    sessionId: string,
  ): Client<OptionalSchema<C['clientStateSchema']>> {
    const client = new Client<OptionalSchema<C['clientStateSchema']>>(
      crypto.randomUUID(),
      ws,
      sessionId,
      '',
      this.clientDefaultState,
    );

    this.connectedClientsById.set(client.id, client);
    this.connectedClientsBySessionId.set(client.sessionId, client);

    this.onClientsChange();

    return client;
  }

  reactivateClient(sessionId: string, ws: WebSocket): ReactiveClientResult<C> {
    const client = this.disconnectedClientsBySessionId.get(sessionId);

    if (!client) {
      return {
        status: Status.ERROR,
        errorCode: 'SESSION_NOT_FOUND',
      };
    }

    client.webSocket = ws;

    this.connectedClientsById.set(client.id, client);
    this.connectedClientsBySessionId.set(client.sessionId, client);
    this.disconnectedClientsBySessionId.delete(sessionId);

    this.onClientsChange();

    return {
      status: Status.SUCCESS,
      client
    };
  }

  removeClient(clientId: string): void {
    const client = this.connectedClientsById.get(clientId);

    if (!client) {
      console.warn(`Client with id ${clientId} not found.`);
      return;
    }

    this.connectedClientsById.delete(clientId);
    this.connectedClientsBySessionId.delete(client.sessionId);
    this.disconnectedClientsBySessionId.set(client.sessionId, client);

    this.onClientsChange();
  }
}
