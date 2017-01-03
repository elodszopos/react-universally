import React from 'react';
import './ColorPicker.scss';

const ColorPicker = () => (
  <div className="button">
    <div className="center">
      <div className="pin"></div>
    </div>
    <div className="wheel">
      <ul className="colors">
        <li className="color" />
        <li className="color" />
        <li className="color" />
        <li className="color" />
        <li className="color" />
        <li className="color" />
        <li className="color" />
        <li className="color" />
        <li className="color" />
        <li className="color" />
        <li className="color" />
        <li className="color" />
      </ul>
    </div>
  </div>
);

export default ColorPicker;
