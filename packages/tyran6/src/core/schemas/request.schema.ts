import { z } from 'zod';

export const requestSchema = z.object({
	id: z.string(),
	action: z.string(),
	payload: z.any(),
});
