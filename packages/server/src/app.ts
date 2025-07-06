import * as fs from 'node:fs';
import path from 'node:path';
import { Tyran6 } from 'tyran6';
import { z } from 'zod';
import { actions } from './config/actions.config';
import { LobbyManager } from './modules';

export const app = new Tyran6({
  actions,
  storageStateSchema: z.object({
    lobbies: z.record(
      z.string(), // Lobby ID
      z.object({
        id: z.string(),
        code: z.string(),
        players: z.array(
          z.object({
            isHost: z.boolean(),
            id: z.string(),
            nickname: z.string(),
          }),
        ),
      }),
    ),
  }),
  clientStateSchema: z.object({
    lobbyId: z.string().optional(),
  }),
  modules: {
    lobbyManager: LobbyManager,
  },
});

app.initializeStorageState({
  lobbies: {},
});

app.initializeClientState({
  lobbyId: undefined,
});


// Require handlers
const handlersDir = path.join(__dirname, 'request-handlers');

function requireHandlersRecursively(dir: string) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      requireHandlersRecursively(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.handler.ts') || entry.name.endsWith('.handler.js'))) {
      console.log('\x1b[36mRegistered request handler -', entry.name, '\x1b[0m');
      require(fullPath);
    }
  });
}

requireHandlersRecursively(handlersDir);

require('./event-handlers');