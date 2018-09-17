
const express = require('express');
require('dotenv').config();
const app = express();
// start io config
// const io = require('socket.io'); << not working
// const io = require('socket.io')(app);

// App Set //
const PORT = process.env.PORT || 5000;
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', (client) => {
  
});
//end io config




// var server = require('http').createServer(app)
// var io = require('socket.io')(server)

server.listen(PORT);



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
// const PORT = process.env.PORT || 5000;

/** Listen * */
// app.listen(PORT, () => {
//   console.log(`Listening on port: ${PORT}`);
// });
