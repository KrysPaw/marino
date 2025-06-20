import type { IncomingMessage } from 'node:http';
import { type WebSocket, WebSocketServer } from 'ws';
import type { z } from 'zod';
import { requestSchema } from '../schemas/request.schema';
import type { responseSchema } from '../schemas/response.schema';
import { Storage } from '../storage';
import { Client } from '../types/client';
import type { OptionalSchema } from '../types/optional-schema';
import type { RequestHandler } from '../types/request.handler';
import type { Tyran6Config } from '../types/tyran-config';

export class Tyran6<C extends Tyran6Config> {
	// Private properties
	private config: C;
	private webSocketServer: WebSocketServer | null = null;
	private actionHandlers: {
		[A in keyof C['actions']]: RequestHandler<C, A>;
	};
	private clients: Map<
		Client<OptionalSchema<C['clientStateSchema']>>['id'],
		Client<OptionalSchema<C['clientStateSchema']>>
	> = new Map();
	private storage: Storage<C['storageStateSchema']>;
	private clientDefaultState: z.infer<
		OptionalSchema<C['clientStateSchema']>
	> | null = null;
	// Public properties

	constructor(config: C) {
		this.config = config;
		this.actionHandlers = Object.keys(config.actions).reduce((acc, action) => {
			acc[action] = () => {
				console.warn(`No handler set for action: ${action}`);
			};

			return acc;
			// biome-ignore lint/suspicious/noExplicitAny: it wouldn't help anyway
		}, {} as any);
		this.storage = new Storage();
	}

	// Private methods
	private onConnection(ws: WebSocket, request: IncomingMessage): void {
		console.log('New client connected');
		const url = new URL(request.url || '', `http://${request.headers.host}`);
		const sessionId = url.searchParams.get('sessionId') || crypto.randomUUID();

		const client = new Client<OptionalSchema<C['clientStateSchema']>>(
			crypto.randomUUID(),
			ws,
			sessionId,
			this.clientDefaultState,
		);

		this.clients.set(client.id, client);

		ws.on('close', () => {
			this.clients.delete(client.id);
			console.log(`Client disconnected: ${client.id}`);
		});
		ws.on('message', (data) => this.onMessage(client, data));
	}

	private onMessage(
		client: Client<OptionalSchema<C['clientStateSchema']>>,
		data: unknown,
	): void {
		let objectData: object;

		try {
			objectData = JSON.parse(`${data}`.toString());
		} catch (e) {
			console.error('Invalid JSON:', e);
			return;
		}

		console.log('Received message', objectData);

		const parseResult = requestSchema.safeParse(objectData);

		if (!parseResult.success) {
			console.error('Invalid request format:', parseResult.error);
			return;
		}

		const { id, action, payload } = parseResult.data;

		const parsedPayload =
			this.config.actions[action]?.request.safeParse(payload);

		if (!parsedPayload.success) {
			console.error(
				`Invalid payload for action "${action}":`,
				parsedPayload.error,
			);
			return;
		}

		this.actionHandlers[action]({
			client,
			id,
			payload,
			storage: this.storage,
			respond: (payload: unknown) => {
				const response: z.infer<typeof responseSchema> = {
					refId: id,
					action,
					payload,
				};

				client.webSocket.send(JSON.stringify(response));
			},
		});
	}

	// Public methods
	setRequestHandler<A extends keyof C['actions']>(
		action: A,
		handler: RequestHandler<C, A>,
	): void {
		this.actionHandlers[action] = handler;
	}

	sendRequest<A extends keyof C['actions']>(
		client: Client<OptionalSchema<C['clientStateSchema']>>,
		action: A,
		payload: z.infer<C['actions'][A]['request']>,
	): void {
		const request = {
			id: crypto.randomUUID(),
			action,
			payload,
		};

		client.webSocket.send(JSON.stringify(request));
	}

	// WebSocket
	startListening(): void {
		if (this.webSocketServer) {
			console.warn('WebSocket server is already running.');
			return;
		}

		this.webSocketServer = new WebSocketServer({ port: 3000 });

		this.webSocketServer.on('connection', this.onConnection.bind(this));
	}

	initializeStorageState(state: z.infer<C['storageStateSchema']>): void {
		this.storage.initialize(state);
	}

	initializeClientState(
		state: z.infer<OptionalSchema<C['clientStateSchema']>>,
	): void {
		if (this.clientDefaultState) {
			console.log('Client default state is already initialized.');
			return;
		}

		this.clientDefaultState = state;
	}
}
