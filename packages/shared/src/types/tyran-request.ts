import type { z } from 'zod';
import type {
	TyranCommandAction,
} from '../enums';
import type { TyranCommandsType } from './tyran-commands-type';
import type { ValueOf } from './value-of.utility';

export type TyranCommandSchemaName = keyof Omit<
	TyranCommandsType[keyof typeof TyranCommandAction],
	'space'
>;

export type TyranRequest<
	T extends ValueOf<typeof TyranCommandAction> = ValueOf<
		typeof TyranCommandAction
	>,
> = {
	id: string;
	action: T;
	payload: z.infer<TyranCommandsType[T]['request']>;
};

export type TyranResponse<
	T extends ValueOf<typeof TyranCommandAction> = ValueOf<
		typeof TyranCommandAction
	>,
> = {
	refId: string;
	action: T;
	payload: z.infer<TyranCommandsType[T]['response']>;
};
