const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('New user connected');

  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to the chat app'
  });
  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'A new user has joined'
  });

  socket.emit('newMessage', {
    from: 'me',
    text: 'Some text',
    createAt: new Date().getTime()
  });

  socket.on('createMessage', (data) => {
    console.log('A new message was created', data);
    data.createdAt = new Date().getTime();

    // Emits message to everyone
    // io.emit('newMessage', data);

    // Emits message to everyone except sender
    socket.broadcast.emit('newMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('Client was disconnected');
  })
});

module.exports = {
  app,
  server
};
