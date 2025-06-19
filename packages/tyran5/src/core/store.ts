export class Store<TState> {
    protected readonly state: TState = {} as TState;
    private onStateChangeHandler: ((prevState: TState, newState: TState) => void);

    constructor(onStateChangeHandler: (prevState: TState, newState: TState) => void) {
        this.onStateChangeHandler = onStateChangeHandler || (() => {});
    }

    protected setState(recipe: (state: TState) => void) {
        const prevState = { ...this.state };

        recipe(this.state);

        if (this.state !== prevState) {
            this.onStateChangeHandler(prevState, this.state);
        }
    }

    protected getState<T = any>(recipe?: (state: TState) => T): T | TState {
        return recipe ? recipe(this.state) : this.state;
    }
}