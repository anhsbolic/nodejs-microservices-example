const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

module.exports = {
  rootPath: path.resolve(__dirname, '..'),
  nodeEnv: process.env.NODE_ENV,
};
