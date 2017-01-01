import React from 'react';
import { shallow } from 'enzyme';
import Posts from '../index';

describe('<Posts />', () => {
  test('renders', () => {
    const wrapper = shallow(<Posts />);

    expect(wrapper).toMatchSnapshot();
  });
});
