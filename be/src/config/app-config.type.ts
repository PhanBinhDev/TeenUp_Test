export type AppConfig = {
  nodeEnv: string;
  name: string;
  url: string;
  frontendUrl: string;
  frontendDomain: string;
  port: number;
  debug: boolean;
  apiPrefix: string;
  fallbackLanguage: string;
  logLevel: string;
  logService: string;
  corsOrigin: boolean | string | RegExp | (string | RegExp)[];
};
