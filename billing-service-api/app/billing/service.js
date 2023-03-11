const axios = require('axios');
const moment = require('moment');
const Joi = require('joi');
const config = require('../../config');
const error = require('../../helper/error');
const rabbitmq = require('../../helper/rabbitmq');
const billingCache = require('./cache');
const billingHelper = require('./helper');
const billingRepository = require('./repository');

/**
 * Get List of Billing with Filter & Pagination
 * @param {Object} query values for filtering needs
 */
const index = async (query) => {
  let billings = await billingRepository.list(query);

  return billings;
};

/**
 * Create New Billing
 * @param {Object} data all data required to create a billing
 */
const create = async (data) => {
  // data validation
  let validationSchema = Joi.object({
    po_id: Joi.string().required(),
    billing_date: Joi.date().required(),
    due_date: Joi.date().min(Joi.ref('billing_date')).required(),
    auto_create_invoice: Joi.boolean().default(false),
  });

  try {
    await validationSchema.validateAsync(data);
  } catch (err) {
    error.throwBadRequest(err.details[0]?.message);
  }

  // get purchase order
  let purchaseOrder;
  let poResponse = await axios.get(
    `${config.poServiceApi}/purchase-order/${data.po_id}`
  );
  if (poResponse && poResponse.data && poResponse.data.success) {
    purchaseOrder = poResponse.data.data;
  }
  if (!purchaseOrder) {
    error.throwBadRequest('Invalid Purchase Order');
  }

  // find created billing with po number
  let foundBilling = await billingRepository.findByPoId(purchaseOrder._id);
  if (foundBilling) {
    // can't create new billing if po billed and billing was not cancelled
    if (foundBilling.status !== 'cancelled') {
      error.throwBadRequest(
        'Purchase order was billed and Billing still active'
      );
    }
  }

  // generate billing number
  let billingNumber = billingHelper.generateBillingNumber();

  // billing item from PO
  let product = purchaseOrder.product;
  let billingItem = {
    name: product.name,
    description: product.description,
    price: product.price,
    quantity: purchaseOrder.quantity,
  };

  // calculate total
  let subtotal = purchaseOrder.quantity * product.price;
  let tax = 0.1 * subtotal;
  let total = subtotal + tax;

  // create
  let billing = {
    purchase_order: purchaseOrder._id,
    billing_number: billingNumber,
    billing_date: data.billing_date,
    due_date: data.due_date,
    item: billingItem,
    subtotal: subtotal,
    tax: tax,
    total: total,
    flag_invoiced: false,
    status: 'unpaid',
  };

  let createdBilling = await billingRepository.create(billing);
  if (!createdBilling) {
    error.throwInternalServerError('Create Billing Fail');
  }

  // update status po to billed
  let poUpdated = false;
  let updatePoData = { status: 'billed' };
  let updatePoResponse = await axios.post(
    `${config.poServiceApi}/purchase-order/${data.po_id}/status`,
    updatePoData
  );
  if (
    updatePoResponse &&
    updatePoResponse.data &&
    updatePoResponse.data.success
  ) {
    poUpdated = true;
  }
  if (!poUpdated) {
    await billingRepository.deleteOne(createdBilling._id);
    error.throwInternalServerError('Create Billing Fail');
  }

  // create invoice when auto_create_invoice flag true
  // if (data.auto_create_invoice && data.auto_create_invoice === true) {
  //   let createInvoiceData = {
  //     billing_id: createdBilling._id.toString(),
  //     invoice_date: moment().utc().format('YYYY-MM-DD'),
  //   };
  //   await axios.post(`${config.invoiceServiceApi}/invoice`, createInvoiceData);
  // }

  // create invoice when auto_create_invoice flag true
  if (data.auto_create_invoice && data.auto_create_invoice === true) {
    // publish created billing to rabbitmq
    // - invoice will consume, then create new invoice from this billing
    let msgData = {
      billing_id: createdBilling._id.toString(),
      invoice_date: moment().utc().format('YYYY-MM-DD'),
    };

    await rabbitmq.publish(rabbitmq.BILLING_CREATE_QUEUE, msgData);
  }

  // result
  return createdBilling;
};

/**
 * Get Detail of Billing
 * @param {String} id billing id
 */
