// Main starting point of application -
// node 5.5 does note have all ES6 so we'll use require for imports

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
var helmet = require('helmet');
const app = express();

// routes

const authRouter = require('./router');

// DB setup
require('./connections/mongodb').open();

// App Setup
app.use(morgan('dev')); // middleware: logging routes
app.use(bodyParser.json()); // middleware: json parsing

app.use(helmet()); // set headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, x-auth-token,X-Requested-With, Content-Type, Accept, db'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.use('/auth', authRouter);

// error handaling if router not exists

app.use((req, res, next) => {
  const error = new Error('Not found!');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message,
    },
  });
});

// Server Setup
const port = 3000; // setup port #
const server = http.createServer(app); // create server on + port routed to app
server.listen(port); // server listening on port
console.log('Server listening on:' + port); // show server is running in console
