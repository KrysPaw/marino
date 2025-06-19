import { Client, Manager, Service } from "tyran5";
import { LobbyRepository } from "./lobby.repository.js";
import { LobbyStore } from "./lobby.store.js";

const mapSize = { width: 40, height: 40 };
const tileWidth = 128;
const tileHeight = 64;

@Service
export class LobbyService {
  constructor(
    private manager: Manager,
    private store: LobbyStore,
    private repository: LobbyRepository
  ) { }

  createGame(client: Client): void {

  }
}