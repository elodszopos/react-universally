import React from 'react';
import './AboutCard.scss';

const AboutCard = () => (
  <div className="abwr">
    <img src="/whoami-min.jpg" alt="" role="presentation" />
    <div className="abo">
      <h2>ABOUT ME</h2>
      <div className="cardContent">Find out a little more about me and what I do in my free time</div>
      <a className="cardLink" href="#">Who am I?</a>
    </div>
  </div>
);

export default AboutCard;
