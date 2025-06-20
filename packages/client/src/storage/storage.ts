import { isEqual } from 'lodash';
import type { State } from './types/state.type';

const initialState: State = {
	general: {
		connected: false,
		connectionLost: false,
		state: 'MENU',
	},
	lobby: {
		players: [],
	},
	game: {
		players: {},
		teams: {
			red: {
				players: {},
			},
			blue: {
				players: {},
			},
		},
		skirmishes: [],
	},
};

export class Storage {
	private static instance: Storage;
	private state: State = initialState;
	private changeSubscriptions: Record<string, (state: State) => void> = {};

	constructor() {
		if (Storage.instance) {
			throw new Error(
				'Storage is a singleton class. Use getInstance() to access it.',
			);
		}

		Storage.instance = this;
	}

	public static getInstance(): Storage {
		if (!Storage.instance) {
			Storage.instance = new Storage();
		}

		return Storage.instance;
	}

	getState() {
		return structuredClone(this.state);
	}

	setState(fn: (prevState: State) => State): void {
		const newState = fn(structuredClone(this.state));

		const didChange = !isEqual(this.state, newState);

		this.state = newState;

		if (didChange) {
			const subscriptions = Object.values(this.changeSubscriptions);

			for (const subscription of subscriptions) {
				subscription(this.state);
			}
		}
	}

	onChange(fn: (state: State) => void) {
		const id = crypto.randomUUID();
		this.changeSubscriptions[id] = fn;

		return () => {
			delete this.changeSubscriptions[id];
		};
	}
}
