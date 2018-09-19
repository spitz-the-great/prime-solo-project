import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { USER_ACTIONS } from '../../redux/actions/userActions';
import { triggerLogout } from '../../redux/actions/loginActions';

const mapStateToProps = state => ({
  user: state.user,
});

class Nav extends Component {

  componentDidMount() {
    this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
  }

  componentDidUpdate() {
    if (!this.props.user.isLoading && this.props.user.userName === null) {
      this.props.history.push('home');
    }
  }
  logout = () => {
    this.props.dispatch(triggerLogout());
  }

  render() {
    return (
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
              <p className="logout"
                onClick={this.logout}>
                Log Out
          </p>
            </li>
          </ul>
        </div>
      </div>
    );  // end return
  } // end render
} // end component

export default connect(mapStateToProps)(Nav);
