import type { SkirmishState, ValueOf } from '@shared';

type Player = {
	id: string;
	name: string;
	score: number;
	opponentId: string | null;
	team: 'red' | 'blue';
};

type Team = {
	players: Record<Player['id'], Player>;
};

type Skirmish = {
	id: string;
	state: ValueOf<typeof SkirmishState>;
	playerIds: [Player['id'], Player['id']];
	playerTurn: Player['id'];
};

export type Game = {
	players: Record<Player['id'], Player>;
	teams: {
		red: Team;
		blue: Team;
	};
	skirmishes: Skirmish[];
};
