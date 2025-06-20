import type { RequestContext } from './request.context';
import type { Tyran6Config } from './tyran-config';

export type RequestHandler<
	C extends Tyran6Config,
	A extends keyof C['actions'],
> = (context: RequestContext<C, C['actions'][A]>) => void;
