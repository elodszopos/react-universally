import React from 'react';
import Helmet from 'react-helmet';
import Grid from '../Grid';

import { safeConfigGet } from '../../utils/config';

const Home = () => (
    <div>
      <Helmet title="Home" />
      {/*<h2>{safeConfigGet(['welcomeMessage'])}</h2>*/}
      {/*<div id="particles" />*/}
      <Grid />
    </div>
);

export default Home;
