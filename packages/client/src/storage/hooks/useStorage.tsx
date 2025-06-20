import { useEffect, useRef, useState } from 'react';
import { Storage } from '../storage';
import type { State } from '../types/state.type';
import { isEqual } from 'lodash';

export const useStorage = (): [State, typeof storage.setState] => {
	const storage = Storage.getInstance();
	const unsubFn = useRef<(() => void) | null>(null);
	const [state, setState] = useState(storage.getState());

	useEffect(() => {
		if (unsubFn.current) {
			return;
		}

		unsubFn.current = storage.onChange((newState: State) => {
			if (!isEqual(newState, state)) {
				setState(newState);
			}
		});

		return () => {
			if (unsubFn.current) {
				unsubFn.current();
				unsubFn.current = null;
			}
		};
	}, []);

	return [state, storage.setState.bind(storage)];
};
