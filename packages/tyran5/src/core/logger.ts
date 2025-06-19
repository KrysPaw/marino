import dayjs from 'dayjs';

export class Logger {
    readonly logLevel = 2;

    constructor() {

    }

    logAppInitializationStep(status: 'success' | 'error' | 'warning', message: string) {
        console.log(`\x1b[0m${this._statusToIcon(status)} ${this._statusToColor(status)}${message}`);
    }

    logInfo(message: string, level: 0 | 1 | 2 = 2) {
        if (this.logLevel >= level) {
            console.info(`\x1b[30m\x1b[44m[INFO]\x1b[0m ${dayjs().format('HH:mm:ss')} - ${message}`);
        }
    }

    logWarning(message: string, level: 0 | 1 | 2 = 1) {
        if (this.logLevel >= level) {
            console.log(`\x1b[30m\x1b[43m[WARN]\x1b[0m ${dayjs().format('HH:mm:ss')} - \x1b[33m${message}`);
        }
    }

    logError(message: string, level: 0 | 1 | 2 = 1) {
        if (this.logLevel >= level) {
            console.log(`\x1b[30m\x1b[41m[ERROR]\x1b[0m ${dayjs().format('HH:mm:ss')} - \x1b[31m${message}`);
        }
    }

    private _statusToColor(status: 'success' | 'error' | 'warning') {
        switch (status) {
            case 'success':
                return '\x1b[32m';
            case 'error':
                return '\x1b[31m';
            case 'warning':
                return '\x1b[33m';
        }
    }

    private _statusToIcon(status: 'success' | 'error' | 'warning') {
        switch (status) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'warning':
                return '🟨';
        }
    }
}

export const logger = new Logger();