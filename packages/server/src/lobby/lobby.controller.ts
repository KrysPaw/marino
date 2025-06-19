import { Controller, Client, Event, Command } from "tyran5";
import { LobbyService } from "./lobby.service.js";
import { TyranCommandAction } from 'shared';

@Controller(TyranCommandAction)
export class LobbyController {
    constructor(private lobbyService: LobbyService) { }

    @Event('onClientJoin')
    onClientJoin(client: Client) {
        console.log('Client joined');
    }

    @Event('onClientLeave')
    onClientLeave(client: Client) {
        console.log('Client left');
    }

    @Command(TyranCommandAction.CREATE_GAME)
    createGame(client: Client) {
        console.log('Creating game for client:', client.id);
        // Here you can call the lobby service to create a game
        this.lobbyService.createGame(client);

        // Optionally, you can send a response back to the client
        // client.sendCommand({
        //     action: TyranCommandAction.CREATE_GAME,
        //     payload: {
        //         refId: '',
        //         message: 'Game created successfully',
        //         gameId: '12345', // Example game ID
        //     },
        // });
    }
}