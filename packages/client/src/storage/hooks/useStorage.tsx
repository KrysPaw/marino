import { Storage } from '../storage';
import type { State } from '../types/state.type';

export const useStorage = (): [State, typeof storage.setState] => {
  const storage = Storage.getInstance();

  return [storage.getState(), storage.setState.bind(storage)];
};
