import React from 'react';
import { Link } from 'react-router-dom';

// logout = () => {
//   this.props.dispatch(triggerLogout());
// }
// const location = this.props.location;

const Nav = () => (

  <div className="navbar">
    <div>
      <ul>
        <li>
          <Link to="/user">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/profile">
            Manage Profile
          </Link>
        </li>
        <li>
          <Link to="/info">
            Chat Page
          </Link>
        </li>
        {/* need to figure out how to keep user on same page
        alert confirm box, then log out - onClick */}
        <li>
        <Link to="/">
            Log Out
          </Link>
          </li>
      </ul>
    </div>
  </div>
);

export default Nav;
