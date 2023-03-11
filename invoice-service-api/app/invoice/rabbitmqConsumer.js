const invoiceService = require('./service');

const BILLING_CREATE_QUEUE = 'billingCreateQueue';

const runConsumers = async (connection) => {
  createdBilling(connection, BILLING_CREATE_QUEUE);
};

const createdBilling = async (connection, queueName) => {
  const channel = await connection.createChannel();
  const result = await channel.assertQueue(queueName);

  channel.consume(queueName, async (message) => {
    console.log('Message consume with data: ' + message.content);

    // create new invoice from created billing
    const data = JSON.parse(message.content);
    await invoiceService.create(data);

    channel.ack(message);
    console.log("Job's done : Create new Invoice from Created Billing");
  });
  return result;
};

module.exports = { runConsumers };
