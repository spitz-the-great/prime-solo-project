import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../Header/Header.js';
import Nav from '../../components/Nav/Nav';

import { USER_ACTIONS } from '../../redux/actions/userActions';
import { triggerLogout } from '../../redux/actions/loginActions';

const mapStateToProps = state => ({
  user: state.user,
});

class UserPage extends Component {

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

  enterChatPage = () => {
    this.props.history.push('info')
  }

  render() {
    
    let content = null;

    let dummyUsers = ["user1", "user2"];

    if (this.props.user.userName) {
      content = (
        <div>
          <h1
            id="welcome"
          >
            Welcome, {this.props.user.userName}!
          </h1>
          <p>Your ID is: {this.props.user.id}</p>

          <button onClick={this.enterChatPage}>
            Join Main Chat
          </button>
          <ul>Others Online:
            <br />
            

            <li>user1
 
            </li>
            <li>user2

           </li>
          </ul>

          <button
            onClick={this.logout}
          >
            Log Out
          </button>
        </div>
      );
    }

    return (
      <div>
        <Header title="Multiplayer Chat App" />
        <Nav history={this.props.history}/>
        {content}
      </div>
    );
  }
}

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(UserPage);

