import type { LobbyPlayerTeam } from '../enums';
import type { ValueOf } from './value-of.utility';

export type LobbyPlayer = {
	id: string;
	nickname: string;
	isHost: boolean;
	team: ValueOf<typeof LobbyPlayerTeam>;
};
