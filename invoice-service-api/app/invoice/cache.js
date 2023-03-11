const redis = require('redis');

const connectToClient = async () => {
  const redisClient = redis.createClient({
    url: process.env.REDIS_CONNECTION_STRING,
  });
  await redisClient.connect();

  return redisClient;
};

const getInvoiceDetail = async (id) => {
  let client = await connectToClient();
  return await client.get(`invoice_${id}`);
};

const setInvoiceDetail = async (id, data) => {
  let client = await connectToClient();
  return await client.set(`invoice_${id}`, JSON.stringify(data), 'EX', 60);
};

const deleteInvoiceDetail = async (id) => {
  let client = await connectToClient();
  return await client.del(`invoice_${id}`);
};

module.exports = { getInvoiceDetail, setInvoiceDetail, deleteInvoiceDetail };
