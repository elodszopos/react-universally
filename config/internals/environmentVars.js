import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import appRootDir from 'app-root-dir';
import colors from 'colors/safe';

function registerEnvFile() {
  const envName = process.env.NODE_ENV || 'development';
  const envFile = '.env';

  const envFileResolutionOrder = [
    // .env.development
    path.resolve(appRootDir.get(), `${envFile}.${envName}`),
    // .env
    path.resolve(appRootDir.get(), envFile),
  ];

  // Find the first env file path match.
  const envFilePath = envFileResolutionOrder.find(filePath => fs.existsSync(filePath));

  // If we found an env file match the register it.
  if (envFilePath) {
    if (process.env.NODE_ENV !== 'test') {
      console.log(colors.green(`==> Registering environment variables from: ${envFilePath}`));  // eslint-disable-line no-console
    }
    dotenv.config({ path: envFilePath });
  }
}

// Ensure that we first register any environment variables from an existing
// env file.
registerEnvFile();

export function getStringEnvVar(name, defaultVal) {
  return process.env[name] || defaultVal;
}

export function getIntEnvVar(name, defaultVal) {
  return process.env[name] ? parseInt(process.env[name], 10) : defaultVal;
}

export function getBoolVar(name, defaultVal) {
  return process.env[name] ? process.env[name] === 'true' : defaultVal;
}
