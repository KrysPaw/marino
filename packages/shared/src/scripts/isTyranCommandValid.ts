import { TyranCommands } from '../schemas';
import type { TyranRequest, TyranResponse } from '../types/tyran-request';

export const isTyranCommandValid = (
	command: TyranRequest | TyranResponse,
): boolean => {
	const { action, payload } = command;
	const isResponse = 'refId' in command;
	const schema = TyranCommands[action][isResponse ? 'response' : 'request'];
	const result = schema.safeParse(payload);

	if (!result.success) {
		console.error(
			`Invalid command payload for action ${action}:`,
			result.error,
		);
		return false;
	}

	return true;
};
