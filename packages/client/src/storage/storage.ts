import { isEqual } from 'lodash';
import type { State } from './types/state.type';

const initialState: State = {
	general: {
		connected: false,
		connectionLost: false,
		sessionAlreadyActive: false,
		state: 'MENU',
	},
	lobby: {
		players: [],
		blueTeam: [],
		redTeam: [],
		lobbyId: '',
		code: '',
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

		window.addEventListener('message', (event) => {
			if (
				event.data?.source === 'marino-extension' &&
				event.data.type === 'getClientStorageUpdate'
			) {
				window.postMessage({
					source: 'marino',
					type: 'clientStorageUpdate',
					data: this.state,
				});
			}
		});
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

	setState(fn: (prevState: State) => void): void {
		const newState = structuredClone(this.state);

		fn(newState);

		const didChange = !isEqual(this.state, newState);

		this.state = newState;

		if (didChange) {
			window.postMessage({
				source: 'marino',
				type: 'clientStorageUpdate',
				data: this.state,
			});

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
