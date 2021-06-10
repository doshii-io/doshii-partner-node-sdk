export enum LogLevel {
    DEBUG, INFO, WARN, ERROR
}

export class Logger {
    private readonly logLevel: LogLevel;

    constructor(level = LogLevel.ERROR) {
        this.logLevel = level;
    }

    debug(msg: any) {
        if (this.logLevel <= LogLevel.DEBUG) {
            console.log(msg)
        }
    }

    info(msg: any) {
        if (this.logLevel <= LogLevel.INFO) {
            console.log(msg)
        }
    }

    log = this.info

    warn(msg: any) {
        if (this.logLevel <= LogLevel.WARN) {
            console.log(msg)
        }
    }

    error(msg: any) {
        if (this.logLevel <= LogLevel.ERROR) {
            console.log(msg)
        }
    }

}
