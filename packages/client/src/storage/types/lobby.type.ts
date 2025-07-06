import type { LobbyState, PlayerType, ValueOf } from "@shared";

export type Player = {
	isHost: boolean;
	id: string;
	nickname: string;
	type: ValueOf<typeof PlayerType>;
};

export type Lobby = {
	lobbyId: string;
	code: string;
	state: ValueOf<typeof LobbyState>;
	players: Player[];
	blueTeam: Player[];
	redTeam: Player[];
};
