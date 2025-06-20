import type { z } from 'zod';
import type { TyranCommandAction } from '../enums/tyran-command-action';

export type TyranCommandsType = {
	[Command in keyof typeof TyranCommandAction]: {
		/** When client requests from server */
		request: z.ZodType;
		/** When client responds to server request */
		response: z.ZodType;
	};
};
