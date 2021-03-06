/* eslint no-param-reassign: 0 */
import { PropTypes } from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';
import configureStore from '../../../src/shared/redux/configureStore';

export function getStore(overrides = {}) {
  const store = configureStore(overrides);

  store.originalDispatch = store.dispatch;

  store.dispatch = sinon.spy();

  return store;
}

const cx = stuffToContextualize => ({ context: Object.assign({}, stuffToContextualize) });
const defaultStore = getStore();

function getMockStore(store) {
  return {
    subscribe: () => {},
    dispatch: () => {},
    getState: () => (Object.assign({}, defaultStore.getState(), store)),
  };
}

export function shallowWithStore(node, customStore) {
  const store = getMockStore(customStore);

  return shallow(node, Object.assign({}, store, Object.assign({}, cx({ store }))));
}

export function mountWithStore(node, customStore) {
  return mount(node, {
    context: { store: getMockStore(customStore) },
    childContextTypes: { store: PropTypes.object },
  });
}

const lifecycleMethods = [
  'render',
  'componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  'shouldComponentUpdate',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount',
];

export function stubComponent(componentClass, stubProps = false, lifecycleMethodsOverwrite, toReturn) {
  let originalPropTypes = {};

  beforeEach(() => {
    if (stubProps) {
      originalPropTypes = componentClass.propTypes;

      componentClass.propTypes = {};
    }

    (lifecycleMethodsOverwrite || lifecycleMethods).forEach((method) => {
      if (typeof componentClass.prototype[method] !== 'undefined') {
        sinon.stub(componentClass.prototype, method).returns(toReturn || null);
      }
    });

    if (stubProps) {
      afterEach(() => {
        componentClass.propTypes = originalPropTypes;
      });
    }
  });
}

global.expect = expect;
global.testHelpers = {
  getStore,
  getMockStore,
  shallowWithStore,
  mountWithStore,
  stubComponent,
};
