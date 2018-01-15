const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const Users = require('./users');
const { newMessage, newLocation, validString } = require('./utils');

const publicPath = path.join(__dirname, '../public');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('New user connected');

  socket.on('join', (data, callback) => {
    if (!validString(data.name) || !validString(data.room)) {
      return callback('Name and room are required');
    }

    socket.join(data.room);

    users.remove(socket.id);
    users.add(socket.id, data.name, data.room);

    io.to(data.room).emit('updateUserList', users.getUserNameListByRoom(data.room));
    // Emit to all users:
    //    io.emit -> io.to(room).emit
    // Emit to all users except sender:
    //    socket.broadcast.emit -> socket.broadcast.to(room).emit
    // Leave specific room:
    //    socket.leave(room)
    // Emit to specific user:
    //    socket.emit

    socket.emit('newMessage', newMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(data.room).emit(
      'newMessage',
      newMessage('Admin', `${data.name} has joined`)
    );

    callback();
  });

  socket.on('createMessage', (data, callback) => {
    console.log('A new message was created', data);
    data.createdAt = new Date().getTime();

    io.emit('newMessage', data);

    if (callback) {
      callback('Got it!' + socket.id);
    }
  });

  socket.on('createLocation', (data, callback) => {
    console.log('A new location was created');
    io.emit('newLocation', newLocation('Admin', data.latitude, data.longitude));
  });

  socket.on('disconnect', () => {
    const user = users.remove(socket.id);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserNameListByRoom(user.room));
      io.to(user.room).emit('newMessage', newMessage('Admin', `${user.name} has left`));
    }
    console.log('Client was disconnected');
  })
});

module.exports = {
  app,
  server
};
