import path from 'path';
import { sync as globSync } from 'glob';
import webpack from 'webpack';
import OfflinePlugin from 'offline-plugin';
import AssetsPlugin from 'assets-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import appRootDir from 'app-root-dir';
import WebpackMd5Hash from 'webpack-md5-hash';
import CodeSplitPlugin from 'code-split-component/webpack';
import { removeEmpty, ifElse, merge, happyPackPlugin } from '../utils';

import config, { clientConfig } from '../../config';

export default function webpackConfigFactory(buildOptions) {
  const { target, mode } = buildOptions;

  console.log(`==> Creating webpack config for "${target}" in "${mode}" mode`); // eslint-disable-line no-console

  const isDev = mode === 'development';
  const isProd = mode === 'production';
  const isClient = target === 'client';
  const isServer = target === 'server';
  const isNode = !isClient;

  const ifDev = ifElse(isDev);
  const ifProd = ifElse(isProd);
  const ifNode = ifElse(isNode);
  const ifClient = ifElse(isClient);
  const ifDevClient = ifElse(isDev && isClient);
  const ifProdClient = ifElse(isProd && isClient);

  const bundleConfig = isServer || isClient ? config.bundles[target] : config.additionalNodeBundles[target];

  if (!bundleConfig) {
    throw new Error('No bundle configuration exists for target:', target);
  }

  const webpackConfig = {
    target: isClient ? 'web' : 'node',

    node: {
      __dirname: true,
      __filename: true,
    },

    externals: removeEmpty([
      ifNode(
        () => nodeExternals(
          { whitelist: config.nodeBundlesIncludeNodeModuleFileTypes },
        ),
      ),
    ]),

    // Source map settings.
    devtool: ifElse(isNode || isDev || config.includeSourceMapsForProductionBuilds)(
      'cheap-module-source-map',
      'hidden-source-map',
    ),

    performance: ifProdClient({ hints: 'warning' }, false),

    entry: {
      index: removeEmpty([
        ifDevClient('react-hot-loader/patch'),
        ifDevClient(() => `webpack-hot-middleware/client?reload=true&path=http://${config.host}:${config.clientDevServerPort}/__webpack_hmr`),
        // polyfill.io > babel-polyfill.
        // polyfill.io doesn't include runtime transforms
        ifClient('regenerator-runtime/runtime'),
        path.resolve(appRootDir.get(), bundleConfig.srcEntryFile),
      ]),
    },

    output: merge(
      {
        path: path.resolve(appRootDir.get(), bundleConfig.outputPath),
        filename: ifProdClient('[name]-[chunkhash].js', '[name].js'),
        chunkFilename: '[name]-[chunkhash].js',
        libraryTarget: ifNode('commonjs2', 'var'),
      },
      ifElse(isServer || isClient)(() => ({
        publicPath: ifDev(`http://${config.host}:${config.clientDevServerPort}${config.bundles.client.webPath}`, bundleConfig.webPath),
      })),
    ),

    resolve: {
      modules: ['src', 'node_modules'],
      extensions: config.bundleSrcTypes.map(ext => `.${ext}`),
    },

    plugins: removeEmpty([
      ifProd(() => new CodeSplitPlugin()),

      ifClient(() => new WebpackMd5Hash()),

      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.IS_CLIENT': JSON.stringify(isClient),
        'process.env.IS_SERVER': JSON.stringify(isServer),
        'process.env.IS_NODE': JSON.stringify(isNode),
      }),

      ifClient(() =>
        new AssetsPlugin({
          filename: config.bundleAssetsFileName,
          path: path.resolve(appRootDir.get(), bundleConfig.outputPath),
        }),
      ),

      new webpack.NoErrorsPlugin(),

      ifDevClient(() => new webpack.HotModuleReplacementPlugin()),

      ifProdClient(
        () => new webpack.LoaderOptionsPlugin({
          minimize: config.optimizeProductionBuilds,
          debug: false,
        }),
      ),

      ifProdClient(
        ifElse(config.optimizeProductionBuilds)(
          () => new webpack.optimize.UglifyJsPlugin({
            sourceMap: config.includeSourceMapsForProductionBuilds,
            compress: {
              screw_ie8: true,
              warnings: false,
            },
            mangle: {
              screw_ie8: true,
            },
            output: {
              comments: false,
              screw_ie8: true,
            },
          }),
        ),
      ),

      ifProdClient(
        () => new ExtractTextPlugin({
          filename: '[name]-[chunkhash].css', allChunks: true,
        }),
      ),

      happyPackPlugin({
        name: 'happypack-javascript',
        // We will use babel to do all our JS processing.
        loaders: [{
          path: 'babel-loader',
          query: config.plugins.babelConfig(buildOptions),
        }],
      }),

      ifDevClient(
        () => happyPackPlugin({
          name: 'happypack-devclient-css',
          loaders: [
            'style-loader',
            {
              path: 'css-loader',
              query: { sourceMap: true },
            },
          ],
        }),
      ),

      ifProdClient(
        ifElse(config.serviceWorker.enabled)(
          () => new HtmlWebpackPlugin({
            filename: config.serviceWorker.offlinePageFileName,
            template: path.resolve(
              appRootDir.get(), config.serviceWorker.offlinePageTemplate,
            ),
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
            inject: true,
            custom: {
              config,
              clientConfig,
            },
          }),
        ),
      ),

      ifProdClient(
        ifElse(config.serviceWorker.enabled)(
          () => new OfflinePlugin({
            publicPath: bundleConfig.webPath,
            relativePaths: false,
            ServiceWorker: {
              output: config.serviceWorker.fileName,
              events: true,
              publicPath: `/${config.serviceWorker.fileName}`,
              navigateFallbackURL: `${bundleConfig.webPath}${config.serviceWorker.offlinePageFileName}`,
            },
            AppCache: false,
            externals:
              (
                config.polyfillIO.enabled
                  ? [config.polyfillIO.url]
                  : []
              )
              .concat(
                config.serviceWorker.includePublicAssets.reduce((acc, cur) => {
                  const publicAssetPathGlob = path.resolve(
                    appRootDir.get(), config.publicAssetsPath, cur,
                  );

                  return acc.concat(
                    globSync(publicAssetPathGlob)
                    .map(publicFile => path.relative(
                      path.resolve(appRootDir.get(), config.publicAssetsPath),
                      publicFile,
                    ))
                    .map(relativePath => `/${relativePath}`),
                  );
                }, []),
              ),
          }),
        ),
      ),
    ]),
    module: {
      rules: removeEmpty([
        {
          test: /\.jsx?$/,
          loader: 'happypack/loader?id=happypack-javascript',
          include: removeEmpty([
            ...bundleConfig.srcPaths.map(srcPath => path.resolve(appRootDir.get(), srcPath)),
            ifProdClient(path.resolve(appRootDir.get(), 'src/html')),
          ]),
        },

        ifElse(isClient || isServer)(
          merge(
            {
              test: /\.css$/,
            },
            ifDevClient({
              loaders: ['happypack/loader?id=happypack-devclient-css'],
            }),
            ifProdClient(() => ({
              loader: ExtractTextPlugin.extract({
                fallbackLoader: 'style-loader',
                loader: ['css-loader'],
              }),
            })),
            ifNode({
              loaders: ['css-loader/locals'],
            }),
          ),
        ),

        ifElse(isClient || isServer)(() => ({
          test: new RegExp(`\\.(${config.bundleAssetTypes.join('|')})$`, 'i'),
          loader: 'file-loader',
          query: {
            publicPath: isDev
              ? `http://${config.host}:${config.clientDevServerPort}${config.bundles.client.webPath}`
              : config.bundles.client.webPath,
            emitFile: isClient,
          },
        })),
      ]),
    },
  };

  return config.plugins.webpackConfig(webpackConfig, buildOptions);
}
