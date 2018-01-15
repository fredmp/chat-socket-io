const expect = require('expect');

const { newMessage, newLocation } = require('../src/utils');

describe('newMessage', () => {
  it('generates a message object', () => {
    const message = newMessage('Me', 'Some text');

    expect(typeof message.createdAt === 'number').toBeTruthy();
    expect(message.from).toBe('Me');
    expect(message.text).toBe('Some text');
  });
});

describe('newLocation', () => {
  it('generates a location object', () => {
    const message = newLocation('Me', -14.8519133, -48.03985);

    expect(typeof message.createdAt === 'number').toBeTruthy();
    expect(message.from).toBe('Me');
    expect(message.url).toBe('https://www.google.com/maps?q=-14.8519133,-48.03985');
  });
});
