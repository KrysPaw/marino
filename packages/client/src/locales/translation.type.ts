import type { ExceptionCase, ValueOf } from "@shared";

type Exception = {
	title: string;
	description?: string;
	actionButton?: string;
}

export type Translation = {
	header: {
		logo: string;
	};
	language: {
		title: string;
		options: {
			en: string;
			pl: string;
		};
	};
	welcome: {
		title: string;
		description: string;
		namePlaceholder: string;
		button: {
			continue: string;
			learnMore: string;
		};
	};
	menu: {
		description: string;
		buttons: {
			createGame: string;
			joinGame: string;
		};
		gameCodePlaceholder: string;
	};
	noConnection: {
		title: string;
		reconnectButton: string;
	};
	sessionAlreadyActive: {
		title: string;
		description: string;
		tryAgainButton: string;
	};
	kickedFromLobby: {
		title: string;
		description: string;
		returnToMenuButton: string;
	}
	lobby: {
		title: string;
		players: string;
		blueTeam: string;
		redTeam: string;
	};
	exceptions: Record<ValueOf<typeof ExceptionCase>, Exception>
};

type Join<K, P> = K extends string | number
	? P extends string | number
	? `${K}.${P}`
	: never
	: never;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type Paths<T, D extends number = 10> = [D] extends [never]
	? never
	: T extends object
	? {
		[K in keyof T & (string | number)]: T[K] extends object
		? K | Join<K, Paths<T[K], Prev[D]>>
		: K;
	}[keyof T & (string | number)]
	: '';

export type TranslationKeys = Paths<Translation>;
