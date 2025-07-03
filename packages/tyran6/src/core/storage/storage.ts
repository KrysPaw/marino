import type { z } from 'zod';

export class Storage<T extends z.ZodTypeAny> {
	private state: z.infer<T> | null = null;
	private observers: Record<string, (state: z.infer<T>) => void> = {};

	public getState(): z.infer<T> {
		if (this.state === null) {
			throw new Error('Storage is not initialized. Use initialize() first.');
		}

		return structuredClone(this.state);
	}

	public setState(fn: (state: z.infer<T>) => z.infer<T>): z.infer<T> {
		if (this.state === null) {
			throw new Error('Storage is not initialized. Use initialize() first.');
		}

		this.state = fn(this.state);

		Object.values(this.observers).forEach((observer) => {
			observer(structuredClone(this.state));
		});

		return structuredClone(this.state);
	}

	public initialize(initialState: z.infer<T>): void {
		if (this.state !== null) {
			throw new Error(
				'Storage is already initialized. Use setState() to modify the state.',
			);
		}

		this.state = structuredClone(initialState);
	}

	public onChange(
		observer: (state: z.infer<T>) => void,
	): () => void {
		const id = crypto.randomUUID();
		this.observers[id] = observer;

		return () => {
			delete this.observers[id];
		};
	}
}
