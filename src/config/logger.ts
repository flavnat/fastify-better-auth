import type { FastifyServerOptions } from "fastify";

type LoggerConfig = {
  [key: string]: FastifyServerOptions["logger"];
};

/**
 * Logger Configuration
 * 
 * Different logging configurations for different environments.
 */
export const envToLogger: LoggerConfig = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
        colorize: true,
      },
    },
  },
  production: true,
  test: false,
};