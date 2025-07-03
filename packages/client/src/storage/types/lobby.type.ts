type Player = {
	isHost: boolean;
	id: string;
	nickname: string;
};

export type Lobby = {
	lobbyId: string;
	code: string;
	players: Player[];
	blueTeam: Player[];
	redTeam: Player[];
};
