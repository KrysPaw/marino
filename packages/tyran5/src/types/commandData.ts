import { Client } from "../core/client.js";

export type CommandData<TPayload = any> = {
    client: Client;
    payload?: TPayload;
};