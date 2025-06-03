/**
 * Logging utility with different levels and production safety
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

class Logger {
  private level: LogLevel;
  private isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.level = this.getLogLevel();
  }

  private getLogLevel(): LogLevel {
    const envLevel = process.env.LOG_LEVEL?.toLowerCase();
    switch (envLevel) {
      case 'error': return LogLevel.ERROR;
      case 'warn': return LogLevel.WARN;
      case 'info': return LogLevel.INFO;
      case 'debug': return LogLevel.DEBUG;
      default: return this.isProduction ? LogLevel.INFO : LogLevel.DEBUG;
    }
  }

  private formatMessage(level: string, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const formattedArgs = args.length > 0 ? ` ${JSON.stringify(args)}` : '';
    return `[${timestamp}] [${level}] ${message}${formattedArgs}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.level;
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage('ERROR', message, ...args));
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message, ...args));
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(this.formatMessage('INFO', message, ...args));
    }
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(this.formatMessage('DEBUG', message, ...args));
    }
  }

  /**
   * Safely logs API key status without exposing the key
   */
  logApiKeyStatus(hasKey: boolean): void {
    this.info(`API key configured: ${hasKey ? 'Yes' : 'No'}`);
  }

  /**
   * Logs request information safely
   */
  logRequest(method: string, path: string, userAgent?: string): void {
    this.info(`${method} ${path}`, { userAgent: userAgent?.substring(0, 100) });
  }

  /**
   * Logs error with safe serialization
   */
  logError(error: Error, context?: Record<string, any>): void {
    const errorInfo = {
      name: error.name,
      message: error.message,
      stack: this.isProduction ? undefined : error.stack,
      ...context
    };
    this.error('Application error', errorInfo);
  }
}

export const logger = new Logger();
