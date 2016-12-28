import path from 'path';
import webpack from 'webpack';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';

const cssLoader = 'css-loader?importLoaders=1&localIdentName=[local]';

// const lessSassLoaderQuery = {
//   outputStyle: 'expanded',
//   sourceMap: false
// };

const styleLoaders = [cssLoader, 'sass-loader'];
const rootPath = path.resolve(__dirname, '../../');
const testPath = path.resolve(__dirname, './');
const helpersPath = path.join(testPath, 'testHelpers');
const srcPath = path.join(rootPath, 'src');
const nodeModulesPath = path.join(rootPath, 'node_modules');

const webpackConfig = {
  devtool: 'cheap-module-source-map',
  entry: [
    helpersPath,
  ],
  module: {
    noParse: [
      /node_modules\/sinon\//,
    ],
    rules: [
      {
        test: /\.js$/,
        include: srcPath,
        loader: 'babel-loader',
      },
      {
        test: /\.(json|jpe?g|png|gif|svg)$/,
        loader: 'null-loader',
      },
      {
        test: /\.scss/,
        include: [srcPath, /\/uniqlo-ui\//],
        loader: styleLoaders,
      },
    ],
  },
  resolve: {
    alias: {
      sinon: 'sinon/pkg/sinon.js',
    },
    modules: [
      srcPath,
      testPath,
      nodeModulesPath,
    ],
  },
  plugins: [
    new ProgressBarPlugin(),
    new webpack.DefinePlugin({
      __DEVELOPMENT__: true,
      __DEVTOOLS__: false,
      'process.env': {
        NODE_ENV: JSON.stringify('test'),
      },
    }),
    new webpack.ProvidePlugin({
      chai: 'chai/lib/chai',
      sinon: 'sinon',
      icepick: 'icepick',
      shallow: 'enzyme/shallow',
      mount: 'enzyme/mount',
      testHelpers: helpersPath,
    }),
  ],
  externals: {
    jsdom: 'window',
    cheerio: 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': 'window',
  },
  performance: false,
  node: {
    fs: 'empty',
  },
};

export default webpackConfig;
