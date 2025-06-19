type TyranSetupMetadata = {
    spaces: (new (...args: any) => any)[];
}

export function TyranSetup(metadata: TyranSetupMetadata) {
    return function(constructor: Function) {
        Reflect.defineMetadata('__SPACES__', metadata.spaces, constructor);
    };
}