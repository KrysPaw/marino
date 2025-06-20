import { Tyran6 } from 'tyran6';
import { z } from 'zod';
import { actions } from './config/actions.config';

export const app = new Tyran6({
	actions,
	storageStateSchema: z.object({}),
});
