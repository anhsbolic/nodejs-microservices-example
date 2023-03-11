const logger = require('../../logger');
const respond = require('../../helper/respond');
const productService = require('./service');

/**
 * Product API : List of Product
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const index = async (req, res) => {
  try {
    const result = await productService.index(req.query);
    return respond.responseSuccess(res, 'List of Product', result);
  } catch (e) {
    logger.info(e);
    return respond.responseError(res, e.statusCode, e.message);
  }
};

/**
 * Product API : Create New Product
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const create = async (req, res) => {
  try {
    const result = await productService.create(req.body);
    return respond.responseSuccess(res, 'Product Created', result);
  } catch (e) {
    logger.info(e);
    return respond.responseError(res, e.statusCode, e.message);
  }
};

/**
 * Product API : Detail of Product
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const detail = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await productService.detail(id);
    return respond.responseSuccess(res, 'Product Detail', result);
  } catch (e) {
    logger.info(e);
    return respond.responseError(res, e.statusCode, e.message);
  }
};

/**
 * Product API : Update Product
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const update = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await productService.update(id, req.body);
    return respond.responseSuccess(res, 'Product Updated', result);
  } catch (e) {
    logger.info(e);
    return respond.responseError(res, e.statusCode, e.message);
  }
};

/**
 * Product API : Delete Product
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await productService.deleteOne(id);
    return respond.responseSuccess(res, 'Product Deleted');
  } catch (e) {
    logger.info(e);
    return respond.responseError(res, e.statusCode, e.message);
  }
};

module.exports = {
  index,
  create,
  detail,
  update,
  deleteOne,
};
