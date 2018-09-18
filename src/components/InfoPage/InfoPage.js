import React, { Component } from 'react';
import { connect } from 'react-redux';

import Nav from '../../components/Nav/Nav';
import { USER_ACTIONS } from '../../redux/actions/userActions';

import './InfoPage.css';

// socket.io
import socketIOClient from 'socket.io-client';

const mapStateToProps = state => ({
  user: state.user,
});

class InfoPage extends Component {
  constructor() {
    super()
    this.state = {
      // endpoint: "http://localhost:3000",
      // this is where we are connecting to with sockets

      color: 'white',

    }
  }

  // method for emitting a socket.io event
  send = () => {
    const socket = socketIOClient('http://localhost:5000',  {transports:['websocket']});
    socket.emit('change color', this.state.color) // change 'red' to this.state.color

    // this emits an event to the socket (your server) with an argument of 'red'
    // you can make the argument any color you would like, or any kind of data you want to send.

    // socket.emit('change color', 'red', 'yellow') | you can have multiple arguments
  }

  setColor = (color) => {
    this.setState({ color })
  }


  componentDidMount() {
    this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
    socketIOClient({ path: '/socket', transports: ['websocket'] });
    socketIOClient.connect('http://localhost:5000',  {transports:['websocket']});
  }

  componentDidUpdate() {
    if (!this.props.user.isLoading && this.props.user.userName === null) {
      this.props.history.push('home');
    }
  }

  render() {
    let content = null;

    const socket = socketIOClient('http://localhost:5000',  {transports:['websocket']});
    // setting the color of our button
    socket.on('change color', (col) => {
      document.body.style.backgroundColor = col
    })

    // socket.on is another method that checks for incoming events from the server
    // This method is looking for the event 'change color'
    // socket.on takes a callback function for the first argument




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
