import { v4 } from "uuid";
import { Client } from "./client.js";
import { Manager } from "./manager.js";
import { SpaceConfig } from "../types/index.js";
import { logger } from "./logger.js";

type SpaceConstructorConfig<TController, TService> = {
    name: string;
    config: SpaceConfig;
    manager: Manager;
    controllerClass: TController;
    serviceClass: TService;
    modulesClasses: (new (...args: any) => any)[];
}

export class Space<T extends new (...args: any) => any = any, TController extends T = any, TService extends T = any> {
    uuid: string;
    name: string;
    clients: Record<string, Client>;
    controllerClass: TController;
    serviceClass: TService;
    controller: TController;
    service: TService;
    modulesClasses: (new (...args: any) => any)[];
    modules: Map<new (...args: any) => any, new (...args: any) => any>;
    modulesArgs: Record<string, T[]> = {};
    manager: Manager;
    config: SpaceConfig;

    constructor(props: SpaceConstructorConfig<TController, TService>) {
        this.uuid = v4();
        this.name = props.name;
        this.clients = {};
        this.manager = props.manager;
        this.controllerClass = props.controllerClass;
        this.serviceClass = props.serviceClass;
        this.modulesClasses = props.modulesClasses;

        this.modules = new Map(props.modulesClasses.map((Module) => [Module, this._createModuleInstance(Module)]));

        this.modulesArgs.service = this._classToConstructorArgs(props.serviceClass);
        const service = this._createModuleInstance(props.serviceClass);
        this.service = service;

        this.modulesArgs.controller = this._classToConstructorArgs(props.controllerClass);
        const controller = this._createModuleInstance(props.controllerClass);
        this.controller = controller;

        this.config = props.config;

        logger.logInfo(`Space ${props.name} successfully initialized`);
    }

    private _getConstructorArgs<T extends new (...args: any) => any>(Module: T) {
        return Reflect.getMetadata('__ARGUMENTS__', Module);
    }

    private _classToConstructorArgs<T extends new (...args: any) => any>(Module: T) {
        const constructorArgs = this._getConstructorArgs(Module);

        if (!constructorArgs) {
            return [];
        }

        return constructorArgs.map((type: any) => {
            const matchingModuleClass = this.modulesClasses.find((moduleClass) => moduleClass === type);

            if (matchingModuleClass) {
                return this.modules.get(matchingModuleClass);
            }

            switch (type) {
                case this.manager.constructor:
                    return this.manager;
                case this.controllerClass:
                    return this.controller;
                case this.serviceClass:
                    return this.service;
                default:
                    throw new Error(`Unknown type ${type}`);
            }
        });
    }

    private _createModuleInstance<T extends new (...args: any) => any>(Module: T) {
        const constructorArgs = this._classToConstructorArgs(Module);

        const module = new Module(...constructorArgs);

        return module;
    }

    addClient(client: Client) {
        this.clients[client.id] = client;
    }

    removeClient(client: Client) {
        delete this.clients[client.id];
    }
}