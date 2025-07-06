import { z } from 'zod';
import { LobbyPlayerTeam, LobbyState, PlayerType, Status, TyranError } from '../enums';
import type { TyranCommandsType } from '../types/tyran-commands-type';
import type { TyranCommandSchemaName } from '../types/tyran-request';

const lobbyPlayer = z.object({
	id: z.string(),
	type: z.enum([PlayerType.AI, PlayerType.MOST_LIKELY_HUMAN, PlayerType.SPECTATOR]),
	nickname: z.string().min(1).max(20),
	isHost: z.boolean(),
	team: z.enum([LobbyPlayerTeam.BLUE, LobbyPlayerTeam.RED]),
});

const lobbyInfo = z.object({
	code: z.string().regex(/^[A-Z0-9]{6}$/),
	lobbyId: z.string(),
	state: z.enum([LobbyState.LOBBY, LobbyState.STARTING, LobbyState.IN_PROGRESS]),
	players: z.array(lobbyPlayer),
	blueTeam: z.array(lobbyPlayer),
	redTeam: z.array(lobbyPlayer),
	game: z.object({
		skirmishes: z.array(z.any())
	})
});

export const TyranCommands = {
	DEV_MODE_STATE_UPDATE: {
		request: z.object({
			storageState: z.any().optional(),
			connectedClients: z.array(z.any()).optional(),
			disconnectedClients: z.array(z.any()).optional(),
		}),
		response: z.void(),
	},
	CLIENT_INFO: {
		request: z.object({
			clientId: z.string(),
			nickname: z.string().max(20).optional(),
			lobbyId: z.string().optional(),
		}),
		response: z.void(),
	},
	CREATE_LOBBY: {
		request: z.undefined(),
		response: lobbyInfo,
	},
	SET_NICKNAME: {
		request: z.object({
			nickname: z.string().min(1).max(20),
		}),
		response: z.void(),
	},
	GET_LOBBY_INFO: {
		request: z.void(),
		response: lobbyInfo,
	},
	JOIN_LOBBY: {
		request: z.object({
			code: z.string(),
		}),
		response: z.union([
			z.object({
				status: z.literal(Status.SUCCESS),
				data: lobbyInfo,
			}),
			z.object({
				status: z.literal(Status.ERROR),
				errorCode: z.enum([
					TyranError.LOBBY_NOT_FOUND,
					TyranError.NOT_HOST,
					TyranError.GAME_ALREADY_STARTED,
				]),
			}),
		]),
	},
	UPDATE_LOBBY_INFO: {
		request: lobbyInfo,
		response: z.void(),
	},
	SWITCH_TEAM: {
		request: z.object({
			team: z.enum([LobbyPlayerTeam.BLUE, LobbyPlayerTeam.RED]),
		}),
		response: z.void(),
	},
	TRIGGER_GAME_START: {
		request: z.object({
			lobbyId: z.string(),
		}),
		response: z.union([
			z.object({
				status: z.literal('SUCCESS'),
			}),
			z.object({
				status: z.literal('ERROR'),
				errorCode: z.enum([
					TyranError.NOT_HOST,
					TyranError.GAME_ALREADY_STARTED,
					TyranError.LOBBY_NOT_FOUND,
					TyranError.NOT_IN_LOBBY,
					TyranError.NOT_ENOUGH_PLAYERS,
				]),
			}),
		]),
	},
	START_GAME: {
		request: z.void(),
		response: z.void(),
	},
	ADD_AI_PLAYER: {
		request: z.object({
			lobbyId: z.string(),
			team: z.enum([LobbyPlayerTeam.BLUE, LobbyPlayerTeam.RED]),
		}),
		response: z.union([
			z.object({
				status: z.literal(Status.SUCCESS),
				data: lobbyInfo,
			}),
			z.object({
				status: z.literal(Status.ERROR),
				errorCode: z.enum([
					TyranError.NOT_IN_LOBBY,
					TyranError.LOBBY_NOT_FOUND,
					TyranError.LOBBY_FULL,
					TyranError.NOT_HOST,
					TyranError.GAME_ALREADY_STARTED,
				]),
			}),
		]),
	},
	KICK_PLAYER: {
		request: z.object({
			lobbyId: z.string(),
			playerId: z.string(),
		}),
		response: z.union([
			z.object({
				status: z.literal(Status.SUCCESS),
			}),
			z.object({
				status: z.literal(Status.ERROR),
				errorCode: z.enum([
					TyranError.NOT_IN_LOBBY,
					TyranError.LOBBY_NOT_FOUND,
					TyranError.NOT_HOST,
					TyranError.GAME_ALREADY_STARTED,
					TyranError.PLAYER_NOT_FOUND,
				]),
			}),
		]),
	},
	KICK_LEAVE_LOBBY: {
		request: z.void(),
		response: z.void()
	},
} as const satisfies TyranCommandsType;

export type TyranCommandPayloadType<
	T extends keyof typeof TyranCommands,
	U extends TyranCommandSchemaName,
> = z.infer<(typeof TyranCommands)[T][U]>;
