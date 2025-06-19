import { Manager, Module } from "tyran5";
import { LobbyStore } from "./lobby.store.js";

@Module
export class LobbyRepository {
    constructor(private manager: Manager) { }
}