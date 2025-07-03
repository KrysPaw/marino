import type { LobbyPlayer } from 'shared';
import type { LobbyManager } from '../lobbyManager';

const PLAYER_LIMIT: 2 | 4 | 6 | 8 = 8;

type AddPlayerResult = { status: 'SUCCESS' } | { status: 'ERROR', errorCode: 'FULL' | 'ALREADY_EXISTS' };

export class Lobby {
  private manager: LobbyManager;
  private id: string;
  private code: string;
  private hostId: string;
  private players: Array<LobbyPlayer>;
  private teamBlue: Array<LobbyPlayer> = [];
  private teamRed: Array<LobbyPlayer> = [];
  private isClosing = false;

  constructor(
    manager: LobbyManager,
    id: string,
    code: string,
    host: Omit<LobbyPlayer, 'team'>,
  ) {
    this.manager = manager;
    this.id = id;
    this.code = code;
    this.players = [
      {
        ...host,
        team: 'BLUE'
      }
    ];
    this.teamBlue = [this.players[0]];
    this.hostId = host.id;
  }

  getId(): string {
    return this.id;
  }

  getCode(): string {
    return this.code;
  }

  getHostId(): string | null {
    return this.hostId;
  }

  setHostId(hostId: string): void {
    this.hostId = hostId;
  }

  getPlayers(): Array<LobbyPlayer> {
    return this.players;
  }

  getBlueTeam(): Array<LobbyPlayer> {
    return this.teamBlue;
  }

  getRedTeam(): Array<LobbyPlayer> {
    return this.teamRed;
  }

  addPlayer(playerInput: Omit<LobbyPlayer, 'team'>): AddPlayerResult {
    if (this.players.some((p) => p.id === playerInput.id)) {
      return { status: 'ERROR', errorCode: 'ALREADY_EXISTS' };
    }

    if (this.isClosing) {
      this.manager.cancelLobbyClose(this.id);
    }

    const player: LobbyPlayer = {
      ...playerInput,
      team: this.teamBlue.length <= this.teamRed.length && this.teamBlue.length < PLAYER_LIMIT / 2 ? 'BLUE' : 'RED'
    }

    this.players.push(player);

    player.team === 'BLUE' ? this.teamBlue.push(player) : this.teamRed.push(player);

    return { status: 'SUCCESS' };
  }

  removePlayer(playerId: string): void {
    this.players = this.players.filter((player) => player.id !== playerId);
    this.teamBlue = this.teamBlue.filter((player) => player.id !== playerId);
    this.teamRed = this.teamRed.filter((player) => player.id !== playerId);

    if (this.players.length === 0) {
      this.manager.triggerLobbyClose(this.id);
      this.isClosing = true;
    }
  }

  switchTeam(playerId: string): void {
    const player = this.players.find((p) => p.id === playerId);
    
    if (!player) {
      return;
    }

    if (player.team === 'BLUE') {
      this.teamBlue = this.teamBlue.filter((p) => p.id !== playerId);
      player.team = 'RED';
      this.teamRed.push(player);
    } else {
      this.teamRed = this.teamRed.filter((p) => p.id !== playerId);
      player.team = 'BLUE';
      this.teamBlue.push(player);
    }
  }
}
