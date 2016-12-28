import { jsdom } from 'jsdom';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import icepick from 'icepick';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

function createLocalStorage() {
  const storage = {};

  return {
    getItem: key => storage[key],
    setItem: (key, item) => {
      storage[key] = item;
    },
    removeItem: (key) => {
      delete storage[key];
    },
  };
}

const doc = jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;

chai.use(sinonChai);
chai.use(chaiAsPromised);

global.self = global;
global.icepick = icepick;
global.chai = chai;
global.expect = chai.expect;
global.sinon = sinon;
global.shallow = shallow;
global.mount = mount;
global.document = doc;
global.window = win;
global.localStorage = createLocalStorage();

((window) => {
  for (const key in window) {
    if (window.hasOwnProperty(key)) { // eslint-disable-line no-prototype-builtins
      if (!(key in global)) {
        global[key] = window[key];
      }
    }
  }
})(win);

global.navigator = {
  userAgent: 'node.js',
};

if (process.argv.includes('headless')) {
  global.testHelpers = require('./testHelpers'); // eslint-disable-line global-require
}
