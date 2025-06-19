export const defineCommands = <T extends string>(commands: T[]): { [K in T]: K } => {
    const commandsSet = new Set(commands);

    // @ts-ignore
    return Object.freeze(Object.fromEntries(commandsSet.entries()));
}