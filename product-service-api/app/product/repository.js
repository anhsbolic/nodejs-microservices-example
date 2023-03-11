const { Product } = require('./model');

const list = async (query) => {
  const { page, limit, search, sort_by } = query;

  // init aggregate pipelines
  let pipelines = [];

  // init filters
  let filters = [{}];

  // filter : search
  if (search && search !== '') {
    filters.push({
      $text: { $search: search },
    });
  }

  // filters
  pipelines.push({ $match: { $and: filters } });

  // sort
  if (sort_by && sort_by !== '') {
    let sort = { name: 1 };
    if (sort_by === 'name_asc') {
      sort = { name: 1 };
    } else if (sort_by === 'name_desc') {
      sort = { name: -1 };
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
  return await Product.aggregate(pipelines);
};

const findById = async (id) => {
  return await Product.findOne({ _id: id }).select('-__v').lean();
};

const create = async (data) => {
  let product = new Product(data);
  return await product.save();
};

const update = async (id, data) => {
  return await Product.findOneAndUpdate({ _id: id }, data, {
    returnOriginal: false,
  })
    .select('-__v')
    .lean();
};

const deleteOne = async (id) => {
  return await Product.deleteOne({ _id: id });
};

module.exports = { list, findById, create, update, deleteOne };
