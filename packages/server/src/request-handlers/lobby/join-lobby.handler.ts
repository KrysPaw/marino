import { app } from "../../app";

app.setRequestHandler('JOIN_LOBBY', ({ client, payload, modules, respond, send }) => {
  const { code } = payload;

  // Find lobby by code
  const lobby = modules.lobbyManager.getLobbyByCode(code);

  if (!lobby) {
    respond({
      status: 'ERROR',
      errorCode: 'LOBBY_NOT_FOUND'
    });
    return;
  }

  const playersToBeNotified = lobby.getPlayers().filter(player => player.id !== client.id);

  // Add client to lobby
  lobby.addPlayer({
    // Player is host when they are the first to join the lobby
    type: 'MOST_LIKELY_HUMAN',
    isHost: lobby.getPlayers().length === 0,
    id: client.id,
    nickname: client.nickname,
  })

  client.state.lobbyId = lobby.getId();

  const lobbyState = lobby.getInfo();

  respond({
    status: 'SUCCESS',
    data: lobbyState
  });

  playersToBeNotified.forEach(player => {
    if (player.type === 'AI') {
      return;
    }

    send(player.id, 'UPDATE_LOBBY_INFO', lobbyState);
  });
});
