import type { WebSocket } from 'ws';
import type { z } from 'zod';
import type { OptionalSchema } from '../types/optional-schema';

export class Client<S extends z.ZodTypeAny> {
	/** Unique client ID */
	readonly id: string;
	/** Client nickname */
	nickname = '';
	/** WebSocket connection */
	webSocket: WebSocket;
	/** Should not be sent to other connected clients */
	readonly sessionId: string;
	/** Client private state. Cleared when disconnects */
	#state: z.infer<OptionalSchema<S>>;
	get state(): z.infer<OptionalSchema<S>> {
		if (!this.#state) {
			console.warn('Client state is not initialized.');
			return null;
		}

		return this.#state;
	}

	set state(newState: z.infer<OptionalSchema<S>>) {
		if (!this.#state) {
			console.warn('Client state is not initialized.');
			return;
		}

		this.#state = newState;
	}

	constructor(
		id: string,
		webSocket: WebSocket,
		sessionId: string,
		nickname: string,
		state: z.infer<OptionalSchema<S>>,
	) {
		this.id = id;
		this.webSocket = webSocket;
		this.sessionId = sessionId;
		this.nickname = nickname;
		this.#state = state;
	}
}
