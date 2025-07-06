import { generateGameCode } from 'shared';
import type { ModuleArgs } from 'tyran6';
import type { app } from '../app';
import { Lobby } from '../lobby/lobby';

export class LobbyManager {
  private lobbies: Map<string, Lobby> = new Map();
  private lobbyCloseTimeouts: Map<string, NodeJS.Timeout> = new Map();

  constructor(private context: ModuleArgs<typeof app>) { }

  getLobbyById(id: string): Lobby | undefined {
    return this.lobbies.get(id);
  }

  getLobbyByCode(code: string): Lobby | undefined {
    for (const lobby of this.lobbies.values()) {
      if (lobby.getCode() === code) {
        return lobby;
      }
    }
  }

  createLobby(clientId: string): Lobby {
    const id = crypto.randomUUID();
    const code = generateGameCode();

    const lobby = new Lobby(this, id, code, {
      id: clientId,
      type: 'MOST_LIKELY_HUMAN',
      isHost: true,
      nickname: this.context.clients.getConnectedClientById(clientId)?.nickname || 'No-name',
    });

    this.lobbies.set(id, lobby);

    return lobby;
  }

  triggerLobbyClose(id: string): void {
    this.lobbyCloseTimeouts.set(
      id,
      setTimeout(() => {
        const lobby = this.lobbies.get(id);
        if (lobby) {
          this.lobbies.delete(id);
        }
      }, 1000),
    );
  }

  cancelLobbyClose(id: string): void {
    const timeout = this.lobbyCloseTimeouts.get(id);

    if (timeout) {
      clearTimeout(timeout);
      this.lobbyCloseTimeouts.delete(id);
    }
  }

  removeLobby(id: string): void {
    this.lobbies.delete(id);
  }
}
