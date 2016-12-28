import React from 'react';
import { shallow } from 'enzyme';
import About from '../index';

describe('<About />', () => {
  it('renders', () => {
    const wrapper = shallow(<About />);

    expect(wrapper.find('div').length).to.equal(1);
  });
});
