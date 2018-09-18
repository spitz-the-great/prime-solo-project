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
app.use('/person', personRouter);

// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;


// <<<<<<<---- socket.io trial arena - this works, but only sometimes and really slowly

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

const io = require('socket.io')(server, {path:'/socket.io'}); 

// // This is what the socket.io syntax is like, we will work this later
io.on('connection', socket => {
  console.log('User connected');
  
  // just like on the client side, we have a socket.on method that takes a callback function
  socket.on('change color', (color) => {
    // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
    // we make use of the socket.emit method again with the argument given to use from the callback function above
    console.log('Color Changed to: ', color)
    io.sockets.emit('change color', color)
  })
  
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

// <<<<<<<---- end socket.io trial arena


/** Listen * */
// app.listen(PORT, () => {
//   console.log(`Listening on port: ${PORT}`);
// });


