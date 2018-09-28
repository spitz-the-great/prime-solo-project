const express = require('express');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');

const passport = require('./strategies/user.strategy');

// Route includes
const userRouter = require('./routes/user.router');
const personRouter = require('./routes/person.router');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/api/person', personRouter);

// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;

// <<<<<<<---- socket.io trial arena

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

const io = require('socket.io')(server, { path: '/socket.io' });

let numberOfUsers = 0;

let connectedUsers = [];

io.on('connection', socket => {
  console.log('User connected');

  numberOfUsers++;
  console.log(numberOfUsers);
  

  socket.on('change color', (color) => {
    console.log('Color Changed to: ', color)
    io.sockets.emit('change color', color)
  });

  function onConnection(socket){
    socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
  }

  socket.on('disconnect', () => {

    console.log('user disconnected: ', socket.userName)
    let i = connectedUsers.indexOf(socket.userName);
    if (i != -1) {
      connectedUsers.splice(i, 1);
    }
    numberOfUsers--;
    
    // function updateUsers(connectedUsers){
    //   io.sockets.emit('update_connected_users', connectedUsers);
    // }
    // console.log('connected users: ', connectedUsers, 'number of users: ', numberOfUsers);
    // setTimeout(updateUsers(connectedUsers), 100);

    io.sockets.emit('update_connected_users', connectedUsers);
  }); // end disconnect


  socket.on('new message', (data) => {

    console.log('in new message socket - server', data);
    io.sockets.emit('update messages', data);
    io.sockets.emit('typing_status_clear');
    
  }); // end new message

  //update connected user list
  socket.on('new user', (username) => {
    console.log('new user: ', username);
  
    socket.userName = username;

    check = connectedUsers.includes(socket.userName);
    if (check === false) {

      connectedUsers.push(socket.userName);
    }
    let data = {
      connectedUsers
    }

    io.sockets.emit('update_connected_users', data);
    console.log('connected users from server: ', connectedUsers);
  }); // end new user

  socket.on('is_typing', (username) => {
    console.log('in user is typing socket event', username);
    io.sockets.emit('update_typing_status', username);
  })


})

// <<<<<<<---- end socket.io trial arena



