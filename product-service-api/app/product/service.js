const Joi = require('joi');
const error = require('../../helper/error');
const productCache = require('./cache');
const productRepository = require('./repository');

/**
 * Get List of Product with Filter & Pagination
 * @param {Object} query values for filtering needs
 */
const index = async (query) => {
  let products = await productRepository.list(query);

  return products;
};

/**
 * Create New Product
 * @param {Object} data all data required to create a product
 */
const create = async (data) => {
  // data validation
  let validationSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(null, ''),
    price: Joi.number().required().min(0),
  });

  try {
    await validationSchema.validateAsync(data);
  } catch (err) {
    error.throwBadRequest(err.details[0]?.message);
  }

  // create
  let product = {
    name: data.name,
    description: data.description,
    price: data.price,
  };

  let createdProduct = await productRepository.create(product);
  if (!createdProduct) {
    error.throwInternalServerError('Create Product Fail');
  }

  return createdProduct;
};

/**
 * Get Detail of Product
 * @param {String} id product id
 */
const detail = async (id) => {
  // data from redis cache when available
  let redisData = await productCache.getProductDetail(id);
  if (redisData) {
    let product = JSON.parse(redisData);
    return product;
  }

  // data from db when unavaliable at redis cache
  let product = await productRepository.findById(id);
  if (!product) {
    error.throwNotFound();
  }

  // store data to redis cache
  await productCache.setProductDetail(id, product);

  // result
  return product;
};

/**
 * Update Product Data
 * @param {String} id product id
 * @param {Object} data all data required to create a product
 */
const update = async (id, data) => {
  let product = await productRepository.findById(id);
  if (!product) {
    error.throwNotFound();
  }

  // data validation
  let validationSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(null, ''),
    price: Joi.number().required().min(0),
  });

  try {
    await validationSchema.validateAsync(data);
  } catch (err) {
    error.throwBadRequest(err.details[0]?.message);
  }

  // data
  let updatedData = {
    name: data.name,
    description: data.description,
    price: data.price,
  };

  // update
  let updatedProduct = await productRepository.update(product._id, updatedData);
  if (!updatedProduct) {
    error.throwInternalServerError('Update Product Fail');
  }

  // delete data from redis cache
  await productCache.deleteProductDetail(id);

  // result
  return updatedProduct;
};

/**
 * Delete Product
 * @param {String} id product id
 */
const deleteOne = async (id) => {
  let product = await productRepository.findById(id);
  if (!product) {
    error.throwNotFound();
  }

  let deletedProduct = await productRepository.deleteOne(product._id);
  if (!deletedProduct) {
    error.throwInternalServerError('Delete Product Fail');
  }

  // delete data from redis cache
  await productCache.deleteProductDetail(id);

  return true;
};

module.exports = {
  index,
  create,
  detail,
  update,
  deleteOne,
};
