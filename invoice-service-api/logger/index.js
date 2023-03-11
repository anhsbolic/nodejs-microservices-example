const config = require('../config');

const info = (message) => {
  if (config.nodeEnv === 'development') {
    console.log(message);
  } else {
    // use logger like logstash, etc
  }
};

module.exports = { info };
