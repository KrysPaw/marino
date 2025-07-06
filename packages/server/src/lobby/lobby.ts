import shuffle from 'lodash/shuffle';
import type {
  Game,
  LobbyPlayer,
  LobbyPlayerTeam,
  LobbyState,
  ValueOf,
} from 'shared';
import type { Optional } from 'utility-types';
import { aiNames } from '../config/ai-names.config';
import type { LobbyManager } from '../modules';
import type { Result } from '../types/result.type';
import { result } from '../utils';

const PLAYER_LIMIT: 2 | 4 | 6 | 8 = 8;

type AddPlayerResult =
  | { status: 'SUCCESS' }
  | { status: 'ERROR'; errorCode: 'FULL' | 'ALREADY_EXISTS' };

type LobbyInfo = {
  code: string;
  lobbyId: string;
  state: ValueOf<typeof LobbyState>;
  players: Array<LobbyPlayer>;
  blueTeam: Array<LobbyPlayer>;
  redTeam: Array<LobbyPlayer>;
  game: Game;
};

export class Lobby {
  private manager: LobbyManager;
  private id: string;
  private code: string;
  private hostId: string;
  private players: Array<LobbyPlayer>;
  private teamBlue: Array<LobbyPlayer> = [];
  private teamRed: Array<LobbyPlayer> = [];
  private isClosing = false;
  private state: ValueOf<typeof LobbyState> = 'LOBBY';
  private game: Game = { skirmishes: [] };

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
        team: 'BLUE',
      },
    ];
    this.teamBlue = [this.players[0]];
    this.hostId = host.id;
  }

  getInfo(): LobbyInfo {
    return {
      code: this.code,
      lobbyId: this.id,
      state: this.state,
      players: this.players,
      blueTeam: this.teamBlue,
      redTeam: this.teamRed,
      game: this.game,
    };
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

  getState(): typeof this.state {
    return this.state;
  }

  setState(state: typeof this.state): void {
    this.state = state;
  }

  getGame(): Game {
    return this.game;
  }

  addPlayer(playerInput: Optional<LobbyPlayer, 'team'>): AddPlayerResult {
    if (this.players.some((p) => p.id === playerInput.id)) {
      return { status: 'ERROR', errorCode: 'ALREADY_EXISTS' };
    }

    if (this.isClosing) {
      this.manager.cancelLobbyClose(this.id);
    }

    let team: ValueOf<typeof LobbyPlayerTeam>;

    if (playerInput.team) {
      if (
        playerInput.team === 'BLUE' &&
        this.teamBlue.length >= PLAYER_LIMIT / 2
      ) {
        return { status: 'ERROR', errorCode: 'FULL' };
      }

      if (
        playerInput.team === 'RED' &&
        this.teamRed.length >= PLAYER_LIMIT / 2
      ) {
        return { status: 'ERROR', errorCode: 'FULL' };
      }

      team = playerInput.team;
    } else {
      team =
        this.teamBlue.length <= this.teamRed.length &&
          this.teamBlue.length < PLAYER_LIMIT / 2
          ? 'BLUE'
          : 'RED';
    }

    const player: LobbyPlayer = {
      ...playerInput,
      team,
    };

    this.players.push(player);

    player.team === 'BLUE'
      ? this.teamBlue.push(player)
      : this.teamRed.push(player);

    return { status: 'SUCCESS' };
  }

  removePlayer(playerId: string): void {
    this.players = this.players.filter((player) => player.id !== playerId);
    this.teamBlue = this.teamBlue.filter((player) => player.id !== playerId);
    this.teamRed = this.teamRed.filter((player) => player.id !== playerId);

    const humanPlayers = this.players.filter(
      (player) => player.type !== 'AI'
    );

    if (humanPlayers.length === 0) {
      this.manager.triggerLobbyClose(this.id);
      this.isClosing = true;
    }
  }

  switchTeam(playerId: string): Result {
    const player = this.players.find((p) => p.id === playerId);

    if (!player) {
      return result('ERROR', 'PLAYER_NOT_FOUND');
    }

    if (player.team === 'BLUE') {
      if (this.teamRed.length >= PLAYER_LIMIT / 2) {
        return result('ERROR', 'TEAM_FULL');
      }

      this.teamBlue = this.teamBlue.filter((p) => p.id !== playerId);
      player.team = 'RED';
      this.teamRed.push(player);
    } else {
      if (this.teamBlue.length >= PLAYER_LIMIT / 2) {
        return result('ERROR', 'TEAM_FULL');
      }

      this.teamRed = this.teamRed.filter((p) => p.id !== playerId);
      player.team = 'BLUE';
      this.teamBlue.push(player);
    }

    return result('SUCCESS');
  }

  setupSkirmishes(): void {
    const blueTeam = shuffle([...this.getBlueTeam()]);
    const redTeam = shuffle([...this.getRedTeam()]);

    // Create skirmishes randomly based on the teams
    const skirmishes: Game['skirmishes'] = [];

    while (blueTeam.length > 0 && redTeam.length > 0) {
      const bluePlayer = blueTeam.pop();
      const redPlayer = redTeam.pop();

      if (bluePlayer && redPlayer) {
        skirmishes.push({
          id: `${bluePlayer.id}-${redPlayer.id}`,
          state: 'NOT_STARTED',
          playerIds: [bluePlayer.id, redPlayer.id],
          playerTurn: bluePlayer.id,
        });
      }
    }

    this.game.skirmishes = skirmishes;
  }

  prepareGame(): void {
    this.setupSkirmishes();
    this.state = 'STARTING';
  }

  startGame(): void {
    this.state = 'IN_PROGRESS';
  }

  addAIPlayer(team: ValueOf<typeof LobbyPlayerTeam>): Result {
    if (this.players.length >= PLAYER_LIMIT) {
      return result('ERROR', 'LOBBY_FULL');
    }

    // To avoid same AI nicknames, we filter out already used names
    const availableNicknames = aiNames.filter(
      (name) => !this.players.some((player) => player.nickname === name)
    );

    const aiPlayer: LobbyPlayer = {
      id: crypto.randomUUID(),
      type: 'AI',
      nickname: availableNicknames[Math.floor(Math.random() * availableNicknames.length)],
      isHost: false,
      team,
    };

    this.addPlayer(aiPlayer);

    return result('SUCCESS');
  }
}
