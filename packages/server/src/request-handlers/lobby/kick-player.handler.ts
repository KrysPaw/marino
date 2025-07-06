import { app } from "../../app";

app.setRequestHandler('KICK_PLAYER', ({ client, payload, modules, respond, send }) => {
  const clientLobbyId = client.state.lobbyId;
  const { lobbyId, playerId } = payload;

  // Assert that the client is in the provided lobby
  if (!clientLobbyId || clientLobbyId !== lobbyId) {
    respond({
      status: 'ERROR',
      errorCode: 'NOT_IN_LOBBY'
    });
    return;
  }

  const lobby = modules.lobbyManager.getLobbyById(lobbyId);
  const kickedPlayer = lobby?.getPlayers().find(player => player.id === playerId);

  // Assert that the lobby exists
  if (!lobby) {
    respond({
      status: 'ERROR',
      errorCode: 'LOBBY_NOT_FOUND'
    });
    return;
  }

  // Assert that the client is the host of the lobby
  if (lobby.getHostId() !== client.id) {
    respond({
      status: 'ERROR',
      errorCode: 'NOT_HOST'
    });
    return;
  }

  // Kick the player from the lobby
  lobby.removePlayer(playerId);

  respond({
    status: 'SUCCESS',
  });

  // Notify all players in the lobby about the updated lobby info
  lobby.getPlayers().forEach(player => {
    if (player.type === 'AI') {
      return;
    }

    send(player.id, 'UPDATE_LOBBY_INFO', lobby.getInfo());
  });

  //Notify the kicked player
  if (kickedPlayer?.type !== 'AI') {
    send(playerId, 'KICK_LEAVE_LOBBY', undefined);
  }
});