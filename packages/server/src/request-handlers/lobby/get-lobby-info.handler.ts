import { app } from "../../app";

app.setRequestHandler('GET_LOBBY_INFO', ({ client, modules, respond }) => {
  if (!client.state.lobbyId) {
    console.warn('Client is not in a lobby');
    return;
  }

  const lobby = modules.lobbyManager.getLobbyById(client.state.lobbyId);

  if (!lobby) {
    console.warn(`Lobby with id ${client.state.lobbyId} not found`);
    return;
  }

  // Respond with lobby info
  respond(lobby.getInfo());
});