const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  product: String,
  qty: Number,
  rate: Number,
  gst: Number,
  amount: Number,
  cgstAmount: Number,
  sgstAmount: Number
});

const ServiceSchema = new mongoose.Schema({
  service: String,
  qty: Number,
  rate: Number,
  gst: Number,
  amount: Number,
  cgstAmount: Number,
  sgstAmount: Number
});

const TransactionSchema = new mongoose.Schema(
  {
    invoiceNo: String,
    invoiceDate: Date,

    customer: {
      id: String,
      name: String,
      vehicleNo: String,
      contact: String,
      state: String
    },

    services: [ServiceSchema],   // existing
    products: [ProductSchema],   // new

    subtotal: Number,
    cgstTotal: Number,
    sgstTotal: Number,
    discount: Number,
    grandTotal: Number,

    payments: {
      cash: { type: Number, default: 0 },
      upi: { type: Number, default: 0 },
      credit: { type: Number, default: 0 }
    },

    totalPaid: { type: Number, default: 0 },
    balanceAmount: { type: Number, default: 0 },
    paymentStatus: String,

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
