import React from 'react';
import './WritingCard.scss';

const WritingCard = () => (
  <div className="wcwr">
    <img src="/writing-min.jpg" alt="" role="presentation" />
    <div className="wco">
      <h2>Articles & Writing</h2>
      <div className="wcDetailRow">
        Sometimes I write articles about various tech topics and I publish on Medium
        <i className="fa fa-medium article-medium-detail"/>
      </div>
      <a className="cardLink" href="#">Take me to the articles</a>
    </div>
  </div>
);

export default WritingCard;
