/* eslint global-require: 0 */

import React from 'react';

const ReactHotLoader = process.env.NODE_ENV === 'development' ? require('react-hot-loader').AppContainer : ({ children }) => React.Children.only(children);

export default ReactHotLoader;
