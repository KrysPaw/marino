import { Event } from '../types/index.js';

export function Event(event: Event) {
    return function (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        Reflect.defineMetadata('__EVENT_ACTION__', event, descriptor.value);
        
        return descriptor;
    }
}