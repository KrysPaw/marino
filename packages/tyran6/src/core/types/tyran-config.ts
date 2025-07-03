import type { z } from 'zod';
import type { RequestSchemas } from './request.schemas';

export type Tyran6Config = {
	actions: RequestSchemas;
	storageStateSchema: z.ZodTypeAny;
	/** Handy private state for every connected client. Cleared when client disconnects */
	clientStateSchema?: z.ZodTypeAny;
	modules?: Record<string, new (...args: any[]) => any>;
};
