import React from 'react';

import '../../styles/main.css';

const Header = ({ title }) => (
  <div className="instructions">
    <div>
      <h1 className="lead">{ title }</h1>
    </div>
  </div>
);

export default Header;
