import type { TyranRequest, TyranResponse } from '../types/tyran-request';

export const isTyranCommand = (
	command: unknown,
): command is TyranRequest | TyranResponse => {
	if (typeof command !== 'object' || command === null) {
		return false;
	}

	return (
		(('refId' in command && typeof command.refId === 'string') ||
			('id' in command && typeof command.id === 'string')) &&
		'action' in command
	);
};
