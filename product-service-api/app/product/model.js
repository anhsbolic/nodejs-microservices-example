const mongoose = require('mongoose');

let productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: 1 });
productSchema.index(
  { name: 'text' },
  { weights: { name: 1 }, name: 'SearchProductIndex' }
);

exports.Product = mongoose.model('Product', productSchema);
