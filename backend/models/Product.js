const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  pid: String,          // <-- THIS is important
  name: String,
  partno: String,
  hsn: String,
  tax: String,
  category: String,
  vehicleCat: String,
  purchase: String,
  sale: String,
  mrp: String,
  brand: String,
  state: String
});

module.exports = mongoose.model("Product", productSchema);
