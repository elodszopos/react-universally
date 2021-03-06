/* eslint global-require: 0, import/no-dynamic-require: 0, no-console: 0 */
import webpack from 'webpack';
import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import md5 from 'md5';
import fs from 'fs';
import config from '../../config';
import { log, unique, without } from '../utils';

function createVendorDLL(bundleName, bundleConfig) {
  const dllConfig = config.bundles.client.devVendorDLL;

  const pkg = require(pathResolve(appRootDir.get(), './package.json'));

  const calculateDependencies = () => {
    const dependencies = Object.keys(pkg.dependencies);
    const includeDependencies = unique(dependencies.concat(dllConfig.include));

    return without(includeDependencies, dllConfig.exclude);
  };

  const devDLLDependencies = calculateDependencies().sort();

  const currentDependenciesHash = md5(JSON.stringify(
    devDLLDependencies.map(dep =>
      [dep, pkg.dependencies[dep], pkg.devDependencies[dep]],
    ),
  ));

  const vendorDLLHashFilePath = pathResolve(
    appRootDir.get(),
    bundleConfig.outputPath,
    `${dllConfig.name}_hash`,
  );

  function webpackConfigFactory() {
    return {
      devtool: 'cheap-module-source-map',
      entry: {
        [dllConfig.name]: devDLLDependencies,
      },
      output: {
        path: pathResolve(appRootDir.get(), bundleConfig.outputPath),
        filename: `${dllConfig.name}.js`,
        library: dllConfig.name,
      },
      plugins: [
        new webpack.DllPlugin({
          path: pathResolve(
            appRootDir.get(),
            bundleConfig.outputPath,
            `./${dllConfig.name}.json`,
          ),
          name: dllConfig.name,
        }),
      ],
    };
  }

  function buildVendorDLL() {
    return new Promise((resolve, reject) => {
      log({
        title: 'vendorDLL',
        level: 'info',
        message: 'Vendor DLL build complete. Modules list:',
      });
      console.log(devDLLDependencies);

      const webpackConfig = webpackConfigFactory();
      const vendorDLLCompiler = webpack(webpackConfig);

      vendorDLLCompiler.run((err) => {
        if (err) {
          reject(err);

          return;
        }
        fs.writeFileSync(vendorDLLHashFilePath, currentDependenciesHash);

        resolve();
      });
    });
  }

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(vendorDLLHashFilePath)) {
      log({
        title: 'vendorDLL',
        level: 'warn',
        message: `Generating a new "${bundleName}" vendor dll for boosted development performance...`,
      });
      buildVendorDLL().then(resolve).catch(reject);
    } else {
      // first check if the md5 hashes match
      const dependenciesHash = fs.readFileSync(vendorDLLHashFilePath, 'utf8');
      const dependenciesChanged = dependenciesHash !== currentDependenciesHash;

      if (dependenciesChanged) {
        log({
          title: 'vendorDLL',
          level: 'warn',
          message: `New "${bundleName}" vendor dependencies detected. Regenerating the vendor dll...`,
        });
        buildVendorDLL().then(resolve).catch(reject);
      } else {
        log({
          title: 'vendorDLL',
          level: 'info',
          message: `No changes to existing "${bundleName}" vendor dependencies. Using the existing vendor dll.`,
        });
        resolve();
      }
    }
  });
}

export default createVendorDLL;
