const expect = require('expect');

const {
  newMessage,
  newLocation,
  validString,
  hyphenize
} = require('../src/utils');

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

describe('validString', () => {
  it('rejects non string values', () => {
    expect(validString(22)).toBeFalsy();
  });

  it('rejects strings with only spaces', () => {
    expect(validString('    ')).toBeFalsy();
  });

  it('accepts strings with at least 1 non space character', () => {
    expect(validString('A')).toBeTruthy();
  });
});

describe('hyphenize', () => {
  it('formats text separating words with hyphens', () => {
    expect(hyphenize('Room 2')).toBe('room-2');
    expect(hyphenize('Your room & their room')).toBe('your-room-and-their-room');
  });
});
