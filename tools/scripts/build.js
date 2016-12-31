// This script builds a production output of all of our bundles.
/* eslint no-console: 0 */

import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import appRootDir from 'app-root-dir';
import webpackConfigFactory from '../webpack/configFactory';
import { exec } from '../utils';
import config from '../../config';

// First clear the build output dir.
exec(`rimraf ${path.resolve(appRootDir.get(), config.buildOutputPath)}`);

// Get our "fixed" bundle names
Object.keys(config.bundles)
// And the "additional" bundle names
.concat(Object.keys(config.additionalNodeBundles))
// And then build them all.
.forEach((bundleName) => {
  const compiler = webpack(
    webpackConfigFactory({ target: bundleName, mode: 'production' }),
  );

  compiler.run((err, stats) => {
    if (err) {
      console.error(err);

      return;
    }

    fs.writeFile(path.resolve(__dirname, `../../coverage/webpackStats_${bundleName}.json`), JSON.stringify(stats.toJson('verbose')), (writeError) => {
      if (writeError) {
        return console.log(writeError);
      }

      return console.info('Prod build stats saved!');
    });
  });
});
