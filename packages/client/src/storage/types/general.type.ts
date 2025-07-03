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
		/**
		 * Indicates that the same session client tries to use is already active.
		 * This is used to prevent multiple instances of the same client from running.
		 */
		sessionAlreadyActive: boolean;
	} & State
>;
