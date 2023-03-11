const logger = require('../../logger');
const respond = require('../../helper/respond');
const billingService = require('./service');

/**
 * Billing API : List of Billing
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const index = async (req, res) => {
  try {
    const result = await billingService.index(req.query);
    return respond.responseSuccess(res, 'List of Billing', result);
  } catch (e) {
    logger.info(e);
    return respond.responseError(res, e.statusCode, e.message);
  }
};

/**
 * Billing API : Create New Billing
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const create = async (req, res) => {
  try {
    const result = await billingService.create(req.body);
    return respond.responseSuccess(res, 'Billing Created', result);
  } catch (e) {
    logger.info(e);
    return respond.responseError(res, e.statusCode, e.message);
  }
};

/**
 * Billing API : Detail of Billing
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const detail = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await billingService.detail(id);
    return respond.responseSuccess(res, 'Billing Detail', result);
  } catch (e) {
    logger.info(e);
    return respond.responseError(res, e.statusCode, e.message);
  }
};

/**
 * Billing API : Update Billing
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const update = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await billingService.update(id, req.body);
    return respond.responseSuccess(res, 'Billing Updated', result);
  } catch (e) {
    logger.info(e);
    return respond.responseError(res, e.statusCode, e.message);
  }
};

/**
 * Billing API : Delete Billing
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await billingService.deleteOne(id);
    return respond.responseSuccess(res, 'Billing Deleted');
  } catch (e) {
    logger.info(e);
    return respond.responseError(res, e.statusCode, e.message);
  }
};

/**
 * Billing API : Pay Billing
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const payBilling = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await billingService.payBilling(id, req.body);
    return respond.responseSuccess(res, 'Billing Paid', result);
  } catch (e) {
    logger.info(e);
    return respond.responseError(res, e.statusCode, e.message);
  }
};

/**
 * Billing API : Cancel Billing
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const cancelBilling = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await billingService.cancelBilling(id, req.body);
    return respond.responseSuccess(res, 'Billing Cancelled', result);
  } catch (e) {
    logger.info(e);
    return respond.responseError(res, e.statusCode, e.message);
  }
};

/**
 * Billing API : Invoiced Billing
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const invoicedBilling = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await billingService.invoicedBilling(id, req.body);
    return respond.responseSuccess(res, 'Billing Invoiced', result);
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
  payBilling,
  cancelBilling,
  invoicedBilling,
};
