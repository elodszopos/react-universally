/* eslint-disable global-require */

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router';
import { CodeSplitProvider, rehydrateState } from 'code-split-component';
import { Provider } from 'react-redux';
import configureStore from 'shared/redux/configureStore';
import App from 'shared/components/App';
import ReactHotLoader from './components/ReactHotLoader';
import TaskRoutesExecutor from './components/TaskRoutesExecutor';

const container = document.querySelector('#app');

const store = configureStore(window.__APP_STATE__);

function renderApp(What) {
  rehydrateState().then(codeSplitState =>
    render(
      <ReactHotLoader>
        <CodeSplitProvider state={codeSplitState}>
          <Provider store={store}>
            <BrowserRouter>
              { routerProps => (
                  <TaskRoutesExecutor {...routerProps} dispatch={store.dispatch}>
                    {What}
                  </TaskRoutesExecutor>
                )
              }
            </BrowserRouter>
          </Provider>
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
