const mongoose = require('mongoose');

let purchaseOrderSchema = mongoose.Schema(
  {
    po_number: {
      type: String,
      required: true,
    },
    po_date: {
      type: Date,
      required: true,
    },
    product: {
      _id: mongoose.Schema.Types.ObjectId,
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
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      required: true,
      enum: ['unbilled', 'billed'],
      default: 'unbilled',
    },
  },
  { timestamps: true }
);

purchaseOrderSchema.index({ createdAt: 1 });

exports.PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);
