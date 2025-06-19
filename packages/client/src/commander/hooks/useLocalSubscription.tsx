import { useEffect, useState } from 'react';
import { Commander } from '../commander';
import type { LocalActionPayloadType, LocalActionType } from '../localAction';

export const useLocalSubscription = <T extends LocalActionType>(
  action: T,
  callback: (payload: LocalActionPayloadType<T>) => void
): void => {
  const [actionState, setActionState] = useState<T>(action);
  const [id, setId] = useState<string>();

  useEffect(() => {
    if (id) {
      return;
    }

    setActionState(action);
    const commander = Commander.getInstance();
    const subscriptionId = commander.subscribe(action, callback);

    setId(subscriptionId);

    return () => {
      if (id) {
        // Cleanup function to unsubscribe when the component unmounts
        const commander = Commander.getInstance();
        commander.unsubscribe(id, actionState);
      }
    };
  }, []);
};
