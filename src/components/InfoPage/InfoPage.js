import React, { Component } from 'react';
import { connect } from 'react-redux';

import Nav from '../../components/Nav/Nav';
import { USER_ACTIONS } from '../../redux/actions/userActions';

import './InfoPage.css';

// socket.io
import socketIOClient from 'socket.io-client';
const socket = socketIOClient('http://localhost:5000', { transports: ['websocket'] });
const mapStateToProps = state => ({
  user: state.user,
});

class InfoPage extends Component {
  constructor() {
    super()
    this.state = {
      
      color: 'white',
      newMessage: '',
      messagesList: []

    }

    socket.on('change color', (col) => {
      document.body.style.backgroundColor = col
    });

    socket.on('update messages', (data) => {
      console.log('from server: ', data);
      this.updateMessageList(data)
      console.log(this.state.messagesList)
    });
  }

  send = () => {
    socket.emit('change color', this.state.color)
  }

  setColor = (color) => {
    this.setState({ color })
  }

  componentDidMount() {
    this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
    socketIOClient({  transports: ['websocket'] });
    socketIOClient.connect('http://localhost:5000', { transports: ['websocket'] });
  }

  componentDidUpdate() {
    if (!this.props.user.isLoading && this.props.user.userName === null) {
      this.props.history.push('home');
    }
  }

  newMessageClick = (event) => {
    event.preventDefault();
    let data = {
      message: this.state.newMessage,
      user: this.props.user.userName
    }
  
    // const socket = socketIOClient('http://localhost:5000', { transports: ['websocket'] });
    socket.emit('new message', {
      user: this.props.user.userName,
      message: this.state.newMessage
    });
    console.log(data);
  }

  updateMessageList = (data) => {
    // const socket = socketIOClient('http://localhost:5000', { transports: ['websocket'] });
    // socket.on('update messages', (data) => {
      console.log('from server: ', data);
      this.setState({messagesList: [...this.state.messagesList, data]});
    // });
  }

  changeHandler = (event) => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
    })
  }

  render() {
    let content = null;

    if (this.props.user.userName) {
      content = (
        <div>
          <p>
            Chat Page
          </p>
          <ul className="others">Others Online:
            <br />
            <li>user1</li>
            <li>user2</li>
          </ul>

          <div className="chat">General Chat</div>

          <div style={{ textAlign: "center" }}>
            <button onClick={() => this.send()}>Change Color</button>
            <button id="red" onClick={() => this.setColor('red')}>Red</button>
            <button id="blue" onClick={() => this.setColor('blue')}>Blue</button>
          </div>
          <form onSubmit={this.newMessageClick}>
            <input
              onChange={this.changeHandler}
              value={this.state.newMessage}
              type="text" name="newMessage">
            </input>
            <button type="submit" >Send Message</button>
          </form>
          <div>
            {/* {this.state.messagesList} */}
            <p>{this.props.user.userName}:</p>
          {this.state.messagesList.map((message, i) =>{
            return(
              <ul key={i}>
             <li>{message.user}: {message.message}</li>
              </ul>

            )

          })}

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
