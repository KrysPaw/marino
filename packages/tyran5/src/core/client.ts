import { WebSocket } from 'ws';
import { Socket as UDPSocket } from "dgram";
import { v4 } from "uuid";
import { Space } from "./space.js";
import { Command } from "../types/index.js";
import NodeRSA from "node-rsa";
import { TyranConfigManager } from "./tyranConfigManager.js";
import { logger } from "./logger.js";

const INTERNAL_ACTIONS = [
    '_HANDSHAKE_',
    '_HANDSHAKE_COMPLETE_'
];

type ClientConstructorConfig = {
    sessionId: string;
    tcpSocket: WebSocket; // Changed from TCPSocket to WebSocket
    udpSocket?: UDPSocket;
    config: TyranConfigManager;
    onClientSpaceChangeHandler: (client: Client, space: Space) => void;
};

export class Client {
    readonly id: string;
    private sessionId: string;
    private tcpSocket: WebSocket; // Changed from TCPSocket to WebSocket
    private udpSocket: UDPSocket | null = null;
    private currentSpace?: Space;
    private handshakeCompleted: boolean = false;
    private onClientSpaceChangeHandler: (client: Client, space: Space) => void;
    private publicKey: NodeRSA | null = null;
    private config: TyranConfigManager;
    private storage: Record<string, any> = {};

    constructor(props: ClientConstructorConfig) {
        this.id = v4();
        this.sessionId = props.sessionId;
        this.tcpSocket = props.tcpSocket; // Updated to WebSocket
        this.currentSpace = undefined;
        this.config = props.config;
        this.onClientSpaceChangeHandler = props.onClientSpaceChangeHandler;
    }

    private _completeHandshake() {
        if (this.handshakeCompleted) {
            return;
        }

        this.handshakeCompleted = true;
        logger.logInfo(`Client ${this.id} handshake completed`);

        const ref = crypto.randomUUID();

        this.sendCommand({
            refId: ref,
            action: '_HANDSHAKE_COMPLETE_',
            encrypted: false,
            payload: {
                secret: "Ędward ĘĄcki"
            }
        });
    }

    private _onConnect(key?: string) {
        logger.logInfo(`Client ${this.id} connected`);

        const ref = crypto.randomUUID();

        this.sendCommand({
            refId: ref,
            action: '_HANDSHAKE_',
            payload: {
                ...(this.config.isEncryptionEnabled() ? { key } : {})
            }
        });
    }

    private _onCommand(client: Client, command: Command) {
        const { space: spaceName, action } = command;

        if (this.isHandshakeCompleted() === false && action !== '_HANDSHAKE_') {
            logger.logWarning(`Client ${this.id} handshake is not completed`);
            return;
        } else if (action === '_HANDSHAKE_') {
            this._handleInternalCommand(client, command);

            return;
        }

        if (spaceName && this.currentSpace && this.currentSpace.name === spaceName) {
            const controllerPropertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this.currentSpace.controller));

            for (const propertyName of controllerPropertyNames) {
                const commandAction = Reflect.getMetadata('__COMMAND_ACTION__', this.currentSpace.controller[propertyName]);

                if (commandAction === action) {
                    try {
                        this.currentSpace.controller[propertyName]({
                            client: this,
                            payload: command.payload,
                            respond: (payload: any) => {
                                if (this.currentSpace) {
                                    this.sendCommand({
                                        refId: command.refId,
                                        action: commandAction,
                                        payload,
                                        encrypted: command.encrypted
                                    });
                                } else {
                                    logger.logWarning(`Client ${this.id} is not in space ${spaceName}`);
                                }
                            }
                        });
                    } catch (error) {
                        console.error(`Error while executing command ${action} in space ${spaceName}`);
                        console.error(error);
                    }

                    break;
                }
            }
        } else if (!spaceName && INTERNAL_ACTIONS.includes(command.action)) {
            this._handleInternalCommand(client, command);
            return;
        }

        logger.logInfo(`command ${JSON.stringify(command, null, 2)}`, 2);
    }

    private _handleInternalCommand(client: Client, command: Command) {
        switch (command.action) {
            case '_HANDSHAKE_':
                this._handleHandshake(client, command);
                break;
        }
    }

    private _handleHandshake(client: Client, command: Command) {
        if (this.isHandshakeCompleted()) {
            throw new Error('Handshake is already completed');
        }

        if (this.config.isEncryptionEnabled() === false) {
            this._completeHandshake();
            return;
        }

        if (command.payload.key === undefined) {
            console.error('Invalid handshake payload. Encryption is enabled but no key is provided. Provide a client public key to complete the handshake or disable encryption in the Tyran config (encryptionConfig.enabled = false)');
            return;
        }

        const { sessionId } = command.payload;

        if (sessionId) {
            client.setSessionId(sessionId);
        }

        try {
            this.setPublicKey(new NodeRSA(command.payload.key));
            this._completeHandshake();
        } catch (e) {
            logger.logWarning(`Client ${this.id} provided an invalid public key ${command.payload.key}`);
        }
    }

    getSessionId() {
        return this.sessionId;
    }

    setSessionId(sessionId: string) {
        this.sessionId = sessionId;
    }

    setCurrentSpace(newSpace: Space) {
        this.onClientSpaceChangeHandler(this, newSpace);

        if (this.currentSpace) {
            this.currentSpace.removeClient(this);
        }

        newSpace.addClient(this);

        this.currentSpace = newSpace;
    }

    setPublicKey(publicKey: NodeRSA) {
        this.publicKey = publicKey;
    }

    getPublicKey() {
        return this.publicKey;
    }

    isHandshakeCompleted() {
        return this.handshakeCompleted;
    }

    getCurrentSpace() {
        return this.currentSpace;
    }

    getSocket() {
        return this.tcpSocket;
    }

    sendCommand(command: Command) {
        if (this.config.isEncryptionEnabledByDefault() === true && !INTERNAL_ACTIONS.includes(command.action)) {
            command.encrypted = true;
        }

        if (command.encrypted) {
            if (this.config.isEncryptionEnabled() === false) {
                throw new Error('Encryption is not enabled. Set encryptionConfig.enabled to true in the Tyran config');
            }

            if (!this.publicKey) {
                throw new Error('Client public key is not set');
            }

            const encoding = this.config.getEncryptionEncoding();

            const payload = encoding === 'buffer'
                ? Buffer.from(JSON.stringify(command.payload))
                : JSON.stringify(command.payload);

            const encryptedPayload = this.publicKey.encrypt(payload, encoding);

            command = {
                ...command,
                payload: encryptedPayload
            }
        }

        logger.logInfo(`Sending command ${JSON.stringify(command, null, 2)}`, 2);
        this.tcpSocket.send(JSON.stringify(command)); // Updated to use WebSocket's send method
    }

    getInfo(key: string) {
        return this.storage[key];
    }

    setInfo(key: string, value: any) {
        this.storage[key] = value;
    }

    handleCommand(client: Client, command: Command) {
        this._onCommand(client, command);
    }

    handleConnect(key?: string) {
        this._onConnect(key);
    }

    openUDPSocket(port: number) {

    }
}