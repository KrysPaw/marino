import { app } from "../../app";

app.setRequestHandler('CREATE_LOBBY', ({ client, respond, modules }) => {
  const lobby = modules.lobbyManager.createLobby(client.id);

  client.state.lobbyId = lobby.getId();

  respond(lobby.getInfo());
});