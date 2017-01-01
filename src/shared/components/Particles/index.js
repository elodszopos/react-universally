import React, { PureComponent } from 'react';
import particlesConfig from './particles-config.json';

export default class ShineLikeAMotherFuckingStar extends PureComponent {
  // componentDidMount() {
  //   setTimeout(() => {
  //     try {
  //       require('particles.js'); // eslint-disable-line global-require
  //     } catch (e) {
  //       console.warn(e); // eslint-disable-line no-console
  //     }
  //
  //     if (window.particlesJS) {
  //       window.particlesJS('particles', particlesConfig);
  //     }
  //   }, 0);
  // }

  render() {
    return <div id="particles" />;
  }
}
