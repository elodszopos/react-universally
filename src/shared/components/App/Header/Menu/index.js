import React from 'react';
import { Link } from 'react-router';

const Menu = () => (
  <ul style={{ marginTop: '1rem' }}>
    <li><Link to="/">Home</Link></li>
    <li><Link to="/about">About</Link></li>
  </ul>
);

export default Menu;
