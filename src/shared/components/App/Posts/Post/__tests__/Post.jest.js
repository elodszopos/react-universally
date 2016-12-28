import React from 'react';
import { shallow } from 'enzyme';
import { Post } from '../index';

describe('<Post />', () => {
  test('renders', () => {
    const wrapper = shallow(<Post post={{ title: 'postTitle', body: 'postBody' }} />);

    expect(wrapper).toMatchSnapshot();
  });
});
