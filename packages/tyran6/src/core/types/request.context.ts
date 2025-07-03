import type { z } from 'zod';
import type { Client } from '../client';
import type { Clients } from '../clients';
import type { Storage } from '../storage';
import type { OptionalSchema } from './optional-schema';
import type { RequestSchemas } from './request.schemas';
import type { Tyran6Config } from './tyran-config';

export type RequestContext<
	C extends Tyran6Config,
	P extends RequestSchemas[string],
> = {
	/** Requesting client */
	client: Client<OptionalSchema<C['clientStateSchema']>>;
	/** Collection of all connected and disconnected clients */
	clients: Clients<C>;
	/** ID of request. Is used to identify response (refId) */
	id: string;
	/** Request data */
	payload: z.infer<P['request']>;
	/** Server state manager */
	storage: Storage<C['storageStateSchema']>;
	/** Send response to client with current request context */
	// @ts-expect-error
	modules: { [K in keyof C['modules']]: InstanceType<C['modules'][K]> };
	// TODO: Consider making this return function to make sure that response is sent only once
	respond: (
		payload: P['response'] extends z.ZodTypeAny
			? z.infer<P['response']>
			: undefined,
	) => void;
	send: <SA extends keyof C['actions']>(
		client: Client<OptionalSchema<C['clientStateSchema']>>['id'],
		action: SA,
		payload: z.infer<C['actions'][SA]['request']>,
		onResponse?: (context: RequestContext<C, C['actions'][SA]>) => void,
	) => void;
};
