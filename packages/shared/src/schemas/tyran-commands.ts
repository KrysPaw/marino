import { z } from 'zod';
import type { TyranCommandsType } from '../types/tyran-commands-type';
import type { TyranCommandSchemaName } from '../types/tyran-request';

/** Make schemas void by default */
export const TyranCommands = {
	CREATE_GAME: {
		request: z.undefined(),
		response: z.object({
			code: z.string().regex(/^[A-Z0-9]{6}$/),
			spaceId: z.string(),
			players: z.array(
				z.object({
					id: z.string(),
					nickname: z.string().min(1).max(20),
					isHost: z.boolean(),
				}),
			),
		}),
	},
	SET_NICKNAME: {
		request: z.object({
			nickname: z.string().min(1).max(20),
		}),
		response: z.void(),
	},
} as const satisfies TyranCommandsType;

export type TyranCommandPayloadType<
	T extends keyof typeof TyranCommands,
	U extends TyranCommandSchemaName,
> = z.infer<(typeof TyranCommands)[T][U]>;
