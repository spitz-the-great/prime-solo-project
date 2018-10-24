import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Matter from "matter-js";
import Nav from '../../components/Nav/Nav';
import { USER_ACTIONS } from '../../redux/actions/userActions';

import PhysicsPage from './PhysicsPage.js';
import ChatAvatars from './ChatAvatars.js';

// material/css imports
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import './InfoPage.css';


// socket.io
import socketIOClient from 'socket.io-client';
const socket = socketIOClient('10.100.100.109:5000', { transports: ['websocket'] });
// http://localhost:5000
// 10.100.100.198:5000

const mapStateToProps = state => ({
  user: state.user,
});
const avatarList = [
  { name: 'hoverCat', imgPath: 'avatars/hover_cat.png' },
  { name: 'nyanCat', imgPath: 'avatars/nyan_cat.png' },
  { name: ''}
]

// let canvas = document.getElementById('testCanvas');
// >>>>>>>>>>>> matter.js start
// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create();
// let phys = document.getElementById('phys');
// create a renderer
// var render = Render.create({
//   // element: phys,
//   // element: document.body,
//   element: this.canvas,
//   engine: engine,
//   options: {
//     width: window.innerWidth,
//     height: window.innerHeight,
//     background: 'transparent',
//     wireframes: false,
//     // width: 1000,
//     // height: 1000,

//   }
// }); // end renderer

// create two boxes and a ground
var boxA = Bodies.rectangle(0, 100, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });



let avatar = Bodies.circle(400, 300, 46, {
  render: {
    sprite: {
      texture: avatarList[0].imgPath,
      // xScale: 2,
      // yScale: 2
    }
  }
});

// add all of the bodies to the world
World.add(engine.world, [boxA, boxB, avatar, ground]);


