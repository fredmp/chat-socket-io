const { hyphenize } = require('./utils');

class Users {
  constructor () {
    this.users = [];
  }

  add (id, name, room) {
    const user = {
      id,
      name,
      room: {
        id: hyphenize(room),
        name: room
      }
    };
    this.users.push(user);
    return user;
  }

  remove (id) {
    const user = this.findById(id);
    this.users = this.users.filter(user => user.id !== id);
    return user;
  }

  findById (id) {
    return this.users.find(user => user.id === id);
  }

  findByNameAndRoom (name, room) {
    return this.users.find(
      user => user.room.id === hyphenize(room) && user.name.toLowerCase() === (name || '').toLowerCase()
    );
  }

  findByRoom (room) {
    return this.users.filter(user => user.room.id === hyphenize(room));
  }

  getUserNameListByRoom (room) {
    return this.findByRoom(room).map(user => user.name);
  }

  getRooms () {
    return this.users.reduce((acc, user) => {
      if (!acc.find(room => room.id === user.room.id)) {
        acc.push(user.room);
      }
      return acc;
    }, []);
  }

  all () {
    return this.users;
  }
}

module.exports = Users;
