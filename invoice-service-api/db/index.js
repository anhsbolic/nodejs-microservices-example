const mongoose = require('mongoose');

require('../app/invoice/model');

const url = process.env.MONGO_CONNECTION_STRING;
mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const db = mongoose.connection;

module.exports = db;
