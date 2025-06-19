export type Command = {
    space?: string;
    action: string;
    payload?: any;
    encrypted?: boolean;
    refId: string;
}