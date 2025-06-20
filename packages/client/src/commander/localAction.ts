import { z } from 'zod/v4';

const LocalActionList = ['DO', 'UNDO'] as const;

export type LocalActionType = (typeof LocalActionList)[number];

export const LocalAction: { [K in LocalActionType]: Uppercase<K> } =
	Object.fromEntries(
		LocalActionList.map((action) => [
			action.toUpperCase(),
			action.toUpperCase(),
		]),
	) as { [K in LocalActionType]: Uppercase<K> };

export const LocalActionPayloadScheme = {
	DO: z.object({
		what: z.string(),
	}),
	UNDO: z.string(),
} satisfies Record<keyof typeof LocalAction, z.ZodType>;

export type LocalActionPayloadType<T extends keyof typeof LocalAction> =
	z.infer<(typeof LocalActionPayloadScheme)[T]>;
