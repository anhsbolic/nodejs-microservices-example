const mongoose = require('mongoose');

let invoiceSchema = mongoose.Schema(
  {
    billing: {
      type: mongoose.Types.ObjectId,
      ref: 'Billing',
      required: true,
    },
    invoice_number: {
      type: String,
      required: true,
    },
    invoice_date: {
      type: Date,
      required: true,
    },
    approved_date: {
      type: Date,
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: ['created', 'approved'],
      default: 'created',
    },
  },
  { timestamps: true }
);

invoiceSchema.index({ createdAt: 1 });

exports.Invoice = mongoose.model('Invoice', invoiceSchema);
