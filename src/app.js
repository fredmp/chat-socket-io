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
      return callback('Name and room are required.');
    }
    if (users.findByNameAndRoom(data.name, data.room)) {
      return callback('User name already in use. Please choose another one.');
    }

    users.remove(socket.id);
    const user = users.add(socket.id, data.name, data.room);

    socket.join(user.room.id);

    io.to(user.room.id).emit('updateUserList', users.getUserNameListByRoom(user.room.name));
    // Emit to all users:
    //    io.emit -> io.to(room).emit
    // Emit to all users except sender:
    //    socket.broadcast.emit -> socket.broadcast.to(room).emit
    // Leave specific room:
    //    socket.leave(room)
    // Emit to specific user:
    //    socket.emit

    socket.emit('newMessage', newMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(user.room.id).emit(
      'newMessage',
      newMessage('Admin', `${user.name} has joined`)
    );

    callback();
  });

  socket.on('getRooms', (callback) => {
    if (callback) callback(users.getRooms());
  });

  socket.on('createMessage', (data, callback) => {
    const user = users.findById(socket.id);

    if (user && validString(data.text)) {
      io.to(user.room.id).emit('newMessage', newMessage(user.name, data.text));
    }
    if (callback) callback();
  });

  socket.on('createLocation', (data, callback) => {
    const user = users.findById(socket.id);

    if (user) {
      io.to(user.room.id).emit('newLocation', newLocation(user.name, data.latitude, data.longitude));
    }
    if (callback) callback();
  });

  socket.on('disconnect', () => {
    const user = users.remove(socket.id);
    if (user) {
      io.to(user.room.id).emit('updateUserList', users.getUserNameListByRoom(user.room.name));
      io.to(user.room.id).emit('newMessage', newMessage('Admin', `${user.name} has left`));
    }
    console.log('Client was disconnected');
  })
});

module.exports = {
  app,
  server
};
