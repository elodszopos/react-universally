/* eslint no-console: 0 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerRouter, createServerRenderContext } from 'react-router';
import { Provider } from 'react-redux';
import { CodeSplitProvider, createRenderContext } from 'code-split-component';
import Helmet from 'react-helmet';
import App from 'shared/components/App';
import configureStore from 'shared/redux/configureStore';
import { runJobs } from 'react-jobs/ssr';
import generateHTML from './generateHTML';
import config from '../../../../config';

/**
 * An express middleware that is capable of service our React application,
 * supporting server side rendering of the application.
 */
export default function reactApplicationMiddleware(request, response) {
  if (typeof response.locals.nonce !== 'string') {
    throw new Error('A "nonce" value has not been attached to the response');
  }

  const nonce = response.locals.nonce;

  if (config.disableSSR) {
    if (process.env.NODE_ENV === 'development') {
      console.log('==> Handling react route without SSR');
    }
    const html = generateHTML({
      nonce,
    });

    response.status(200).send(html);

    return;
  }

  const store = configureStore();
  const { getState } = store;
  const reactRouterContext = createServerRenderContext();
  const codeSplitContext = createRenderContext();

  const app = (
    <CodeSplitProvider context={codeSplitContext}>
      <ServerRouter location={request.url} context={reactRouterContext}>
        <Provider store={store}>
          <App />
        </Provider>
      </ServerRouter>
    </CodeSplitProvider>
  );

  runJobs(app).then(({ appWithJobs, state, STATE_IDENTIFIER }) => {
    const reactAppString = renderToString(appWithJobs);
    const html = generateHTML({
      reactAppString,
      nonce,
      helmet: Helmet.rewind(),
      codeSplitState: codeSplitContext.getState(),
      initialState: getState(),
      jobsState: {
        state,
        STATE_IDENTIFIER,
      },
    });

    const renderResult = reactRouterContext.getResult();

    if (renderResult.redirect) {
      response.status(301).setHeader('Location', renderResult.redirect.pathname);
      response.end();

      return;
    }

    response.status(renderResult.missed ? 404 : 200).send(html);
  });
}
