import React from 'react';
import Helmet from 'react-helmet';

import Logo3D from 'shared/components/Logo3D';

const About = () => (
  <div style={{ textAlign: 'center' }}>
    <Helmet title="About" />

    Produced with ❤️
    by
    &nbsp;
    <a href="https://twitter.com/elodszopos" target="_blank" rel="noopener noreferrer">
      Elod Szopos
    </a>
    <Logo3D />
  </div>
);

export default About;
