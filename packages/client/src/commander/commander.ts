import type { LocalActionPayloadType, LocalActionType } from './localAction';

type Subscription<T extends LocalActionType> = {
	id: string;
	action: T;
	callback: (payload: LocalActionPayloadType<T>) => void;
};

export class Commander {
	static instance: Commander;
	private subscriptions: {
		[A in LocalActionType]?: Record<Subscription<A>['id'], Subscription<A>>;
	} = {};

	private constructor() {
		if (Commander.instance) {
			throw new Error(
				'Commander is a singleton and has already been instantiated.',
			);
		}
		Commander.instance = this;
	}

	static getInstance(): Commander {
		if (!Commander.instance) {
			Commander.instance = new Commander();
		}
		return Commander.instance;
	}

	private getSubscriptionsListForAction<T extends LocalActionType>(
		action: T,
	): Subscription<T>[] {
		if (!this.subscriptions[action]) {
			this.subscriptions[action] = {};
		}

		return Object.values(this.subscriptions[action] || {});
	}

	/**
	 * Subscribes to a local action and returns a unique subscription ID.
	 * Executes the callback with the payload when the action is dispatched.
	 */
	subscribe<T extends LocalActionType>(
		action: T,
		callback: (payload: LocalActionPayloadType<T>) => void,
	): string {
		const id = crypto.randomUUID();
		const subscription: Subscription<T> = { id, action, callback };

		if (!this.subscriptions[action]) {
			this.subscriptions[action] = {};
		}

		this.subscriptions[action][id] = subscription;

		return id;
	}

	/**
	 * Returns true if the subscription was found and removed, false otherwise.
	 */
	unsubscribe<T extends LocalActionType>(id: string, action: T): boolean {
		if (this.subscriptions[action]?.[id]) {
			delete this.subscriptions[action][id];

			return true;
		}

		return false;
	}

	/**
	 * Dispatches a local action to all subscribers of that action.
	 * Executes the callback with the payload for each subscriber.
	 */
	dispatch<T extends LocalActionType>(
		action: T,
		payload: LocalActionPayloadType<T>,
	): void {
		const subscriptions = this.getSubscriptionsListForAction(action);

		for (const subscription of subscriptions) {
			if (subscription.action === action) {
				subscription.callback(payload);
			}
		}
	}
}
