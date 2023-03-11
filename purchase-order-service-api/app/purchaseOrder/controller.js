const logger = require('../../logger');
const respond = require('../../helper/respond');
const purchaseOrderService = require('./service');

/**
 * PurchaseOrder API : List of Purchase Order
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const index = async (req, res) => {
  try {
    const result = await purchaseOrderService.index(req.query);
    return respond.responseSuccess(res, 'List of Purchase Order', result);
  } catch (e) {
    logger.info(e);
    return respond.responseError(res, e.statusCode, e.message);
  }
};

/**
 * PurchaseOrder API : Create New Purchase Order
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const create = async (req, res) => {
  try {
    const result = await purchaseOrderService.create(req.body);
    return respond.responseSuccess(res, 'Purchase Order Created', result);
  } catch (e) {
    logger.info(e);
    return respond.responseError(res, e.statusCode, e.message);
  }
};

/**
 * PurchaseOrder API : Detail of Purchase Order
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const detail = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await purchaseOrderService.detail(id);
    return respond.responseSuccess(res, 'Purchase Order Detail', result);
  } catch (e) {
    logger.info(e);
    return respond.responseError(res, e.statusCode, e.message);
  }
};

/**
 * PurchaseOrder API : Update Purchase Order
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const update = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await purchaseOrderService.update(id, req.body);
    return respond.responseSuccess(res, 'Purchase Order Updated', result);
  } catch (e) {
    logger.info(e);
    return respond.responseError(res, e.statusCode, e.message);
  }
};

/**
 * PurchaseOrder API : Delete Purchase Order
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await purchaseOrderService.deleteOne(id);
    return respond.responseSuccess(res, 'Purchase Order Deleted');
  } catch (e) {
    logger.info(e);
    return respond.responseError(res, e.statusCode, e.message);
  }
};

/**
 * PurchaseOrder API : Update Status Purchase Order
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const updateStatus = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await purchaseOrderService.updateStatus(id, req.body);
    return respond.responseSuccess(
      res,
      'Purchase Order Status Updated',
      result
    );
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
  updateStatus,
};
