import { WebSocketServer, type WebSocket, type Data as WebSocketData } from 'ws';
import dgram from 'dgram';
import { v4 } from 'uuid';
import { Space } from './space.js';
import { Client } from './client.js';
import { Command, Event, SpaceConfig, TyranConfig } from '../types/index.js';
import { Manager } from './manager.js';
import NodeRSA from 'node-rsa';
import { TyranConfigManager } from './tyranConfigManager.js';
import { getTyranAsciiLogo } from '../utils/getTyranAsciiLogo.js';
import packageJson from '../../package.json';
import { Logger } from './logger.js';
import { objectKeys } from '../utils/objectKeys.js';
import { logger } from "./logger.js";
import { DataSource } from 'typeorm';

export class Tyran<TSpaces extends Record<string, (new (...args: ConstructorParameters<typeof Space>) => Space)> = any> {
    private static instance: Tyran<{}>;
    private wsServer: WebSocketServer | null = null;
    private config: TyranConfigManager;
    private spaces: TSpaces;
    private clients: Record<string, Client> = {};
    private spaceInstances: Record<string, any> = {};
    private defaultSpace?: string;
    private manager: Manager<TSpaces>;
    private rsaKeys: { publicKey: string, privateKey: string };
    private onRequestHandler: ((client: Client, command: Command) => void) | null = null;
    private onDataHandler: ((client: Client, data: Buffer) => void) | null = null;
    private onClientSpaceChangeHandler: ((client: Client, space: Space) => void) | null = null;
    private onClientConnectHandler: ((client: Client) => void) | null = null;
    private onClientDisconnectHandler: ((client: Client) => void) | null = null;
    private logger: Logger;
    private typeOrmConnection: unknown | null = null;

    private generateRsaKeys() {
        const keys = new NodeRSA({ b: 512 });
        const publicKey = keys.exportKey('public');
        const privateKey = keys.exportKey('private');

        return { publicKey, privateKey };
    }

    constructor(tyranSetup: new () => any, config: TyranConfig) {
        console.log('================================');
        console.log('\x1b[33m', getTyranAsciiLogo());
        console.log('\x1b[32m%s\x1b[0m', `\t Tyran5 v${packageJson.version}`);
        console.log('================================');

        this.logger = new Logger();
        this.spaces = Reflect.getMetadata('__SPACES__', tyranSetup).reduce((acc: object, space: new (...args: any) => any) => ({
            ...acc,
            [Reflect.getMetadata('__SPACE__', space)]: space
        }), {});

        objectKeys(this.spaces).forEach((spaceName) => {
            this.logger.logAppInitializationStep('success', `Space "${spaceName}" successfully initialized`);
        })

        this.defaultSpace = config.defaultSpace;
        this.typeOrmConnection = config.TypeOrmAppDataSource || null;

        this._validateDefaultSpace();

        this.manager = new Manager<TSpaces>(
            this._createSpaceInstance.bind(this),
            this.typeOrmConnection as DataSource
        );
        this.config = new TyranConfigManager(config);


        this.rsaKeys = this.generateRsaKeys();


    }

    static createApp(tyranSetup: new () => any, config: TyranConfig = {}) {
        if (this.instance) {
            throw new Error('Tyran instance already exists');
        }

        this.instance = new Tyran(tyranSetup, config);

        return this.instance;
    }

    private _onConnect(ws: WebSocket) {
        const client = new Client({
            sessionId: v4(),
            tcpSocket: ws, // Replacing TCP socket with WebSocket
            config: this.config,
            onClientSpaceChangeHandler: this._onClientSpaceChange.bind(this)
        });

        this.clients[client.id] = client;

        if (this.onClientConnectHandler) {
            this.onClientConnectHandler(client);
        }

        client.handleConnect(this.rsaKeys.publicKey);

        ws.on('message', (data: any) => {
            this._onData(client, data);
        });
        ws.on('error', this._onError.bind(this));
        ws.on('close', (code: any, reason: any) => this._onClose(client, code, reason));

        if (this.defaultSpace) {
            const spaceInstance = this._createSpaceInstance(this.defaultSpace);

            this._setClientSpace(client, spaceInstance);
        }
    }

