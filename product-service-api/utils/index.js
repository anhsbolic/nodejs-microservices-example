const mongoose = require('mongoose');

const toMongoObjId = async (string) => {
  return await mongoose.Types.ObjectId(string);
};

module.exports = { toMongoObjId };
