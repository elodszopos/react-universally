/* eslint no-console: 0, global-require: 0, import/prefer-default-export: 0 */

let configCache;

function resolveConfigForExecutionEnv() {
  if (configCache) {
    return configCache;
  }

  if (typeof process.env.IS_NODE === 'undefined' || process.env.IS_NODE) {
    configCache = require('../../../config').default;

    return configCache;
  }

  if (typeof window !== 'undefined' && typeof window.__CLIENT_CONFIG__ === 'object') {
    configCache = window.__CLIENT_CONFIG__;
  } else {
    // To get here we must be running in the browser.
    console.warn('No client configuration object was bound to the window.');
    configCache = {};
  }

  return configCache;
}

/**
 *   {
 *     foo: {
 *       bar: [1, 2, 3]
 *     },
 *     bob: 'bob'
 *   }
 *
 *   import { safeConfigGet } from '../config';
 *   const value = safeConfigGet(['foo', 'bar']);
 *
 *   import { safeConfigGet } from '../config';
 *   const value = safeConfigGet(['bob']);
 *
 */
export function safeConfigGet(path) {
  if (path.length === 0) {
    throw new Error('You must provide the path to the configuration value you would like to consume.');
  }
  let result = resolveConfigForExecutionEnv();

  for (let i = 0; i < path.length; i += 1) {
    if (result === undefined) {
      const errorMessage = `Failed to resolve configuration value at "${path.join('.')}".`;
      // This "if" block gets stripped away by webpack for production builds.

      if (process.env.NODE_ENV === 'development' && process.env.IS_CLIENT) {
        throw new Error(`${errorMessage} We have noticed that you are trying to access this configuration value from the client bundle (i.e. browser) though. \n
          For configuration values to be exposed to the client bundle you must ensure that the path is added to the client configuration filter file, \n
          which is located at "config/clientConfigFilter.js".`);
      }
      throw new Error(errorMessage);
    }
    result = result[path[i]];
  }

  return result;
}
