import React from 'react';
import './ContactCard.scss';

const ContactCard = () => (
  <div className="ccwr">
    <img className="img-responsive" src="/contact_3-min.jpg" alt="" role="presentation" />
    <div>
      <h2>CONTACT ME</h2>
      <p className="ccSet1">
        <a href="https://www.twitter.com/elodszopos" target="_blank" rel="noopener noreferrer" className="ccinfo">
          <i className="fa fa-twitter" />
        </a>
        <a href="https://www.facebook.com/elodarpad.szopos" target="_blank" rel="noopener noreferrer" className="ccinfo">
          <i className="fa fa-facebook" />
        </a>
      </p>
      <hr />
      <hr />
      <p className="ccSet2">
        <a className="ccinfo" href={`mailto:?To=me@elodszopos.com&Subject=${'Hello Elod'}&Body=${'Hello, \n I saw your contact details on your site.'}`}>
          <i className="fa fa-envelope" />
        </a>
        <a href="https://github.com/elodszopos" className="ccinfo" target="_blank" rel="noopener noreferrer">
          <i className="fa fa-github" />
        </a>
      </p>
    </div>
  </div>
);

export default ContactCard;
