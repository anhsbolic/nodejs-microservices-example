const { PurchaseOrder } = require('./model');
const utils = require('../../utils');

const list = async (query) => {
  const { page, limit, status, product, search, sort_by } = query;

  // init aggregate pipelines
  let pipelines = [];

  // init filters
  let filters = [{}];

  // filter : status
  if (status && status !== '') {
    filters.push({ status: status });
  }

  // filter : product by id
  if (product && product !== '') {
    let productId = await utils.toMongoObjId(product);
    filters.push({ 'product._id': productId });
  }

  // filter : search
  if (search && search !== '') {
    filters.push({ po_number: search });
  }

  // filters
  pipelines.push({ $match: { $and: filters } });

  // sort
  if (sort_by && sort_by !== '') {
    let sort = { createdAt: 1 };
    if (sort_by === 'created_at_asc') {
      sort = { createdAt: 1 };
    } else if (sort_by === 'created_at_desc') {
      sort = { createdAt: -1 };
    } else if (sort_by === 'po_date_asc') {
      sort = { po_date: 1 };
    } else if (sort_by === 'po_date_desc') {
      sort = { po_date: -1 };
    } else if (sort_by === 'product_asc') {
      sort = { 'product.name': 1 };
    } else if (sort_by === 'product_desc') {
      sort = { 'product.name': -1 };
    }

    pipelines.push({ $sort: sort });
  }

  // unset fields
  let unset = { $unset: ['__v'] };
  pipelines.push(unset);

  // pagination
  let pageVal = page ? parseInt(page) : 0;
  let limitVal = limit ? parseInt(limit) : 0;
  if (pageVal > 0 && limitVal > 0) {
    let skip = (pageVal - 1) * limitVal;
    pipelines.push({ $limit: skip + limitVal }, { $skip: skip });
  }

  // result
  return await PurchaseOrder.aggregate(pipelines);
};

const findById = async (id) => {
  return await PurchaseOrder.findOne({ _id: id }).select('-__v').lean();
};

const create = async (data) => {
  let purchaseOrder = new PurchaseOrder(data);
  return await purchaseOrder.save();
};

const update = async (id, data) => {
  return await PurchaseOrder.findOneAndUpdate({ _id: id }, data, {
    returnOriginal: false,
  })
    .select('-__v')
    .lean();
};

const deleteOne = async (id) => {
  return await PurchaseOrder.deleteOne({ _id: id });
};

module.exports = { list, findById, create, update, deleteOne };
