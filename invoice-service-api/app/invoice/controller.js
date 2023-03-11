const logger = require('../../logger');
const respond = require('../../helper/respond');
const invoiceService = require('./service');

/**
 * Invoice API : List of Invoice
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const index = async (req, res) => {
  try {
    const result = await invoiceService.index(req.query);
    return respond.responseSuccess(res, 'List of Invoice', result);
  } catch (e) {
    logger.info(e);
    return respond.responseError(res, e.statusCode, e.message);
  }
};

/**
 * Invoice API : Create New Invoice
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const create = async (req, res) => {
  try {
    const result = await invoiceService.create(req.body);
    return respond.responseSuccess(res, 'Invoice Created', result);
  } catch (e) {
    logger.info(e);
    return respond.responseError(res, e.statusCode, e.message);
  }
};

/**
 * Invoice API : Detail of Invoice
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const detail = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await invoiceService.detail(id);
    return respond.responseSuccess(res, 'Invoice Detail', result);
  } catch (e) {
    logger.info(e);
    return respond.responseError(res, e.statusCode, e.message);
  }
};

/**
 * Invoice API : Update Invoice
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const update = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await invoiceService.update(id, req.body);
    return respond.responseSuccess(res, 'Invoice Updated', result);
  } catch (e) {
    logger.info(e);
    return respond.responseError(res, e.statusCode, e.message);
  }
};

/**
 * Invoice API : Delete Invoice
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await invoiceService.deleteOne(id);
    return respond.responseSuccess(res, 'Invoice Deleted');
  } catch (e) {
    logger.info(e);
    return respond.responseError(res, e.statusCode, e.message);
  }
};

/**
 * Invoice API : Approve Invoice
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const approveInvoice = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await invoiceService.approveInvoice(id, req.body);
    return respond.responseSuccess(res, 'Invoice Approved', result);
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
  approveInvoice,
};
