import type { ValueOf } from "@shared";

export const GameState = {
  MENU: 'MENU',
  LOBBY: 'LOBBY',
  GAME: 'GAME',
} as const;

export type General = {
  state: ValueOf<typeof GameState>;
}