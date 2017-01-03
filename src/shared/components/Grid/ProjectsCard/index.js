import React from 'react';
import './ProjectsCard.scss';

const ProjectsCard = () => (
  <div className="prcw">
    <img src="/projects-min.jpg" alt="" role="presentation" />
    <div className="pco">
      <h2>Projects</h2>
      <div className="cardContent">A brief history of my previous projects</div>
      <a className="cardLink" href="#">Right here</a>
    </div>
  </div>
);

export default ProjectsCard;
