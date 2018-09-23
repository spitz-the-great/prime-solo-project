import React, { Component } from 'react';
import { connect } from 'react-redux';

import Nav from '../../components/Nav/Nav';
import { USER_ACTIONS } from '../../redux/actions/userActions';

import './InfoPage.css';

// socket.io
import socketIOClient from 'socket.io-client';
const socket = socketIOClient('10.100.100.198:5000', { transports: ['websocket'] });
// http://localhost:5000
// 10.100.100.198:5000

const mapStateToProps = state => ({
  user: state.user,
});

class InfoPage extends Component {
  constructor() {
    super()
    this.state = {

      color: 'white',
      newMessage: '',
      messagesList: [],
      userList: [],
      numberOfUsers: '',
      typingUser: ''

    }

    socket.on('change color', (col) => {
      document.body.style.backgroundColor = col
    });

    socket.on('update messages', (data) => {
      console.log('from server: ', data);
      this.updateMessageList(data)
      console.log(this.state.messagesList)
    });

    socket.on('update_connected_users', (userList) => {
      this.updateUserList(userList.connectedUsers);
    })

    socket.on('update_typing_status', (typingUser) =>{
      this.updateTypingStatus(typingUser);
    })

    socket.on('typing_status_clear', () =>{
      this.updateTypingStatus('');
    })

  }

  send = () => {
    socket.emit('change color', this.state.color)
  }

  setColor = (color) => {
    this.setState({ color })
  }

  componentDidMount() {
    this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
    socketIOClient({ transports: ['websocket'] });
    socketIOClient.connect('10.100.100.198:3000', { transports: ['websocket'] });

    // http://localhost:3000
    // 10.100.100.198:3000

    socket.emit('new user', this.props.user.userName);
  }

  componentDidUpdate() {
    if (!this.props.user.isLoading && this.props.user.userName === null) {
      this.props.history.push('home');
      // socket.emit('new user', this.props.user.userName);
    }
  }

  isTyping = () =>{
    console.log('in is typing, user: ', this.props.user.userName)
    socket.emit('is_typing', this.props.user.userName);
  }

  updateTypingStatus = (user) => {
    console.log('in updateTyping, user: ', user);
    this.setState({typingUser: user});
    
  }

  newMessageClick = (event) => {
    event.preventDefault();
    let data = {
      message: this.state.newMessage,
      user: this.props.user.userName
    }

    socket.emit('new message', {
      user: this.props.user.userName,
      message: this.state.newMessage
    });
    this.updateTypingStatus('');
    console.log(data);
  }

  updateMessageList = (data) => {
    console.log('from server: ', data);
    this.setState({ messagesList: [...this.state.messagesList, data] });

  }

  updateUserList = (userList) => {
    console.log('user list from server: ', userList);
    if (userList) {
      this.setState({
        userList: userList,
      });
    }
  }

  changeHandler = (event) => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
    })
    this.isTyping();
  }

  render() {
    let content = null;

    if (this.props.user.userName) {
      content = (
        <div>
          <p>
            Chat Page
          </p>

          {/* <div>{this.props.profile[0].privacy_setting &&
                        <p>Current privacy setting: {this.props.profile[0].privacy_setting}</p>
                    }</div>
        <div> */}
        <div>
        {this.state.typingUser && 
          <p>{this.state.typingUser}, is typing...</p>

          }</div>
          <form className="chatInput" onSubmit={this.newMessageClick}>
            <input
              onChange={this.changeHandler}
              value={this.state.newMessage}
              type="text" name="newMessage">
            </input>
            <button type="submit" >Send Message</button>
          </form>


          <h3 className="right">Connected users:</h3>
          <div className="chat">
            {/* {JSON.stringify(this.state.userList)} */}

            <div className="chat">
              {this.state.userList.map((user, i) => {
                return (

                  <ul className="right" key={i}>
                    <li className="right">{user}</li>
                  </ul>

                )
              })}
            </div>
          </div>
          <br />
          <br></br>
          <h3 className="right">General Chat:</h3>
          <br />
          <br />

          <div className="right">
            {this.state.messagesList.map((message, i) => {
              return (
                <ul className="right" key={i}>
                  <li className="right" >{message.user}: {message.message}</li>
                </ul>
              )
            })}
          </div>


          <br />
          <br />
          <div>
            <div style={{ textAlign: "left" }}>
              <button onClick={() => this.send()}>Change Color</button>
              <button id="red" onClick={() => this.setColor('red')}>Red</button>
              <button id="blue" onClick={() => this.setColor('blue')}>Blue</button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <Nav />
        {content}
      </div>
    );
  }
}

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(InfoPage);
