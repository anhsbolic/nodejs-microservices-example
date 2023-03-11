const { Invoice } = require('./model');

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
    filters.push({ invoice_number: search });
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
    } else if (sort_by === 'invoice_date_asc') {
      sort = { invoice_date: 1 };
    } else if (sort_by === 'invoice_date_desc') {
      sort = { invoice_date: -1 };
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

  // lookup with billing
  pipelines.push(
    {
      $lookup: {
        from: 'billings',
        localField: 'billing',
        foreignField: '_id',
        as: 'billing',
      },
    },
    {
      $unwind: {
        path: '$billing',
        preserveNullAndEmptyArrays: true,
      },
    }
  );

  // result
  return await Invoice.aggregate(pipelines);
};

const findById = async (id) => {
  return await Invoice.findOne({ _id: id })
    .populate('billing')
    .select('-__v')
    .lean();
};

const findByBillingId = async (billingId) => {
  return await Invoice.findOne({ billing: billingId })
    .populate('billing')
    .lean();
};

const create = async (data) => {
  let invoice = new Invoice(data);
  return await invoice.save();
};

const update = async (id, data) => {
  return await Invoice.findOneAndUpdate({ _id: id }, data, {
    returnOriginal: false,
  })
    .populate('billing')
    .select('-__v')
    .lean();
};

const deleteOne = async (id) => {
  return await Invoice.deleteOne({ _id: id });
};

module.exports = { list, findById, findByBillingId, create, update, deleteOne };
