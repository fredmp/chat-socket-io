const expect = require('expect');
const Users = require('../src/users');

describe('Users', () => {

  const users = new Users();
  const user1 = { id: 1, name: 'Name 1', room: { id: 'room-1', name: 'Room 1' } };
  const user2 = { id: 2, name: 'Name 2', room: { id: 'room-1', name: 'Room 1' } };
  const user3 = { id: 3, name: 'Name 3', room: { id: 'room-2', name: 'Room 2' } };

  beforeEach(() => {
    const list = users.all();
    list.length = 0;
    list.push(user1);
    list.push(user2);
    list.push(user3);
  });

  it('adds new user', () => {
    expect(users.add(4, 'Name 4', 'Room 1')).toMatchObject(
      { id: 4, name: 'Name 4', room: { id: 'room-1', name: 'Room 1' } }
    );
    expect(users.all().length).toBe(4);
  });

  it('removes existing user', () => {
    expect(users.all().length).toBe(3);
    const user = users.remove(1);
    expect(user).toMatchObject(user1);
    expect(users.all().length).toBe(2);
  });

  it('finds a user by id', () => {
    expect(users.findById(1)).toMatchObject(user1);
    expect(users.findById(8)).not.toBeDefined();
  });

  it('finds a user by name and room', () => {
    expect(users.findByNameAndRoom('Name 3', 'Room 2')).toMatchObject(user3);
    expect(users.findByNameAndRoom('Name 2', 'Room 2')).not.toBeDefined();
    expect(users.findByNameAndRoom('Name 8', 'Room 1')).not.toBeDefined();
  });

  it('finds users by room', () => {
    expect(users.findByRoom('Room 1')).toMatchObject([user1, user2]);
  });

  it('returns user names by room', () => {
    expect(users.getUserNameListByRoom('Room 1')).toMatchObject(['Name 1', 'Name 2']);
  });

  it('returns all rooms', () => {
    expect(users.getRooms()).toMatchObject([
      { "id": "room-1", "name": "Room 1" },
      { "id": "room-2", "name": "Room 2" }
    ]);
  });

  it('returns all users', () => {
    expect(users.all().length).toBe(3);
  });
});
