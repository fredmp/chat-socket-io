const moment = require('moment');

module.exports.newMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf()
  }
};

module.exports.newLocation = (from, latitude, longitude) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: moment().valueOf()
  }
};

module.exports.validString = (text) => {
  return typeof text === 'string' && text.trim().length > 0;
};

module.exports.hyphenize = (text) => {
  text = (text || '').toString().toLowerCase();
  text = text.split(/\&+/).join("and");
  return text.split(/[^a-z0-9]/).join("-");
}
