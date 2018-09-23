import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { triggerLogin, formError, clearError } from '../../redux/actions/loginActions';
import { USER_ACTIONS } from '../../redux/actions/userActions';


import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import './LoginPage.css';

// const width = 800;
// const height = window.innerHeight;
// const ratio = window.devicePixelRatio || 1;

const mapStateToProps = state => ({
  user: state.user,
  login: state.login,
});

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      //   screen: {
      //     width: width,
      //     height: height,
      //     ratio: window.devicePixelRatio || 1 
      // }
    }
  }

  componentDidMount() {
    this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
    this.props.dispatch(clearError());

    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    ctx.fillRect(0, 0, 100, 100);

    // canvas.onload = () =>{
    //   ctx.drawImage( 0, 0);
    //   ctx.font = "40px Courier";
    //   ctx.fillText("ayooooooooo", 210, 75)
    // }

  }

  componentDidUpdate() {
    if (!this.props.user.isLoading && this.props.user.userName !== null) {
      this.props.history.push('user');
    }
    // const canvas = this.refs.canvas;
    // const ctx = canvas.getContext("2d");
    // ctx.canvas.width = window.innerWidth;
    // ctx.canvas.height = window.innerHeight;
  }

  login = (event) => {
    event.preventDefault();

    if (this.state.username === '' || this.state.password === '') {
      this.props.dispatch(formError());
    } else {
      this.props.dispatch(triggerLogin(this.state.username, this.state.password));
    }
  }

  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  renderAlert() {
    if (this.props.login.message !== '') {
      return (
        <h2
          className="alert"
          role="alert"
        >
          {this.props.login.message}
        </h2>
      );
    }
    return (<span />);
  }

  render() {
    return (
      // this is the container div for the entire render, 
      // named canvasContainer instead of container to avoid conflicts
      <div className="canvasContainer">

        <canvas ref="canvas"
          className="canvasActual"
          width="600" height="450">
        </canvas>

        {this.renderAlert()}
        {/* {/* this div wraps the entire form and is the 
        only direct child div of the container before it closes below */}
        <div className="content">
          <form onSubmit={this.login}>
            <h1 >Login</h1>
            <div>
              <label htmlFor="username">
                Username:
              <input
                  type="text"
                  name="username"
                  value={this.state.username}
                  onChange={this.handleInputChangeFor('username')}
                />
              </label>
            </div>
            <div>
              <label htmlFor="password">
                Password:
              <input
                  type="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleInputChangeFor('password')}
                />
              </label>
            </div>
            <div>
              <input
                type="submit"
                name="submit"
                value="Log In"
              />
              <Link to="/register">Register</Link>
            </div>
          </form>
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps)(LoginPage);
