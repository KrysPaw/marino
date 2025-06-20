import type { z } from 'zod';

export type RequestSchemas = {
	[action: string]: {
		request: z.ZodTypeAny;
		response?: z.ZodTypeAny;
	};
};
