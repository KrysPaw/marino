import type { z } from 'zod';
import type { Client } from '../client';
import type { Clients } from '../clients';
import type { Storage } from '../storage';
import type { OptionalSchema } from './optional-schema';
import type { RequestContext } from './request.context';
import type { Tyran6Config } from './tyran-config';

export type EventContext<C extends Tyran6Config> = {
  /** Requesting client */
  client: Client<OptionalSchema<C['clientStateSchema']>>;
  /** Collection of all connected and disconnected clients */
  clients: Clients<C>;
  /** Server state manager */
  storage: Storage<C['storageStateSchema']>;
  // @ts-expect-error
  modules: { [K in keyof C['modules']]: InstanceType<C['modules'][K]> };
  send: <A extends keyof C['actions']>(
    client: Client<OptionalSchema<C['clientStateSchema']>>['id'],
    action: A,
    payload: z.infer<C['actions'][A]['request']>,
    onResponse?: (context: RequestContext<C, C['actions'][A]>) => void,
  ) => void;
};
