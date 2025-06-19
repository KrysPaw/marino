import { Encoding } from "node-rsa";

type KeepAliveConfig = {
    /**
     * Whether to enable keep alive mechanism
     * 
     * Keep alive mechanism is `enabled` by default
     */
    enabled?: boolean;
    /**
     * Time in milliseconds
     */
    timeout?: number;
    /**
     * Time in milliseconds
     * Time between keep alive checks
     */
    interval?: number;
}

type EncryptionConfig = {
    /**
     * Whether to enable encryption and expect key exchange with the client.
     * 
     * If encryption is `enabled`, payload of the commands will be encrypted.
     * 
     * Encryption is `disabled` by default.
     * 
     * ### IMPORTANT
     * By default data won't be encrypted. Two of the following actions must be taken:
     * * Set `encryptByDefault` to `true` in the Tyran config
     * * Set `encrypted` key of the command to `true`
     */
    enabled?: boolean;
    /**
     * Encoding of the encrypted data
     */
    encoding?: Encoding;
    /**
     * Whether to encrypt every command by default
     */
    encryptByDefault?: boolean;
}

export type TyranConfig = {
    /**
     * Name of the default space - must match the name of one of the declared spaces.
     * 
     * If provided, the client will be assigned to the default space instance when connected.
     * 
     * If not provided, the client will not be assigned to any space when connected.
     */
    defaultSpace?: string;
    /**
     * Optional encryption configuration
     * 
     * Encryption is `disabled` by default
     */
    encryptionConfig?: EncryptionConfig;
    /**
     * Optional keep alive mechanism configuration
     * 
     * Keep alive mechanism is `enabled` by default
     */
    keepAliveConfig?: KeepAliveConfig;
    TypeOrmAppDataSource?: unknown;
}