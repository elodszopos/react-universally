import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';
import initTraqBall from './TraqBall';
import './Logo3D.scss';

export default class Logo3D extends PureComponent {
  componentDidMount() {
    const _this = this;

    function handleLoad() {
      const TraqBall = initTraqBall();

      clearInterval(_this.Modernizr);

      return new TraqBall({
        stage: 'stage',
        axis: [-0.57, 0.777, -0.287],
        angle: 1,
      });
    }

    if (!window.Modernizr) {
      this.Modernizr = setInterval(() => {
        if (window.Modernizr) {
          handleLoad();
        }
      }, 500);
    }
  }

  render() {
    return (
      <div>
        <Helmet
          script={[
            { src: '/js/modernizr-custom.js', type: 'text/javascript' },
          ]}
        />
        <section id="stage">
          <article id="box">
            <section id="front">
              <h1>Spritebaker</h1>
              <h2>Boost Your CSS</h2>
              <img src="./img/logo.png" alt="spritebaker logo" title="spritebaker" width="138" height="112"/>
              <h3>Speedy Websites.Happy Clients.</h3>
              <h4>YOUR STYLETURBO!</h4>
              <p>www.eleqtriq.com</p>
            </section>
            <section id="top">box-top</section>
            <section id="bottom">box-bottom</section>
            <section id="back">
              <h1>Spritebaker</h1>
              <h2>Boost Your CSS</h2>
              <img src="./img/logo.png" alt="spritebaker logo" title="spritebaker" width="138" height="112"/>
              <h3>Speedy Websites.Happy Clients.</h3>
              <h4>YOUR STYLETURBO!</h4>
              <p>www.eleqtriq.com</p>
            </section>
            <section id="left">
              <h2>Boost Your CSS</h2>
            </section>
            <section id="right">
              <h1>Spritebaker</h1>
            </section>
          </article>
        </section>
      </div>
    )
  }

}
