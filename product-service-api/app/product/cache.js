const redis = require('redis');

const connectToClient = async () => {
  const redisClient = redis.createClient({
    url: process.env.REDIS_CONNECTION_STRING,
  });
  await redisClient.connect();

  return redisClient;
};

const getProductDetail = async (id) => {
  let client = await connectToClient();
  return await client.get(`product_${id}`);
};

const setProductDetail = async (id, data) => {
  let client = await connectToClient();
  return await client.set(`product_${id}`, JSON.stringify(data), 'EX', 60);
};

const deleteProductDetail = async (id) => {
  let client = await connectToClient();
  return await client.del(`product_${id}`);
};

module.exports = { getProductDetail, setProductDetail, deleteProductDetail };
