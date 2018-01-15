const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { newMessage } = require('./utils/message');

const publicPath = path.join(__dirname, '../public');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('New user connected');

  socket.emit('newMessage', newMessage('Admin', 'Welcome to the chat app'));

  socket.broadcast.emit('newMessage', newMessage('Admin', 'A new user has joined'));

  socket.on('createMessage', (data, callback) => {
    console.log('A new message was created', data);
    data.createdAt = new Date().getTime();

    io.emit('newMessage', data);

    if (callback) {
      callback('Got it!');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client was disconnected');
  })
});

module.exports = {
  app,
  server
};
