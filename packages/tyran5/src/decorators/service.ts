export function Service(target: object) {
    const types = Reflect.getMetadata('design:paramtypes', target);

    Reflect.defineMetadata('__ARGUMENTS__', types, target);
    Reflect.defineMetadata('__SERVICE__', true, target);
}