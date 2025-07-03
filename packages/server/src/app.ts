import { Tyran6 } from 'tyran6';
import { z } from 'zod';
import { actions } from './config/actions.config';
import { LobbyManager } from './lobbyManager';

export const app = new Tyran6({
  actions,
  storageStateSchema: z.object({
    lobbies: z.record(
      z.string(), // Lobby ID
      z.object({
        id: z.string(),
        code: z.string(),
        players: z.array(z.object({
          isHost: z.boolean(),
          id: z.string(),
          nickname: z.string()
        }))
      })
    )
  }),
  clientStateSchema: z.object({
    lobbyId: z.string().optional()
  }),
  modules: {
    "lobbyManager": LobbyManager
  }
});

app.initializeStorageState({
  lobbies: {}
});

app.initializeClientState({
  lobbyId: undefined
})

require('./event-handlers');
require('./request-handlers');