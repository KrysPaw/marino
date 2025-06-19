type ObjectKeys<T extends object> = Extract<keyof T, string>;

export const objectKeys = <T extends object>(obj: T): ObjectKeys<T>[] => {
    return Object.keys(obj) as ObjectKeys<T>[];
}