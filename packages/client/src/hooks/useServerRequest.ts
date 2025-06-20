import type {
	TyranCommandAction,
	TyranCommandPayloadType,
	ValueOf,
} from '@shared';
import { TyranClient } from '../services/tyran-client/tyran-client';

export const useServerRequest = () => {
	const client = TyranClient.getInstance();

	return {
		send: <T extends ValueOf<typeof TyranCommandAction>>(
			action: T,
			payload: TyranCommandPayloadType<T, 'request'>,
			onServerResponse?: (
				payload: TyranCommandPayloadType<T, 'response'>,
			) => void,
		) => {
			client.sendRequestCommand(action, payload, onServerResponse);
		},
	};
};
