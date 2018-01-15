class Users {
  constructor () {
    this.users = [];
  }

  add (id, name, room) {
    const user = { id, name, room };
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

  findByRoom (room) {
    return this.users.filter(user => user.room === room);
  }

  getUserNameListByRoom (room) {
    return this.findByRoom(room).map(user => user.name);
  }

  all () {
    return this.users;
  }
}

module.exports = Users;
