const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

module.exports = {
  rootPath: path.resolve(__dirname, '..'),
  nodeEnv: process.env.NODE_ENV,
  rabbitMqConnString: process.env.RABBITMQ_CONNECTION_STRING,
  invoiceServiceApi: process.env.INVOICE_SERVICE_API,
  poServiceApi: process.env.PO_SERVICE_API,
};
