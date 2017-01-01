import React from 'react';
import Helmet from 'react-helmet';

const About = () => (
  <div style={{ textAlign: 'center' }}>
    <Helmet title="About" />

    Produced with ❤️
    by
    &nbsp;
    <a href="https://twitter.com/elodszopos" target="_blank" rel="noopener noreferrer">
      Elod Szopos
    </a>
  </div>
);

export default About;
