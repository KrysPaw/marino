import type { z } from 'zod';

export type OptionalSchema<T> = T extends z.ZodTypeAny ? T : z.ZodTypeAny;
