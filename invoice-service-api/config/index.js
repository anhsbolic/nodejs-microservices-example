const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

module.exports = {
  rootPath: path.resolve(__dirname, '..'),
  nodeEnv: process.env.NODE_ENV,
  rabbitMqConnString: process.env.RABBITMQ_CONNECTION_STRING,
  billingServiceApi: process.env.BILLING_SERVICE_API,
};
