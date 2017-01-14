/* eslint-disable global-require */

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router';
import { CodeSplitProvider, rehydrateState } from 'code-split-component';
import { Provider as ReduxProvider } from 'react-redux';
import { rehydrateJobs } from 'react-jobs/ssr';
import configureStore from 'shared/redux/configureStore';
import App from 'shared/components/App';
import ReactHotLoader from './components/ReactHotLoader';

const container = document.querySelector('#app');

const store = configureStore(window.__APP_STATE__);

function renderApp(What) {
  rehydrateState().then((codeSplitState) => {
    const app = (
      <ReactHotLoader>
        <CodeSplitProvider state={codeSplitState}>
          <ReduxProvider store={store}>
            <BrowserRouter>
              {What}
            </BrowserRouter>
          </ReduxProvider>
        </CodeSplitProvider>
      </ReactHotLoader>
    );

    rehydrateJobs(app).then(({ appWithJobs }) => render(appWithJobs, container));
  });
}

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./index.js');
  module.hot.accept(
    '../shared/components/App',
    () => renderApp(<App />),
  );
}

renderApp(<App />);

require('./registerServiceWorker');
