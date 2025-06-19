import { Module, Store } from "tyran5";

type LobbyState = {
    a: number;
    b: number;
}

@Module
export class LobbyStore extends Store<LobbyState> {
    readonly state = {
        a: 0,
        b: 0
    }

    storeSetA(a: number) {
        this.setState(state => {
            state.a = a;
        })
    }

    getA() {
        return this.state.a;
    }
};