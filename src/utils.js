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
