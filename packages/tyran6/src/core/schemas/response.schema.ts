import { z } from 'zod';

export const responseSchema = z.object({
	refId: z.string(),
	action: z.string(),
	payload: z.any(),
});
