import React from 'react';
import './PlaygroundCard.scss';

const PlaygroundCard = () => (
  <div className="pgcw">
    <img src="/p3.jpg" alt="" role="presentation" />
    <div className="pgo">
      <h2>Playground</h2>
      <p className="cardContent">
        A place where I keep all the fun mini projects that I have -
         feel free to play with all the toys!
      </p>
      <p>
        <a className="cardLink">TAKE ME TO THE PLAYGROUND!</a>
      </p>
    </div>
  </div>
);

export default PlaygroundCard;
