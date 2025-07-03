import type { Client } from '../client';
import type { OptionalSchema } from './optional-schema';
import type { Tyran6Config } from './tyran-config';

export type ClientsCollection<C extends Tyran6Config, K extends 'id' | 'sessionId'> = Map<
  Client<OptionalSchema<C['clientStateSchema']>>[K],
  Client<OptionalSchema<C['clientStateSchema']>>
>;
