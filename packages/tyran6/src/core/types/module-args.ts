import type { Tyran6 } from '../tyran6';

export type ModuleArgs<T extends Tyran6<any>> = {
  storage: T['storage'];
  clients: T['clients'];
};
