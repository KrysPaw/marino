import { z } from 'zod';
import type { TyranCommandsType } from '../types/tyran-commands-type';
import type { TyranCommandSchemaName } from '../types/tyran-request';

const lobbyPlayer = z.object({
	id: z.string(),
	nickname: z.string().min(1).max(20),
	isHost: z.boolean(),
	team: z.enum(['BLUE', 'RED']),
});

const lobbyInfo = z.object({
	code: z.string().regex(/^[A-Z0-9]{6}$/),
	lobbyId: z.string(),
	players: z.array(lobbyPlayer),
	blueTeam: z.array(lobbyPlayer),
	redTeam: z.array(lobbyPlayer),
})

/** Make schemas void by default */
export const TyranCommands = {
	DEV_MODE_STATE_UPDATE: {
		request: z.object({
			storageState: z.any().optional(),
			connectedClients: z.array(z.any()).optional(),
			disconnectedClients: z.array(z.any()).optional(),
		}),
		response: z.void()
	},
	CLIENT_INFO: {
		request: z.object({
			clientId: z.string(),
			nickname: z.string().max(20).optional(),
			lobbyId: z.string().optional(),
		}),
		response: z.void()
	},
	CREATE_LOBBY: {
		request: z.undefined(),
		response: lobbyInfo
	},
	SET_NICKNAME: {
		request: z.object({
			nickname: z.string().min(1).max(20),
		}),
		response: z.void(),
	},
	GET_LOBBY_INFO: {
		request: z.void(),
		response: lobbyInfo
	},
	JOIN_LOBBY: {
		request: z.object({
			code: z.string()
		}),
		response: z.union([
			z.object({
				status: z.literal('SUCCESS'),
				data: lobbyInfo
			}),
			z.object({
				status: z.literal('ERROR'),
				errorCode: z.enum(['LOBBY_NOT_FOUND', 'LOBBY_FULL', 'INVALID_CODE'])
			})
		])
	},
	UPDATE_LOBBY_INFO: {
		request: lobbyInfo,
		response: z.void()
	},
	SWITCH_TEAM: {
		request: z.object({
			team: z.enum(['BLUE', 'RED'])
		}),
		response: z.void()
	},
} as const satisfies TyranCommandsType;

export type TyranCommandPayloadType<
	T extends keyof typeof TyranCommands,
	U extends TyranCommandSchemaName,
> = z.infer<(typeof TyranCommands)[T][U]>;
