import React from 'react';
import './ConsultingCard.scss';

const ConsultingCard = () => (
  <div className="cowr">
    <img src="/consulting.jpg" alt="" role="presentation" />
    <div className="coco">
      <h2>Consulting</h2>
      <div className="cardContent">I actively work as a freelancer consultant - see what I can help with</div>
      <a className="cardLink" href="#">Right here</a>
    </div>
  </div>
);

export default ConsultingCard;