class InfoPage extends Component {
  constructor(props) {
    super(props)
    this.state = {

      color: 'white',
      newMessage: '',
      messagesList: [],
      userList: [],
      numberOfUsers: '',
      typingUser: '',
      avatar: '',
      avatarPath: '',
      avatarFromDb: '',
      pathFromDb: '',

      usersData: [{
        name: '',
        avatar: '',
        path: '',
      }]



      // canvasRef: React.createRef(),

    }

    // let testCanvas = React.createRef();
    // var render = Render.create({
    //   // element: phys,
    //   // element: document.body,
    //   element: this.testCanvas.current,
    //   engine: engine,
    //   options: {
    //     width: window.innerWidth,
    //     height: window.innerHeight,
    //     background: 'transparent',
    //     wireframes: false,
    //     // width: 1000,
    //     // height: 1000,

    //   }
    // });




    // this.testCanvas = React.createRef();

    // const canvas = this.refs.testCanvas;
    // const ctx = canvas.getContext("2d");
    // ctx.canvas.width = window.innerWidth;
    // ctx.canvas.height = window.innerHeight;

    // let bgImage = this.refs.bg;

    // ctx.fillRect(0, 0, 100, 100);


    // ctx.drawImage(bgImage, 0, 0); works

    // ctx.drawImage(bgImage, 0, 0, bgImage.width, bgImage.height,     // source rectangle
    //   0, 0, canvas.width, canvas.height);

    // bgImage.onload = () => {
    //   console.log('in onload');
    //   // stretch image to fill canvas size
    //   ctx.drawImage(bgImage, 0, 0, bgImage.width, bgImage.height,     // source rectangle
    //     0, 0, canvas.width, canvas.height);}


    ///// start socket events
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

    socket.on('update_users_data', (usersData) => {
      this.updateUsersData(usersData);
    })

    socket.on('update_typing_status', (typingUser) => {
      this.updateTypingStatus(typingUser);
    })

    socket.on('typing_status_clear', () => {
      this.updateTypingStatus('');
    })

    socket.on('update_current_data', (usersDataList) => {
      this.updateCurrentData(usersDataList);
    })
    ////// end socket events

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
    socketIOClient.connect('10.100.100.109:3000', { transports: ['websocket'] });
    //192.168.1.5
    // http://localhost:3000
    // 10.100.100.198:3000
    this.getAvatarPath();

    // socket.emit('new user', this.props.user.userName);

    socket.emit('new user', this.props.user.userName);

    // const canvas = this.refs.testCanvas;
    socket.emit('get_current_users_data');
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
      newMessage: '',
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
        // userList: [...this.state.userList, userList]

      });
    }
  }

  updateUsersData = (usersData) => {
    console.log('user data from server/socket: ', usersData);
    if (usersData) {
      this.setState({
        // usersData: [...this.state.usersData, usersData]
        usersData: usersData
      })
    }
  }

  updateCurrentData = (usersDataList) => {
    console.log('usersDataList from server/socket: ', usersDataList);
    if (usersDataList) {
      this.setState({
        usersData: usersDataList
      })
    }
  }

  addSocketId = (usersDataList) => {
    console.log('usersDataList from server: ', usersDataList);
    if (usersDataList) {
      this.setState({
        usersData: usersDataList
      })
    }
  }

  changeHandler = (event) => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
    })
    this.isTyping();
  }

  // getUserAvatar = () => {
  //   console.log('in get avatar');
  //   axios({
  //     method: 'GET',
  //     url: 'api/person/getAvatar'
  //   }).then((results) => {
  //     console.log('avatar results: ', results)
  //     this.setState({
  //       avatar: results.data.avatar
  //     })
  //   }).catch((error) => {
  //     console.log('Error getting count', error);
  //   })
  // }

  getAvatarPath = () => {
    console.log('in get avatar');
    axios({
      method: 'GET',
      url: 'api/person/getPath'
    }).then((results) => {
      console.log('avatar results: ', results);
      //   console.log('results.data.avatar: ', results.data.avatar);
      this.setState({
        avatarFromDb: results.data[0].avatar,
        pathFromDb: results.data[0].image_path
      })
      socket.emit('new_users_data', this.props.user.userName, this.state.avatarFromDb, this.state.pathFromDb);
    }).catch((error) => {
      console.log('Error getting count', error);
    })
  } // end getAvatarPath

  render() {
    let content = null;
    let avatar = this.state.avatarFromDb;

    let path = this.state.pathFromDb;


    console.log(this.state);


    if (this.props.user.userName) {
      content = (

        <div className="infoContainer">
          {/* <PhysicsPage className="physicsCanvas" /> */}

          {/* <canvas ref="testCanvas"
            className="test"
            width="200" height="100">
          </canvas> */}

          <h2 className="h2">
            Chat Page 
          </h2>

           <div className="typingUser">
                {this.state.typingUser &&
                  <p>{this.state.typingUser}, is typing...</p>}
              </div>

              <br></br>
            <br></br>
          {/* <ChatAvatars avatar={avatar} path={path}/> */}

          {/* conditional render more <ChatAvatars/> based on length of this.state.userList */}
          <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
            <br></br>
            <br></br>
          <div className="avContainer">
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
          
              {this.state.usersData.map((user, i) => {

                return (
                  <div className="avGallery" key={i}>
                  <ChatAvatars className="avs" name={user.username} avatar={user.avatar} path={user.path} />
                  <span className="userName">{user.username}</span>
                  </div>
                )
              })
              }
            </Grid>
          </div>


          <Grid
            // className="content"
            container
            direction="column"
            justify="flex-start"
            alignItems="flex-end"
          >
            <div className="chatContainer">
              <h4 className="right">Connected users:</h4>
             

              {/* {JSON.stringify(this.state.userList)} */}

              <div className="userList">
                {this.state.userList.map((user, i) => {
                  return (
                    <ul id="connectedUsers" key={i}>
                      <li >{user}</li>
                      <br></br>
                    </ul>
                  )
                })}
              </div>
              
              <br></br>
               {/* <div className="typingUser">
                {this.state.typingUser &&
                  <p>{this.state.typingUser}, is typing...</p>}
              </div> */}
              

              <h4>General Chat:</h4>
              <div>
                <form className="chatForm" onSubmit={this.newMessageClick}>
                  <TextField
                    id="chatInput"
                    variant="outlined"
                    label="mew it up!"
                    onChange={this.changeHandler}
                    value={this.state.newMessage}
                    type="text" name="newMessage">
                  </TextField>
                  <Button id="submitButton" type="submit" variant="outlined">Meow</Button>
                </form>
                <div className="chatLog">
                  {this.state.messagesList.map((message, i) => {
                    return (
                      <ul className="chats" key={i}>
                        <li className="chats" >{message.user}: {message.message}</li>
                        <br></br>
                      </ul>
                    )
                  })}
                </div>
              </div>
            </div>
            {/* end chatContainer div */}
          </Grid>
          </Grid>
          <br />
          <br />

          <div style={{ textAlign: "center" }}>
          
            <Button variant="outlined" className="colors" onClick={() => this.send()}>Change Color</Button>
            <Button variant="outlined" className="colors" id="red" onClick={() => this.setColor('red')}>Red</Button>
            <Button variant="outlined" className="colors" id="blue" onClick={() => this.setColor('skyblue')}>Sky Blue</Button>
            <Button variant="outlined" className="colors" id="yellow" onClick={() => this.setColor('yellow')}>Yellow</Button>
            <Button variant="outlined" className="colors" id="deepPink" onClick={() => this.setColor('deeppink')}>Deep Pink</Button>

          </div>

        </div>
      );
    }

    return (
      <div>
        <Nav history={this.props.history} id="content" />
        {/* <canvas ref="testCanvas"
            className="test"
            width="200" height="100">
          </canvas> */}
        {content}
        {/* <PhysicsPage avatar={avatar} className="physicsCanvas" /> */}
      </div>
    );
  }
}

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(InfoPage);
