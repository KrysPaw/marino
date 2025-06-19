import { Space } from "tyran5";
import { LobbyController } from "./lobby.controller.js";
import { LobbyRepository } from "./lobby.repository.js";
import { LobbyService } from "./lobby.service.js";
import { LobbyStore } from "./lobby.store.js";

@Space('LOBBY', {
    controller: LobbyController,
    service: LobbyService,
    modules: [LobbyRepository, LobbyStore]
})
export class LobbySpace { };