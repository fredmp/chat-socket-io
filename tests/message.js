const expect = require('expect');

const { newMessage } = require('../src/utils/message');

describe('newMessage', () => {
  it('generates a message object with a createdAt attribute', () => {
    const message = newMessage('Me', 'Some text');

    expect(typeof message.createdAt === 'number').toBeTruthy();
    expect(message.from).toBe('Me');
    expect(message.text).toBe('Some text');
  });
});
