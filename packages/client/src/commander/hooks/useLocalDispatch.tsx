import { Commander } from '../commander';
import type { LocalActionPayloadType, LocalActionType } from '../localAction';

export const useLocalDispatch = () => {
  const commander = Commander.getInstance();

  const dispatch = <T extends LocalActionType>(
    action: T,
    payload: LocalActionPayloadType<T>
  ) => {
    commander.dispatch(action, payload);
  };

  return dispatch;
};
