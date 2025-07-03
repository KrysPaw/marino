import { app } from "../app";

app.setOnClientJoinHandler(({ client, send }) => {
  send(client.id, "CLIENT_INFO", {
    clientId: client.id,
    nickname: client.nickname,
    lobbyId: client.state.lobbyId,
  });
});

app.setOnClientLeaveHandler(({ client, modules, send }) => {
  const lobbyId = client.state.lobbyId;

  if (!lobbyId) return;

  const lobby = modules.lobbyManager.getLobbyById(lobbyId);

  if (!lobby) return;

  lobby.removePlayer(client.id);

  const remainingPlayers = lobby.getPlayers();

  for (const player of remainingPlayers) {
    send(player.id, "UPDATE_LOBBY_INFO", {
      code: lobby.getCode(),
      lobbyId: lobby.getId(),
      players: remainingPlayers,
      blueTeam: lobby.getBlueTeam(),
      redTeam: lobby.getRedTeam(),
    });
  }
});