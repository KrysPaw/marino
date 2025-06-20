import type { z } from 'zod';

export class Storage<T extends z.ZodTypeAny> {
	private state: z.infer<T> | null = null;

	public getState(): z.infer<T> {
		if (this.state === null) {
			throw new Error('Storage is not initialized. Use initialize() first.');
		}

		return structuredClone(this.state);
	}

	public setState(fn: (state: z.infer<T>) => z.infer<T>): void {
		if (this.state === null) {
			throw new Error('Storage is not initialized. Use initialize() first.');
		}

		this.state = fn(this.state);
	}

	public initialize(initialState: z.infer<T>): void {
		if (this.state !== null) {
			throw new Error(
				'Storage is already initialized. Use setState() to modify the state.',
			);
		}

		this.state = structuredClone(initialState);
	}
}
