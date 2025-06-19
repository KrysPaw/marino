import { TyranConfig } from "../types/index.js";
import { defaults } from "../constants/index.js";
import { Encoding } from "node-rsa";

export class TyranConfigManager {
    private config: TyranConfig;

    constructor(config: TyranConfig) {
        this.config = config;
    }

    getDefaultSpace() {
        return this.config.defaultSpace;
    }

    isEncryptionEnabled() {
        return this.config?.encryptionConfig?.enabled || defaults.encryptionEnabled;
    }

    isEncryptionEnabledByDefault() {
        return this.config?.encryptionConfig?.encryptByDefault || defaults.encryptionDefault;
    }

    getEncryptionEncoding(): Encoding {
        return this.config?.encryptionConfig?.encoding || defaults.encryptionEncoding;
    }

    isKeepAliveEnabled() {
        return this.config?.keepAliveConfig?.enabled || defaults.keepAliveEnabled;
    }
}