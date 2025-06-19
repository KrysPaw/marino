import { SpaceConfig, SpaceMetadata } from "../types/index.js";

export function Space(name: string, metadata: SpaceMetadata, config?: SpaceConfig) {
    if (name !== name.toUpperCase()) {
        throw new Error('Space name must be uppercase');
    }

    return function(target: object) {
        Reflect.defineMetadata('__SPACE__', name, target);
        Reflect.defineMetadata('__CONTROLLER__', metadata.controller, target);
        Reflect.defineMetadata('__SERVICE__', metadata.service, target);
        Reflect.defineMetadata('__MODULES__', metadata.modules, target);
        Reflect.defineMetadata('__CONFIG__', config, target);
    }
}