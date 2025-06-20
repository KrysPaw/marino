import type { z } from 'zod';
import type { Storage } from '../storage';
import type { Client } from './client';
import type { OptionalSchema } from './optional-schema';
import type { RequestSchemas } from './request.schemas';
import type { Tyran6Config } from './tyran-config';

export type RequestContext<
	C extends Tyran6Config,
	P extends RequestSchemas[string],
> = {
	/** Requesting client */
	client: Client<OptionalSchema<C['clientStateSchema']>>;
	/** ID of request. Is used to identify response (refId) */
	id: string;
	/** Request data */
	payload: z.infer<P['request']>;
	/** Server state manager */
	storage: Storage<C['storageStateSchema']>;
	/** Send response to client with current request context */
	respond: (
		payload: P['response'] extends z.ZodTypeAny
			? z.infer<P['response']>
			: undefined,
	) => void;
};
