type Environment = 'development' | 'production';

interface Config {
  API_URL: string;
  ENV: Environment;
  IS_DEV: boolean;
  IS_PROD: boolean;
}

const isValidEnvironment = (env: string): env is Environment => {
  return ['development', 'production'].includes(env);
};

const environment = isValidEnvironment(import.meta.env.VITE_APP_ENV) 
  ? import.meta.env.VITE_APP_ENV 
  : 'development';

const config: Config = {
  API_URL: import.meta.env.VITE_APP_API_URL || 'http://localhost:8080',
  ENV: environment,
  IS_DEV: environment === 'development',
  IS_PROD: environment === 'production'
};

if (config.IS_DEV) {
  console.log('Current configuration:', config);
}

export default Object.freeze(config);