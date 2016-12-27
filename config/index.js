import { getStringEnvVar, getIntEnvVar } from './internals/environmentVars';
import filterObject from './internals/filterObject';

if (process.env.IS_CLIENT) {
  throw new Error('You shouldn\'t be importing the `./config` directly into your "client" or "shared" source. \n' +
    'If you do, the configuration object will get included in your client bundle. Not a safe move! \n' +
    'Instead, use the `safeConfigGet` helper function (located at `./src/shared/utils/config`) within the "client" or "shared" source files. \n' +
    'From there you can reference configuration values in a safe manner.');
}

const config = {
  host: getStringEnvVar('SERVER_HOST', 'localhost'),

  port: getIntEnvVar('SERVER_PORT', 3000),

  clientDevServerPort: getIntEnvVar('CLIENT_DEVSERVER_PORT', 3001),

  welcomeMessage: getStringEnvVar('WELCOME_MSG', 'Hello world!'),

  disableSSR: false,

  browserCacheMaxAge: '365d',

  publicAssetsPath: './public',

  buildOutputPath: './build',

  optimizeProductionBuilds: true,

  includeSourceMapsForProductionBuilds: true,

  bundlesSharedSrcPath: './src/shared',

  bundleSrcTypes: ['js', 'jsx', 'json'],

  bundleAssetTypes: [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'ico',
    'eot',
    'svg',
    'ttf',
    'woff',
    'woff2',
    'otf',
  ],

  bundleAssetsFileName: 'assets.json',

  cspExtensions: {
    defaultSrc: [],
    scriptSrc: [],
    styleSrc: [],
    imgSrc: [],
    connectSrc: [],
    fontSrc: [],
    objectSrc: [],
    mediaSrc: [],
    childSrc: [],
  },

  nodeBundlesIncludeNodeModuleFileTypes: [
    /\.(eot|woff|woff2|ttf|otf)$/,
    /\.(svg|png|jpg|jpeg|gif|ico)$/,
    /\.(mp4|mp3|ogg|swf|webp)$/,
    /\.(css|scss|sass|sss|less)$/,
  ],

  serviceWorker: {
    enabled: true,
    fileName: 'sw.js',
    includePublicAssets: [
      './**/*',
    ],
    offlinePageTemplate: './tools/webpack/offlinePage',
    offlinePageFileName: 'offline.html',
  },

  polyfillIO: {
    enabled: true,
    url: 'https://cdn.polyfill.io/v2/polyfill.min.js',
  },

  htmlPage: {
    htmlAttributes: { lang: 'en' },
    titleTemplate: 'BoilerZone - %s',
    defaultTitle: 'BoilerZone',
    meta: [
      {
        name: 'description',
        content: 'A starter kit giving you the minimum requirements for a production ready universal react application.',
      },
      {
        name: 'charset',
        content: 'utf-8',
      },
      {
        'http-equiv': 'X-UA-Compatible',
        content: 'IE=edge',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'theme-color',
        content: '#2b2b2b',
      },
    ],
    links: [
      // http://realfavicongenerator.net/
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon-32x32.png',
        sizes: '32x32',
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon-16x16.png',
        sizes: '16x16',
      },
      {
        rel: 'mask-icon',
        href: '/safari-pinned-tab.svg',
        color: '#00a9d9',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
    scripts: [
      // { src: 'http://include.com/pathtojs.js', type: 'text/javascript' },
    ],
  },

  bundles: {
    client: {
      srcEntryFile: './src/client/index.js',
      srcPaths: [
        './src/client',
        './src/shared',
        './config',
      ],

      outputPath: './build/client',

      webPath: '/client/',

      devVendorDLL: {
        enabled: true,
        ignores: ['normalize.css/normalize.css'],
        exclude: [
          // Requires webpack loaders:
          'normalize.css',

          // Only used by node/server:
          'app-root-dir',
          'colors',
          'compression',
          'dotenv',
          'express',
          'helmet',
          'hpp',
          'offline-plugin',
          'serialize-javascript',
          'source-map-support',
          'uuid',
        ],

        include: [],

        name: '__dev_vendor_dll__',
      },
    },

    server: {
      srcEntryFile: './src/server/index.js',
      srcPaths: [
        './src/server',
        './src/shared',
        './config',
      ],
      outputPath: './build/server',
    },
  },

  additionalNodeBundles: {
    // Simply define additional configurations similar to below.  The development
    // server will manage starting them up for you.  The only requirement is that
    // within the entry for each bundle you create and return the "express"
    // listener.
    /*
     apiServer: {
     srcEntryFile: './src/api/index.js',
     srcPaths: [
     './src/api',
     './src/shared',
     './config',
     ],
     outputPath: './build/api',
     }
     */
  },

  plugins: {
    babelConfig: (buildOptions) => {
      const { target, mode } = buildOptions;

      return {
        babelrc: false,
        presets: [
          'react',
          'stage-3',
          target === 'client' ? ['latest', { es2015: { modules: false } }] : null,
          target === 'server' ? ['env', { targets: { node: true }, modules: false }] : null,
        ].filter(Boolean),

        plugins: [
          mode === 'development' ? 'react-hot-loader/babel' : null,
          mode === 'development' ? 'transform-react-jsx-self' : null,
          mode === 'development' ? 'transform-react-jsx-source' : null,
          mode === 'production' && (target === 'server' || target === 'client')
            ? [
              'code-split-component/babel',
              {
                mode: target,
              },
            ]
            : null,
          'transform-decorators-legacy',
          'transform-react-display-name',
        ].filter(Boolean),
      };
    },

    webpackConfig: (webpackConfig, buildOptions) => {
      const { target, mode } = buildOptions; // eslint-disable-line no-unused-vars

      // Example:
      /*
       if (target === 'server' && mode === 'development') {
       webpackConfig.plugins.push(new MyCoolWebpackPlugin());
       }
       */

      // Debugging/Logging Example:
      /*
       if (target === 'server') {
       console.log(JSON.stringify(webpackConfig, null, 4));
       }
       */

      return webpackConfig;
    },
  },
};

export const clientConfig = filterObject(
  config,
  {
    welcomeMessage: true,
    serviceWorker: {
      enabled: true,
    },
    polyfillIO: true,
    htmlPage: true,
    additionalNodeBundles: true,
  },
);

export default config;
