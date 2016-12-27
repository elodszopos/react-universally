/* eslint-disable global-require */

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router';
import { CodeSplitProvider, rehydrateState } from 'code-split-component';
import ReactHotLoader from './components/ReactHotLoader';
import App from '../shared/components/App';

const container = document.querySelector('#app');

function renderApp(What) {
  rehydrateState().then(codeSplitState =>
    render(
      <ReactHotLoader>
        <CodeSplitProvider state={codeSplitState}>
          <BrowserRouter>
            {What}
          </BrowserRouter>
        </CodeSplitProvider>
      </ReactHotLoader>,
      container,
    ),
  );
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
