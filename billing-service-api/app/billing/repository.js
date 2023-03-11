const { Billing } = require('./model');

const list = async (query) => {
  const { page, limit, status, search, sort_by } = query;

  // init aggregate pipelines
  let pipelines = [];

  // init filters
  let filters = [{}];

  // filter : status
  if (status && status !== '') {
    filters.push({ status: status });
  }

  // filter : search
  if (search && search !== '') {
    filters.push({ billing_number: search });
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
    } else if (sort_by === 'billing_date_asc') {
      sort = { billing_date: 1 };
    } else if (sort_by === 'billing_date_desc') {
      sort = { billing_date: -1 };
    } else if (sort_by === 'due_date_asc') {
      sort = { due_date: 1 };
    } else if (sort_by === 'due_date_desc') {
      sort = { due_date: -1 };
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
  return await Billing.aggregate(pipelines);
};

const findById = async (id) => {
  return await Billing.findOne({ _id: id }).select('-__v').lean();
};

const findByPoId = async (poId) => {
  return await Billing.findOne({ purchase_order: poId })
    .populate('purchase_order')
    .lean();
};

const create = async (data) => {
  let billing = new Billing(data);
  return await billing.save();
};

const update = async (id, data) => {
  return await Billing.findOneAndUpdate({ _id: id }, data, {
    returnOriginal: false,
  })
    .select('-__v')
    .lean();
};

const deleteOne = async (id) => {
  return await Billing.deleteOne({ _id: id });
};

module.exports = { list, findById, findByPoId, create, update, deleteOne };
