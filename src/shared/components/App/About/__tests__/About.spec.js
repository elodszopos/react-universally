import React from 'react';
import About from '../index';

describe('<About />', () => {
  it('renders', () => {
    const wrapper = testHelpers.shallowWithStore(<About />);

    expect(wrapper.find('div').length).to.equal(1);
  });
});
