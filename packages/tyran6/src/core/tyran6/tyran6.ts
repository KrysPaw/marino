import type { IncomingMessage } from 'node:http';
import { type WebSocket, WebSocketServer } from 'ws';
import type { z } from 'zod';
import type { Client } from '../client';
import { Clients } from '../clients';
import { WebSocketCloseReasonCode } from '../enums';
import { requestSchema } from '../schemas/request.schema';
import type { responseSchema } from '../schemas/response.schema';
import { Storage } from '../storage';
import type { ModuleArgs, RequestContext } from '../types';
import type { EventContext } from '../types/event.context';
import type { OptionalSchema } from '../types/optional-schema';
import type { RequestHandler } from '../types/request.handler';
import type { Tyran6Config } from '../types/tyran-config';
import { isUuid } from '../utils/is-uuid';

export class Tyran6<C extends Tyran6Config> {
	// Private properties
	private config: C;
	private webSocketServer: WebSocketServer | null = null;
	private actionHandlers: {
		[A in keyof C['actions']]: RequestHandler<C, A>;
	};
	readonly clients: Clients<C>;
	readonly storage: Storage<C['storageStateSchema']>;
	// @ts-expect-error
	readonly modules: { [K in keyof C['modules']]: InstanceType<C['modules'][K]> };
	private clientDefaultState: z.infer<
		OptionalSchema<C['clientStateSchema']>
	> | null = null;
	private responseHandlers = new Map<string, unknown>();
	private timeouts = new Map<string, NodeJS.Timeout>();
	private intervals = new Map<string, NodeJS.Timeout>();
	private onClientJoinHandler: ((context: EventContext<C>) => void) | null =
		null;
	private onClientLeaveHandler: ((context: EventContext<C>) => void) | null =
		null;

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

		this.storage.onChange((state) => {
			if (this.webSocketServer) {
				this.clients.getConnectedClients().forEach((client) => {
					this.sendRequest(client.id, 'DEV_MODE_STATE_UPDATE', {
						storageState: state,
					});
				});
			}
		});
		this.clients = new Clients<C>(this.clientDefaultState);

		// Load modules as last step to ensure that all dependencies are initialized
		if (config.modules) {
			this.modules = Object.entries(config.modules).reduce((acc, [key, moduleClass]) => {
				// @ts-expect-error
				acc[key] = new moduleClass({
					storage: this.storage,
					clients: this.clients,
				} satisfies ModuleArgs<typeof this>)

				return acc;
			}, {} as typeof this.modules);
		}
	}

	// Private methods
	private onConnection(ws: WebSocket, request: IncomingMessage): void {
		const url = new URL(request.url || '', `http://${request.headers.host}`);
		const providedSessionId = url.searchParams.get('sessionId');

		if (!providedSessionId) {
			console.error('No sessionId provided in the connection request.');
			ws.close(1008, WebSocketCloseReasonCode.NO_SESSION_PROVIDED);
			return;
		}

		if (isUuid(providedSessionId) === false) {
			console.error('Invalid sessionId format:', providedSessionId);
			ws.close(1008, WebSocketCloseReasonCode.INVALID_SESSION_ID);
			return;
		}

		// Make sure that client is not already connected
		if (this.clients.getConnectedClientBySessionId(providedSessionId)) {
			console.error('Client with this sessionId is already connected:', providedSessionId);
			ws.close(1008, WebSocketCloseReasonCode.SESSION_ALREADY_ACTIVE);
			return;
		}

		// Check whether client had been disconnected before
		const result = this.clients.reactivateClient(providedSessionId, ws);
		let client: Client<OptionalSchema<C['clientStateSchema']>>;

		if (result.status === 'SUCCESS') {
			client = result.client;
			console.log(`Client reconnected with sessionId: ${providedSessionId}`);
		} else {
			client = this.clients.addClient(ws, providedSessionId);
			console.log('New client connected with sessionId:', client.sessionId);
		}

		ws.on('close', () => this.onClose(client));
		ws.on('message', (data) => this.onMessage(client, data));

		this.onClientJoinHandler?.({
			client: client,
			clients: this.clients,
			storage: this.storage,
			modules: this.modules,
			send: (clientId, action, payload, onResponse) => {
				this.sendRequest(
					clientId,
					action,
					payload,
					onResponse,
				);
			},
		});
	}

	private onClose(
		client: Client<OptionalSchema<C['clientStateSchema']>>,
	) {
		this.onClientLeaveHandler?.({
			client: client,
			clients: this.clients,
			storage: this.storage,
			modules: this.modules,
			send: (client, action, payload, onResponse) => {
				this.sendRequest(
					client,
					action,
					payload,
					onResponse,
				);
			},
		});

		this.clients.removeClient(client.id);

		console.log(`Client disconnected: ${client.sessionId}`);
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
			clients: this.clients,
			id,
			payload,
			storage: this.storage,
			modules: this.modules,
			respond: (payload: unknown) => {
				const response: z.infer<typeof responseSchema> = {
					refId: id,
					action,
					payload,
				};

				client.webSocket.send(JSON.stringify(response));
			},
			send: <SA extends keyof C['actions']>(
				clientId: Client<OptionalSchema<C['clientStateSchema']>>['id'],
				action: SA,
				payload: C['actions'][SA]['request'],
				onResponse?: (context: RequestContext<C, C['actions'][SA]>) => void,
			) => {
				const client = this.clients.getConnectedClientById(clientId);

				if (!client) {
					console.error(`Client with ID ${clientId} not found.`);
					return;
				}

				this.sendRequest(client.id, action, payload, onResponse);
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
		clientId: Client<OptionalSchema<C['clientStateSchema']>>['id'],
		action: A,
		payload: z.infer<C['actions'][A]['request']>,
		onResponse?: (response: RequestContext<C, C['actions'][A]>) => void,
	): void {
		const client = this.clients.getConnectedClientById(clientId);

		if (!client) {
			console.error(`Client with ID ${clientId} not found.`);
			return;
		}

		const request = {
			id: crypto.randomUUID(),
			action,
			payload,
		};

		if (onResponse) {
			this.responseHandlers.set(request.id, onResponse);
		}

		console.log('Sending request:', request);

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
		this.clients.updateDefaultState(state);
	}

	setOnClientJoinHandler(handler: (context: EventContext<C>) => void): void {
		this.onClientJoinHandler = handler;
	}

	setOnClientLeaveHandler(handler: (context: EventContext<C>) => void): void {
		this.onClientLeaveHandler = handler;
	}
}
