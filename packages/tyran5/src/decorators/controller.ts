import { CommandsDefinition } from "../types/commands.js";

export function Controller(commands: CommandsDefinition) {
    return function (target: object) {
        const types = Reflect.getMetadata('design:paramtypes', target);

        Reflect.defineMetadata('__CONTROLLER_COMMANDS__', commands, target);
        Reflect.defineMetadata('__ARGUMENTS__', types, target);
        Reflect.defineMetadata('__CONTROLLER__', true, target);
    }
}