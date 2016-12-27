import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import reducer from './index';

function configureStore(initialState = {}) {
  const enhancers = compose(
    applyMiddleware(
      thunk.withExtraArgument({ axios }),
    ),
    process.env.NODE_ENV === 'development'
      && typeof window !== 'undefined'
      && typeof window.devToolsExtension !== 'undefined'
      ? window.devToolsExtension()
      : f => f,
  );

  const store = initialState
    ? createStore(reducer, initialState, enhancers)
    : createStore(reducer, enhancers);

  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./index', () => {
      const nextRootReducer = require('./index').default; // eslint-disable-line global-require

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

// NOTE: If we create an '/api' endpoint in our application then we will neeed to
// configure the axios instances so that they will resolve to the proper URL
// endpoints on the server. We have to provide absolute URLs for any of our
// server bundles. To do so we can set the default 'baseURL' for axios. Any
// relative path requests will then be appended to the 'baseURL' in order to
// form an absolute URL.
// We don't need to worry about this for client side executions, relative paths
// will work fine there.
// Example:
//
// const axiosConfig = process.env.IS_NODE === true
//   ? { baseURL: process.env.NOW_URL || notEmpty(process.env.SERVER_URL) }
//   : {};
//
// Then we will then have to initialise our redux-thunk middlware like so:
//
// thunk.withExtraArgument({
//   axios: axios.create(axiosConfig),
// })

export default configureStore;
