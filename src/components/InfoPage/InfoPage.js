import React, { Component } from 'react';
import { connect } from 'react-redux';
import Matter from "matter-js";
import Nav from '../../components/Nav/Nav';
import { USER_ACTIONS } from '../../redux/actions/userActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
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

    socket.on('update_typing_status', (typingUser) => {
      this.updateTypingStatus(typingUser);
    })

    socket.on('typing_status_clear', () => {
      this.updateTypingStatus('');
    })


    const canvas = this.refs.infoCanvas;
    // const ctx = canvas.getContext("2d");
    // ctx.canvas.width = window.innerWidth;
    // ctx.canvas.height = window.innerHeight;

    // this.canvas.width = window.innerWidth;
    // this.canvas.height = window.innerHeight;

    // window.addEventListener("resize", function(){
    //     canvas.width = window.innerWidth;
    //     canvas.height = window.innerHeight;
    // });

    // >>>>>>>>>>>> matter.js start
    // module aliases
    var Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies;

    // create an engine
    var engine = Engine.create();

    // setRenderWidth = (percent) => {
    //   return Math.round(percent / 100 * window.innerWidth);
    // }
    // setRenderHeight = (percent) => {
    //   return Math.round(percent / 100 * window.innerHeight);
    // }
    // create a renderer
    var render = Render.create({
      // element: canvas, << breaks everything
      element: document.body,
      engine: engine,
      width: window.innerWidth,
      height: window.innerHeight,
      // background: ,
      // canvas: myCanvas,
    });

    // create two boxes and a ground
    var boxA = Bodies.rectangle(400, 200, 80, 80);
    var boxB = Bodies.rectangle(450, 50, 80, 80);
    var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

    // add all of the bodies to the world
    World.add(engine.world, [boxA, boxB, ground]);

    // run the engine
    Engine.run(engine);

    // run the renderer
    Render.run(render);

    // >>>>>>>>>>>> matter.js end
  } // end constructor



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
    //192.168.1.5
    // http://localhost:3000
    // 10.100.100.198:3000

    socket.emit('new user', this.props.user.userName);



  } // end didMount

  componentDidUpdate() {
    if (!this.props.user.isLoading && this.props.user.userName === null) {
      this.props.history.push('home');
      // socket.emit('new user', this.props.user.userName);
    }
  }

  isTyping = () => {
    console.log('in is typing, user: ', this.props.user.userName)
    socket.emit('is_typing', this.props.user.userName);
  }

  updateTypingStatus = (user) => {
    console.log('in updateTyping, user: ', user);
    this.setState({ typingUser: user });

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
    this.setState({
      newMessage:'',
    })
    

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
        <div className="infoContainer">

          <canvas ref="infoCanvas"
            className="canvasActual"
            width="600" height="450">
          </canvas>
          <p>
            Chat Page
          </p>
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="flex-end"
          >
            <div className="chatContainer">
              <h4 className="right">Connected users:</h4>
              <div className="typingUser">
                {this.state.typingUser &&
                  <p>{this.state.typingUser}, is typing...</p>}
              </div>

              {/* {JSON.stringify(this.state.userList)} */}

              <div className="userList">
                {this.state.userList.map((user, i) => {
                  return (
                    <ul id="connectedUsers" key={i}>
                      <li >{user}</li>
                    </ul>
                  )
                })}
              </div>
              <br />
              <br></br>

              <h4>General Chat:</h4>
              <div>
                <form className="chatForm"onSubmit={this.newMessageClick}>
                  <TextField
                    id="chatInput"
                    variant="outlined"
                    label="chat it up"
                    onChange={this.changeHandler}
                    value={this.state.newMessage}
                    type="text" name="newMessage">
                  </TextField>
                  <Button id="submitButton" type="submit" variant="outlined">Submit</Button>
                </form>
                <div className="chatLog">
                  {this.state.messagesList.map((message, i) => {
                    return (
                      <ul className="chats" key={i}>
                        <li className="chats" >{message.user}: {message.message}</li>
                      </ul>
                    )
                  })}
                </div>
              </div>
            </div>
            {/* end chatContainer div */}
            </Grid>
          <br />
          <br />

          <div style={{ textAlign: "left" }}>
            <button onClick={() => this.send()}>Change Color</button>
            <button id="red" onClick={() => this.setColor('red')}>Red</button>
            <button id="blue" onClick={() => this.setColor('blue')}>Blue</button>
          </div>

        </div>
      );
    }

    return (
      <div>
        <Nav id="content" />
        {content}
      </div>
    );
  }
}

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(InfoPage);
