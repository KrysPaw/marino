import type { Game } from './game.type';
import type { General } from './general.type';
import type { Lobby } from './lobby.type';

export type State = {
	general: General;
	game: Game;
	lobby: Lobby;
};
