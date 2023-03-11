const redis = require('redis');

const connectToClient = async () => {
  const redisClient = redis.createClient({
    url: process.env.REDIS_CONNECTION_STRING,
  });
  await redisClient.connect();

  return redisClient;
};

const getBillingDetail = async (id) => {
  let client = await connectToClient();
  return await client.get(`billing_${id}`);
};

const setBillingDetail = async (id, data) => {
  let client = await connectToClient();
  return await client.set(`billing_${id}`, JSON.stringify(data), 'EX', 60);
};

const deleteBillingDetail = async (id) => {
  let client = await connectToClient();
  return await client.del(`billing_${id}`);
};

module.exports = { getBillingDetail, setBillingDetail, deleteBillingDetail };
