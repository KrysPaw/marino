import { app } from '../app';

app.setRequestHandler('CREATE_LOBBY', ({ client, respond, modules }) => {
  const lobby = modules.lobbyManager.createLobby(client.id);

  client.state.lobbyId = lobby.getId();

  respond({
    code: lobby.getCode(),
    lobbyId: lobby.getId(),
    players: lobby.getPlayers(),
    blueTeam: lobby.getBlueTeam(),
    redTeam: lobby.getRedTeam(),
  });
});

app.setRequestHandler('SET_NICKNAME', ({ client, payload }) => {
  const { nickname } = payload;

  // Update client nickname
  client.nickname = nickname;
})

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
  respond({
    code: lobby.getCode(),
    lobbyId: lobby.getId(),
    players: lobby.getPlayers(),
    blueTeam: lobby.getBlueTeam(),
    redTeam: lobby.getRedTeam(),
  });
});

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
    isHost: lobby.getPlayers().length === 0,
    id: client.id,
    nickname: client.nickname,
  })

  client.state.lobbyId = lobby.getId();

  const lobbyState = {
    code: lobby.getCode(),
    lobbyId: lobby.getId(),
    players: lobby.getPlayers(),
    blueTeam: lobby.getBlueTeam(),
    redTeam: lobby.getRedTeam(),
  }

  respond({
    status: 'SUCCESS',
    data: lobbyState
  });

  playersToBeNotified.forEach(player => {
    send(player.id, 'UPDATE_LOBBY_INFO', lobbyState);
  });
});

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

  lobby?.switchTeam(clientId);

  const players = lobby?.getPlayers() || [];

  players.forEach(player => {
    send(player.id, 'UPDATE_LOBBY_INFO', {
      code: lobby.getCode(),
      lobbyId: lobby.getId(),
      players: lobby.getPlayers(),
      blueTeam: lobby.getBlueTeam(),
      redTeam: lobby.getRedTeam(),
    });
  });
})