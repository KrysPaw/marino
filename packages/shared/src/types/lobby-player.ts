import type { LobbyPlayerTeam, PlayerType } from '../enums';
import type { ValueOf } from './value-of.utility';

export type LobbyPlayer = {
	id: string;
	type: ValueOf<typeof PlayerType>;
	nickname: string;
	isHost: boolean;
	team: ValueOf<typeof LobbyPlayerTeam>;
};