const detail = async (id) => {
  // data from redis cache when available
  let redisData = await billingCache.getBillingDetail(id);
  if (redisData) {
    let billing = JSON.parse(redisData);
    return billing;
  }

  // data from db when unavaliable at redis cache
  let billing = await billingRepository.findById(id);
  if (!billing) {
    error.throwNotFound();
  }

  // store data to redis cache
  await billingCache.setBillingDetail(id, billing);

  // result
  return billing;
};

/**
 * Update Billing Data
 * @param {String} id billing id
 * @param {Object} data all data required to create a billing
 */
const update = async (id, data) => {
  let billing = await billingRepository.findById(id);
  if (!billing) {
    error.throwNotFound();
  }

  // data validation
  let validationSchema = Joi.object({
    billing_date: Joi.date().required(),
    due_date: Joi.date().min(Joi.ref('billing_date')).required(),
  });

  try {
    await validationSchema.validateAsync(data);
  } catch (err) {
    error.throwBadRequest(err.details[0]?.message);
  }

  // only unpaid billing can be update
  if (billing.status !== 'unpaid') {
    error.throwBadRequest('Only Unpaid Billing can be update');
  }

  // data
  let updatedData = {
    billing_date: data.billing_date,
    due_date: data.due_date,
  };

  // update
  let updatedBilling = await billingRepository.update(billing._id, updatedData);
  if (!updatedBilling) {
    error.throwInternalServerError('Update Billing Fail');
  }

  // delete data from redis cache
  await billingCache.deleteBillingDetail(id);

  // result
  return updatedBilling;
};

/**
 * Delete Billing
 * @param {String} id billing id
 */
const deleteOne = async (id) => {
  let billing = await billingRepository.findById(id);
  if (!billing) {
    error.throwNotFound();
  }

  let deletedBilling = await billingRepository.deleteOne(billing._id);
  if (!deletedBilling) {
    error.throwInternalServerError('Delete Billing Fail');
  }

  // delete data from redis cache
  await billingCache.deleteBillingDetail(id);

  return true;
};

/**
 * Pay Billing
 * @param {String} id billing id
 * @param {Object} data all data required to create a billing
 */
const payBilling = async (id, data) => {
  let billing = await billingRepository.findById(id);
  if (!billing) {
    error.throwNotFound();
  }

  // only unpaid billing can be paid
  if (billing.status !== 'unpaid') {
    error.throwBadRequest('Only Unpaid Billing can be paid');
  }

  // data
  let updatedData = {
    paid_date: moment().utc(),
    status: 'paid',
  };

  // update
  let updatedBilling = await billingRepository.update(billing._id, updatedData);
  if (!updatedBilling) {
    error.throwInternalServerError('Update Billing Fail');
  }

  // delete data from redis cache
  await billingCache.deleteBillingDetail(id);

  // result
  return updatedBilling;
};

/**
 * Cancel Billing
 * @param {String} id billing id
 * @param {Object} data all data required to create a billing
 */
const cancelBilling = async (id, data) => {
  let billing = await billingRepository.findById(id);
  if (!billing) {
    error.throwNotFound();
  }

  // only unpaid billing can be cancel
  if (billing.status !== 'unpaid') {
    error.throwBadRequest('Only Unpaid Billing can be cancel');
  }

  // data
  let updatedData = {
    cancelled_date: moment().utc(),
    status: 'cancelled',
  };

  // update
  let updatedBilling = await billingRepository.update(billing._id, updatedData);
  if (!updatedBilling) {
    error.throwInternalServerError('Update Billing Fail');
  }

  // delete data from redis cache
  await billingCache.deleteBillingDetail(id);

  // result
  return updatedBilling;
};

/**
 * Invoiced Billing
 * @param {String} id billing id
 * @param {Object} data all data required to create a billing
 */
const invoicedBilling = async (id, data) => {
  let billing = await billingRepository.findById(id);
  if (!billing) {
    error.throwNotFound();
  }

  // data
  let updatedData = {
    flag_invoiced: true,
  };

  // update
  let updatedBilling = await billingRepository.update(billing._id, updatedData);
  if (!updatedBilling) {
    error.throwInternalServerError('Update Billing Fail');
  }

  // delete data from redis cache
  await billingCache.deleteBillingDetail(id);

  // result
  return updatedBilling;
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
