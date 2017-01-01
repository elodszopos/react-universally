// keep in synch with ./tools/webpack/offlinePage/generate.js
import serialize from 'serialize-javascript';
import { STATE_IDENTIFIER } from 'code-split-component';
import getAssetsForClientChunks from './getAssetsForClientChunks';
import config, { clientConfig } from '../../../../config';

function styleTags(styles) {
  return styles.map(style =>
      `<link href="${style}" media="screen, projection" rel="stylesheet" type="text/css" />`,
    )
    .join('\n');
}

function scriptTag(jsFilePath) {
  return `<script type="text/javascript" src="${jsFilePath}"></script>`;
}

function scriptTags(jsFilePaths) {
  return jsFilePaths.map(scriptTag).join('\n');
}

export default function generateHTML(args) {
  const { reactAppString, initialState, nonce, helmet, codeSplitState } = args;

  const chunksForRender = ['index'];

  if (codeSplitState) {
    codeSplitState.chunks.forEach(chunk => chunksForRender.push(chunk));
  }

  const assetsForRender = getAssetsForClientChunks(chunksForRender);

  const inlineScript = body => `<script nonce="${nonce}" type='text/javascript'> ${body} </script>`;

  return `<!DOCTYPE html>
    <html ${helmet ? helmet.htmlAttributes.toString() : ''}>
      <head>
        ${helmet ? helmet.title.toString() : ''}
        ${helmet ? helmet.meta.toString() : ''}
        ${helmet ? helmet.link.toString() : ''}
        ${styleTags(assetsForRender.css)}
      </head>
      <body>
        <div id='app'>${reactAppString || ''}</div>
        ${inlineScript(`window.__CLIENT_CONFIG__=${serialize(clientConfig)}`)}
        ${initialState ? inlineScript(`window.__APP_STATE__=${serialize(initialState)};`) : ''}
        ${codeSplitState ? inlineScript(`window.${STATE_IDENTIFIER}=${serialize(codeSplitState)};`) : ''}
        ${config.polyfillIO.enabled ? scriptTag(config.polyfillIO.url) : ''}
        ${process.env.NODE_ENV === 'development' && config.bundles.client.devVendorDLL.enabled
            ? scriptTag(`${config.bundles.client.webPath}${config.bundles.client.devVendorDLL.name}.js`)
            : ''
        }
        ${scriptTags(assetsForRender.js)}
        ${helmet ? helmet.script.toString() : ''}
      </body>
    </html>`;
}
