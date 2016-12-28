import React from 'react';
import { shallow } from 'enzyme';
import About from '../index';

describe('<About />', () => {
  test('renders', () => {
    const wrapper = shallow(<About />);

    expect(wrapper).toMatchSnapshot();
  });
});
