const nodemailer = require('nodemailer');
const express = require('express');
const morgan = require('morgan');

const http = require('http');
const cors = require('cors');

const app = express();
require('dotenv/config');
const port = process.env.APP_PORT || '3000';

app.set('port', port);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(require('./routes'))

const server = http.createServer(app);

server.listen(port, function() {
  console.info('Server listening on port', server.address().port);
});
