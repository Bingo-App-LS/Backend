const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const authRoutes = require('../routes/authRoutes');
const passportSetup = require('./passport');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

const user = require('../routes/users.js')
// const games = require('../routes/games.js')
const login = require('../routes/login')

server.use('/login', login)
server.use('/users', user);
server.use(authRoutes);

// server.use('/games', games);

module.exports = server;