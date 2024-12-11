'use client';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  level?: LogLevel;
  scope?: string;
  data?: Record<string, unknown>;
}

interface Logger {
  debug: (message: string, data?: Record<string, unknown>) => void;
  info: (message: string, data?: Record<string, unknown>) => void;
  warn: (message: string, data?: Record<string, unknown>) => void;
  error: (message: string, error?: Error | unknown, data?: Record<string, unknown>) => void;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const getCurrentLogLevel = (): LogLevel => {
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
};

const formatMessage = (message: string, options: LogOptions): string => {
  const timestamp = new Date().toISOString();
  const scope = options.scope ? `[${options.scope}]` : '';
  return `${timestamp} ${options.level?.toUpperCase()} ${scope} ${message}`;
};

const shouldLog = (level: LogLevel): boolean => {
  const currentLevel = getCurrentLogLevel();
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
};

export const createScopedLogger = (scope: string): Logger => {
  const log = (message: string, options: LogOptions) => {
    if (!shouldLog(options.level || 'info')) return;

    const formattedMessage = formatMessage(message, { ...options, scope });
    const logData = options.data ? { data: options.data } : {};

    switch (options.level) {
      case 'debug':
        console.debug(formattedMessage, logData);
        break;
      case 'warn':
        console.warn(formattedMessage, logData);
        break;
      case 'error':
        console.error(formattedMessage, logData);
        break;
      default:
        console.info(formattedMessage, logData);
    }
  };

  return {
    debug: (message: string, data?: Record<string, unknown>) =>
      log(message, { level: 'debug', data }),
    info: (message: string, data?: Record<string, unknown>) =>
      log(message, { level: 'info', data }),
    warn: (message: string, data?: Record<string, unknown>) =>
      log(message, { level: 'warn', data }),
    error: (message: string, error?: Error | unknown, data?: Record<string, unknown>) =>
      log(message, {
        level: 'error',
        data: { ...data, error: error instanceof Error ? error.message : error },
      }),
  };
};

// Create default logger
export const logger = createScopedLogger('app');
