const axios = require('axios');
const moment = require('moment');
const Joi = require('joi');
const config = require('../../config');
const error = require('../../helper/error');
const invoiceCache = require('./cache');
const invoiceHelper = require('./helper');
const invoiceRepository = require('./repository');

/**
 * Get List of Invoice with Filter & Pagination
 * @param {Object} query values for filtering needs
 */
const index = async (query) => {
  let invoices = await invoiceRepository.list(query);

  return invoices;
};

/**
 * Create New Invoice
 * @param {Object} data all data required to create a invoice
 */
const create = async (data) => {
  // data validation
  let validationSchema = Joi.object({
    billing_id: Joi.string().required(),
    invoice_date: Joi.date().required(),
  });

  try {
    await validationSchema.validateAsync(data);
  } catch (err) {
    error.throwBadRequest(err.details[0]?.message);
  }

  // get billing
  let billing;
  let billingResponse = await axios.get(
    `${config.billingServiceApi}/billing/${data.billing_id}`
  );
  if (billingResponse && billingResponse.data && billingResponse.data.success) {
    billing = billingResponse.data.data;
  }
  if (!billing) {
    error.throwBadRequest('Invalid Billing');
  }

  // can't create new invoice for same billing
  let foundInvoice = await invoiceRepository.findByBillingId(billing._id);
  if (foundInvoice) {
    error.throwBadRequest('Billing was Invoiced');
  }

  // generate invoice number
  let invoiceNumber = invoiceHelper.generateInvoiceNumber();

  // create
  let invoice = {
    billing: billing._id,
    invoice_number: invoiceNumber,
    invoice_date: data.invoice_date,
    status: 'created',
  };

  let createdInvoice = await invoiceRepository.create(invoice);
  if (!createdInvoice) {
    error.throwInternalServerError('Create Invoice Fail');
  }

  // update update invoiced flag on billing
  let billingUpdated = false;
  let updateBillingData = { flag_invoiced: true };
  let updateBillingResponse = await axios.post(
    `${config.billingServiceApi}/billing/${data.billing_id}/invoiced`,
    updateBillingData
  );
  if (
    updateBillingResponse &&
    updateBillingResponse.data &&
    updateBillingResponse.data.success
  ) {
    billingUpdated = true;
  }
  if (!billingUpdated) {
    await invoiceRepository.deleteOne(createdInvoice._id);
    error.throwInternalServerError('Create Invoice Fail');
  }

  // result
  return createdInvoice;
};

/**
 * Get Detail of Invoice
 * @param {String} id invoice id
 */
const detail = async (id) => {
  // data from redis cache when available
  let redisData = await invoiceCache.getInvoiceDetail(id);
  if (redisData) {
    let invoice = JSON.parse(redisData);
    return invoice;
  }

  // data from db when unavaliable at redis cache
  let invoice = await invoiceRepository.findById(id);
  if (!invoice) {
    error.throwNotFound();
  }

  // store data to redis cache
  await invoiceCache.setInvoiceDetail(id, invoice);

  // result
  return invoice;
};

/**
 * Update Invoice Data
 * @param {String} id invoice id
 * @param {Object} data all data required to create a invoice
 */
const update = async (id, data) => {
  let invoice = await invoiceRepository.findById(id);
  if (!invoice) {
    error.throwNotFound();
  }

  // data validation
  let validationSchema = Joi.object({
    invoice_date: Joi.date().required(),
  });

  try {
    await validationSchema.validateAsync(data);
  } catch (err) {
    error.throwBadRequest(err.details[0]?.message);
  }

  // only unapproved invoice can be update
  if (invoice.status !== 'created') {
    error.throwBadRequest('Only Unapproved Invoice can be update');
  }

  // data
  let updatedData = {
    invoice_date: data.invoice_date,
  };

  // update
  let updatedInvoice = await invoiceRepository.update(invoice._id, updatedData);
  if (!updatedInvoice) {
    error.throwInternalServerError('Update Invoice Fail');
  }

  // delete data from redis cache
  await invoiceCache.deleteInvoiceDetail(id);

  // result
  return updatedInvoice;
};

/**
 * Delete Invoice
 * @param {String} id invoice id
 */
const deleteOne = async (id) => {
  let invoice = await invoiceRepository.findById(id);
  if (!invoice) {
    error.throwNotFound();
  }

  let deletedInvoice = await invoiceRepository.deleteOne(invoice._id);
  if (!deletedInvoice) {
    error.throwInternalServerError('Delete Invoice Fail');
  }

  // delete data from redis cache
  await invoiceCache.deleteInvoiceDetail(id);

  return true;
};

/**
 * Approve Invoice
 * @param {String} id invoice id
 * @param {Object} data all data required to create a invoice
 */
const approveInvoice = async (id, data) => {
  let invoice = await invoiceRepository.findById(id);
  if (!invoice) {
    error.throwNotFound();
  }

  // only unapproved invoice can be paid
  if (invoice.status !== 'created') {
    error.throwBadRequest('Only Unapproved Invoice can be approve');
  }

  // data
  let updatedData = {
    approved_date: moment().utc(),
    status: 'approved',
  };

  // update
  let updatedInvoice = await invoiceRepository.update(invoice._id, updatedData);
  if (!updatedInvoice) {
    error.throwInternalServerError('Update Invoice Fail');
  }

  // delete data from redis cache
  await invoiceCache.deleteInvoiceDetail(id);

  // result
  return updatedInvoice;
};

module.exports = {
  index,
  create,
  detail,
  update,
  deleteOne,
  approveInvoice,
};
