import { Encoding } from "node-rsa";

type Defaults = {
    encryptionEnabled: boolean;
    encryptionDefault: boolean;
    encryptionEncoding: Encoding;
    keepAliveEnabled: boolean;
    keepAliveInterval: number;
    keepAliveTimeout: number;

}

export const defaults: Defaults = {
    encryptionEnabled: false,
    encryptionDefault: false,
    encryptionEncoding: 'base64',
    keepAliveEnabled: true,
    keepAliveInterval: 1000,
    keepAliveTimeout: 5000,
}