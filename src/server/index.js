/* eslint-disable no-console */

import 'source-map-support/register';
import express from 'express';
import compression from 'compression';
import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import reactApplication from './middleware/reactApplication';
import security from './middleware/security';
import clientBundle from './middleware/clientBundle';
import serviceWorker from './middleware/serviceWorker';
import offlinePage from './middleware/offlinePage';
import errorHandlers from './middleware/errorHandlers';
import config from '../../config';

const app = express();

app.disable('x-powered-by');
app.use(...security);
app.use(compression());

if (process.env.NODE_ENV === 'production' && config.serviceWorker.enabled) {
  app.get(`/${config.serviceWorker.fileName}`, serviceWorker);
  app.get(`${config.bundles.client.webPath}${config.serviceWorker.offlinePageFileName}`, offlinePage);
}

// Configure serving of our client bundle.
app.use(config.bundles.client.webPath, clientBundle);

app.use(express.static(pathResolve(appRootDir.get(), config.publicAssetsPath)));

app.get('*', reactApplication);

app.use(...errorHandlers);

const listener = app.listen(config.port, config.host, () =>
  console.log(`Server listening on port ${config.port}`),
);

export default listener;
