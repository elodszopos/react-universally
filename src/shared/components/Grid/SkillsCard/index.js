import React from 'react';
import './SkillsCard.scss';

const SkillsCard = () => (
  <div className="scwr">
    <img src="/skill_set-min.jpg" alt="" role="presentation" />
    <div className="sco">
      <h2>About my skills</h2>
      <div className="scDetailRow">Find out more about my skills, knowledge and my ambitions as a software developer & architect</div>
      <a className="cardLink" href="#">Right here</a>
    </div>
  </div>
);

export default SkillsCard;
