import { app } from "../../app";

app.setRequestHandler('SWITCH_TEAM', ({ client, modules, send }) => {
  const clientId = client.id;
  const lobbyId = client.state.lobbyId;

  if (!lobbyId) {
    console.log('Client is not in a lobby');
    return;
  }

  const lobby = modules.lobbyManager.getLobbyById(lobbyId);

  if (!lobby) {
    console.log('Lobby not found for client', clientId);
    return;
  }

  const switchResult = lobby.switchTeam(clientId);

  if (switchResult.status !== 'SUCCESS') {
    return;
  }

  const players = lobby?.getPlayers() || [];

  players.forEach(player => {
    if (player.type === 'AI') {
      return;
    }

    send(player.id, 'UPDATE_LOBBY_INFO', lobby.getInfo());
  });
});