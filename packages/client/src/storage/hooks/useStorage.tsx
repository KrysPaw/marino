import { isEqual } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { Storage } from '../storage';
import type { State } from '../types/state.type';

export const useStorage = (): [Readonly<State>, typeof storage.setState] => {
	const storage = Storage.getInstance();
	const unsubFn = useRef<(() => void) | null>(null);
	const [state, setState] = useState(storage.getState());

	useEffect(() => {
		if (unsubFn.current) {
			return;
		}

		unsubFn.current = storage.onChange((newState: State) => {
			setState((prevState) => {
				if (!isEqual(newState, prevState)) {
					return newState;
				}

				return prevState;
			});
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
