import type { Prettify } from '@shared';

export const AppState = {
	MENU: 'MENU',
	LOBBY: 'LOBBY',
	GAME: 'GAME',
} as const;

type MenuState = {
	state: typeof AppState.MENU;
};

type LobbyState = {
	state: typeof AppState.LOBBY;
	code: string;
};

type GameState = {
	state: typeof AppState.GAME;
};

type State = MenuState | LobbyState | GameState;

export type General = Prettify<
	{
		connected: boolean;
		connectionLost: boolean;
	} & State
>;