    private _onData(client: Client, data: WebSocketData) {
        if (this.onDataHandler) {
            this.onDataHandler(client, data as Buffer);
        }

        let stringData = data.toString();

        let parsedData: Command;

        try {
            parsedData = JSON.parse(stringData);
        } catch (e) {
            this.logger.logError('Invalid data format (not JSON)');
            return;
        }

        const dataKeys = Object.keys(parsedData);

        if (!dataKeys.includes('action')) {
            logger.logError('Invalid data format (no action)');
            return;
        }

        this._onRequest(client, parsedData);
    }

    private _onError(error: Error) {
        logger.logError(`WebSocket error: ${error.message}`);
    }

    private _onClose(client: Client, code: number, reason: Buffer) {
        if (this.onClientDisconnectHandler) {
            this.onClientDisconnectHandler(client);
        }

        logger.logInfo(`Client ${client.id} disconnected with code ${code} and reason ${reason.toString()}`);
    }

    private _onRequest(client: Client, command: Command) {
        if (this.onRequestHandler) {
            this.onRequestHandler(client, command);
        }

        const { space: spaceName, action } = command;

        if (spaceName && !(spaceName in this.spaces)) {
            logger.logError('Invalid space name in command');
            return;
        }

        client.handleCommand(client, command);
    }

    private _onClientSpaceChange(client: Client, space: Space) {
        if (this.onClientSpaceChangeHandler) {
            this.onClientSpaceChangeHandler(client, space);
        }

        const clientCurrentSpace = client.getCurrentSpace();

        if (clientCurrentSpace) {
            const currentControllerPropertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(clientCurrentSpace.controller));

            for (const propertyName of currentControllerPropertyNames) {
                const eventName: Event = Reflect.getMetadata('__EVENT_ACTION__', clientCurrentSpace.controller[propertyName]);

                if (eventName === 'onClientLeave') {
                    clientCurrentSpace.controller[propertyName](client);
                    break;
                }
            }
        }

        const nextControllerPropertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(space.controller));

        for (const propertyName of nextControllerPropertyNames) {
            const eventName: Event = Reflect.getMetadata('__EVENT_ACTION__', space.controller[propertyName]);

            if (eventName === 'onClientJoin') {
                space.controller[propertyName](client);
                break;
            }
        }
    }

    private _createSpaceInstance(spaceName: string, config?: SpaceConfig) {
        const uuid = v4();
        const space = this.spaces[spaceName];

        const mergedConfig = {
            ...Reflect.getMetadata('__CONFIG__', space),
            ...config
        };

        const spaceInstance = new Space({
            name: spaceName,
            config: mergedConfig,
            manager: this.manager,
            controllerClass: Reflect.getMetadata('__CONTROLLER__', space),
            serviceClass: Reflect.getMetadata('__SERVICE__', space),
            modulesClasses: Reflect.getMetadata('__MODULES__', space)
        });

        this.spaceInstances[uuid] = spaceInstance;

        return spaceInstance;
    }

    private _setClientSpace(client: Client, spaceInstance: Space) {
        client.setCurrentSpace(spaceInstance);
    }

    private _validateDefaultSpace() {
        if (!(this.defaultSpace && this.defaultSpace in this.spaces)) {
            throw new Error('Default space name does not match any declared spaces');
        }
    }

    listen(port: number | string) {
        this.wsServer = new WebSocketServer({ port: Number(port) });

        this.wsServer.on('connection', (ws: WebSocket) => {
            this._onConnect(ws);
        });

        this.logger.logAppInitializationStep('success', `WebSocket server listening on port ${port}`);
    }

    onRequest(handler: (client: Client, command: Command) => void) {
        this.onRequestHandler = handler;
    }

    onData(handler: (client: Client, data: Buffer) => void) {
        this.onDataHandler = handler;
    }

    onClientSpaceChange(handler: (client: Client, space: Space) => void) {
        this.onClientSpaceChangeHandler = handler;
    }

    onClientConnect(handler: (client: Client) => void) {
        this.onClientConnectHandler = handler;
    }

    onClientDisconnect(handler: (client: Client) => void) {
        this.onClientDisconnectHandler = handler;
    }
}