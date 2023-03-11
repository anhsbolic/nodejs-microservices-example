const axios = require('axios');
const Joi = require('joi');
const config = require('../../config');
const error = require('../../helper/error');
const purchaseOrderCache = require('./cache');
const purchaseOrderHelper = require('./helper');
const purchaseOrderRepository = require('./repository');

/**
 * Get List of PurchaseOrder with Filter & Pagination
 * @param {Object} query values for filtering needs
 */
const index = async (query) => {
  let purchaseOrders = await purchaseOrderRepository.list(query);

  return purchaseOrders;
};

/**
 * Create New Purchase Order
 * @param {Object} data all data required to create a purchaseOrder
 */
const create = async (data) => {
  // data validation
  let validationSchema = Joi.object({
    po_date: Joi.date().required(),
    product_id: Joi.string().required(),
    quantity: Joi.number().required().min(0),
  });

  try {
    await validationSchema.validateAsync(data);
  } catch (err) {
    error.throwBadRequest(err.details[0]?.message);
  }

  // get product
  let product;
  let productResponse = await axios.get(
    `${config.productServiceApi}/product/${data.product_id}`
  );
  if (productResponse && productResponse.data && productResponse.data.success) {
    product = productResponse.data.data;
  }
  if (!product) {
    error.throwBadRequest('Invalid Product');
  }

  // generate po number
  let poNumber = purchaseOrderHelper.generatePoNumber();

  // create
  let purchaseOrder = {
    po_number: poNumber,
    po_date: data.po_date,
    product: {
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
    },
    quantity: data.quantity,
    status: 'unbilled',
  };

  let createdPurchaseOrder = await purchaseOrderRepository.create(
    purchaseOrder
  );
  if (!createdPurchaseOrder) {
    error.throwInternalServerError('Create Purchase Order Fail');
  }

  return createdPurchaseOrder;
};

/**
 * Get Detail of Purchase Order
 * @param {String} id Purchase Order id
 */
const detail = async (id) => {
  // data from redis cache when available
  let redisData = await purchaseOrderCache.getPurchaseOrderDetail(id);
  if (redisData) {
    let purchaseOrder = JSON.parse(redisData);
    return purchaseOrder;
  }

  // data from db when unavaliable at redis cache
  let purchaseOrder = await purchaseOrderRepository.findById(id);
  if (!purchaseOrder) {
    error.throwNotFound();
  }

  // store data to redis cache
  await purchaseOrderCache.setPurchaseOrderDetail(id, purchaseOrder);

  // result
  return purchaseOrder;
};

/**
 * Update PurchaseOrder Data
 * @param {String} id purchaseOrder id
 * @param {Object} data all data required to create a purchaseOrder
 */
const update = async (id, data) => {
  let purchaseOrder = await purchaseOrderRepository.findById(id);
  if (!purchaseOrder) {
    error.throwNotFound();
  }

  // data validation
  let validationSchema = Joi.object({
    po_date: Joi.date().required(),
    quantity: Joi.number().required().min(0),
  });

  try {
    await validationSchema.validateAsync(data);
  } catch (err) {
    error.throwBadRequest(err.details[0]?.message);
  }

  // only unbilled purchase order can be update
  if (purchaseOrder.status !== 'unbilled') {
    error.throwBadRequest('Only Unbilled PO can be update');
  }

  // data
  let updatedData = {
    po_date: data.po_date,
    quantity: data.quantity,
  };

  // update
  let updatedPurchaseOrder = await purchaseOrderRepository.update(
    purchaseOrder._id,
    updatedData
  );
  if (!updatedPurchaseOrder) {
    error.throwInternalServerError('Update Purchase Order Fail');
  }

  // delete data from redis cache
  await purchaseOrderCache.deletePurchaseOrderDetail(id);

  // result
  return updatedPurchaseOrder;
};

/**
 * Delete PurchaseOrder
 * @param {String} id purchaseOrder id
 */
const deleteOne = async (id) => {
  let purchaseOrder = await purchaseOrderRepository.findById(id);
  if (!purchaseOrder) {
    error.throwNotFound();
  }

  let deletedPurchaseOrder = await purchaseOrderRepository.deleteOne(
    purchaseOrder._id
  );
  if (!deletedPurchaseOrder) {
    error.throwInternalServerError('Delete Purchase Order Fail');
  }

  // delete data from redis cache
  await purchaseOrderCache.deletePurchaseOrderDetail(id);

  return true;
};

/**
 * Update Status PurchaseOrder Data
 * @param {String} id purchaseOrder id
 * @param {Object} data all data required to create a purchaseOrder
 */
const updateStatus = async (id, data) => {
  let purchaseOrder = await purchaseOrderRepository.findById(id);
  if (!purchaseOrder) {
    error.throwNotFound();
  }

  // data validation
  let validationSchema = Joi.object({
    status: Joi.date().required().valid('unbilled', 'billed'),
  });

  try {
    await validationSchema.validateAsync(data);
  } catch (err) {
    error.throwBadRequest(err.details[0]?.message);
  }

  // data
  let updatedData = {
    status: data.status,
  };

  // update
  let updatedPurchaseOrder = await purchaseOrderRepository.update(
    purchaseOrder._id,
    updatedData
  );
  if (!updatedPurchaseOrder) {
    error.throwInternalServerError('Update Purchase Order Fail');
  }

  // delete data from redis cache
  await purchaseOrderCache.deletePurchaseOrderDetail(id);

  // result
  return updatedPurchaseOrder;
};

module.exports = {
  index,
  create,
  detail,
  update,
  deleteOne,
  updateStatus,
};
