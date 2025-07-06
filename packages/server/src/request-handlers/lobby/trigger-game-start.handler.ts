import { Status, TyranError } from "shared";
import { app } from "../../app";

app.setRequestHandler('TRIGGER_GAME_START', ({ client, payload, modules, respond, send }) => {
  const clientLobbyId = client.state.lobbyId;
  const { lobbyId } = payload;

  // Assert that the client is in the provided lobby
  if (!clientLobbyId || clientLobbyId !== lobbyId) {
    respond({
      status: Status.ERROR,
      errorCode: TyranError.NOT_IN_LOBBY
    });
    return;
  }

  const lobby = modules.lobbyManager.getLobbyById(lobbyId);

  // Assert that the lobby exists
  if (!lobby) {
    respond({
      status: Status.ERROR,
      errorCode: TyranError.LOBBY_NOT_FOUND
    });
    return;
  }

  // Assert that the client is the host of the lobby
  if (lobby.getHostId() !== client.id) {
    respond({
      status: Status.ERROR,
      errorCode: TyranError.NOT_HOST
    });
    return;
  }

  // Assert that the game has not already started
  if (lobby.getState() !== 'LOBBY') {
    respond({
      status: Status.ERROR,
      errorCode: TyranError.GAME_ALREADY_STARTED
    });
    return;
  }

  // Assert that the lobby has enough players to start the game
  if (lobby.getBlueTeam().length === 0 || lobby.getRedTeam().length === 0) {
    respond({
      status: Status.ERROR,
      errorCode: TyranError.NOT_ENOUGH_PLAYERS
    });
    return;
  }

  lobby.prepareGame();

  respond({
    status: Status.SUCCESS
  });

  lobby.getPlayers().forEach(player => {
    send(player.id, 'START_GAME', undefined);
  });

  setTimeout(() => {
    lobby.startGame();

    const players = lobby.getPlayers();

    players.forEach(player => {
      if (player.type === 'AI') {
        return;
      }

      send(player.id, 'UPDATE_LOBBY_INFO', lobby.getInfo());
    });
  }, 3000);
});