import type { WebSocket } from 'ws';
import type { z } from 'zod';
import type { OptionalSchema } from './optional-schema';

export class Client<S extends z.ZodTypeAny> {
	/** Unique client ID */
	id: string;
	/** WebSocket connection */
	webSocket: WebSocket;
	/** Should not be sent to other connected clients */
	sessionId: string;
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
		state: z.infer<OptionalSchema<S>>,
	) {
		this.id = id;
		this.webSocket = webSocket;
		this.sessionId = sessionId;
		this.#state = state;
	}
}
