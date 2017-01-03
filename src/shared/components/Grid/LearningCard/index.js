import React from 'react';
import './LearningCard.scss';

const LearningCard = () => (
  <div className="lcwr">
    <img src="/learning-min.jpg" alt="" role="presentation" />
    <div className="lco">
      <h2>Learning Materials</h2>
      <p className="cardContent">
        A collection of learning materials and links that I found useful and were of great help.
      </p>
      <p>
        <a className="cardLink" href="#">Take me to the study room!</a>
      </p>
    </div>
  </div>
);

export default LearningCard;
