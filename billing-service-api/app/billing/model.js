const mongoose = require('mongoose');

let billingSchema = mongoose.Schema(
  {
    purchase_order: {
      type: mongoose.Types.ObjectId,
      ref: 'PurchaseOrder',
      required: true,
    },
    billing_number: {
      type: String,
      required: true,
    },
    billing_date: {
      type: Date,
      required: true,
    },
    due_date: {
      type: Date,
      required: true,
    },
    paid_date: {
      type: Date,
      required: false,
    },
    cancelled_date: {
      type: Date,
      required: false,
    },
    item: {
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
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    flag_invoiced: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      required: true,
      enum: ['unpaid', 'paid', 'cancelled'],
      default: 'unpaid',
    },
  },
  { timestamps: true }
);

billingSchema.index({ createdAt: 1 });

exports.Billing = mongoose.model('Billing', billingSchema);
