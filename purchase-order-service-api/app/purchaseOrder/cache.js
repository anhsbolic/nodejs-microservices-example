const redis = require('redis');

const connectToClient = async () => {
  const redisClient = redis.createClient({
    url: process.env.REDIS_CONNECTION_STRING,
  });
  await redisClient.connect();

  return redisClient;
};

const getPurchaseOrderDetail = async (id) => {
  let client = await connectToClient();
  return await client.get(`po_${id}`);
};

const setPurchaseOrderDetail = async (id, data) => {
  let client = await connectToClient();
  return await client.set(`po_${id}`, JSON.stringify(data), 'EX', 60);
};

const deletePurchaseOrderDetail = async (id) => {
  let client = await connectToClient();
  return await client.del(`po_${id}`);
};

module.exports = {
  getPurchaseOrderDetail,
  setPurchaseOrderDetail,
  deletePurchaseOrderDetail,
};
