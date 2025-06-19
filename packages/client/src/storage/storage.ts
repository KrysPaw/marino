import type { State } from "./types/state.type";

const initialState: State = {
  general: {
    state: 'MENU'
  },
  game: {
    players: {},
    teams: {
      red: {
        players: {},
      },
      blue: {
        players: {},
      }
    },
    skirmishes: []
  }
}

export class Storage {
  private static instance: Storage;
  private state: State = initialState;

  constructor() {
    if (Storage.instance) {
      throw new Error('Storage is a singleton class. Use getInstance() to access it.');
    }

    Storage.instance = this;
  }

  public static getInstance(): Storage {
    if (!Storage.instance) {
      Storage.instance = new Storage();
    }

    return Storage.instance;
  }

  getState() {
    return structuredClone(this.state);
  }

  setState(fn: (prevState: State) => State): void {
    const newState = fn(structuredClone(this.state));
    this.state = newState;
  }
}