import type {
	TyranCommandAction,
	TyranCommandPayloadType,
	ValueOf,
} from '@shared';
import { useEffect, useRef } from 'react';
import { TyranClient } from '../services/tyran-client/tyran-client';

export const UseHandleServerRequest = <
	T extends ValueOf<typeof TyranCommandAction>,
>(
	action: T,
	fn: (payload: TyranCommandPayloadType<T, 'request'>) => void,
) => {
	const subId = useRef<string | null>(null);

	const client = TyranClient.getInstance();

	useEffect(() => {
		if (!subId.current) {
			subId.current = client.subscribe(action, fn);
		}

		return () => {
			if (subId.current) {
				client.unsubscribe(subId.current, action);
				subId.current = null;
			}
		};
	}, []);
};
