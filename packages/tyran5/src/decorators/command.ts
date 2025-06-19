export function Command(action: string) {
    return function (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        Reflect.defineMetadata('__COMMAND_ACTION__', action, descriptor.value);
        
        return descriptor;
    }
}