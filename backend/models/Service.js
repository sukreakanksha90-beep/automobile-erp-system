const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  id: String,
  name: String,
  gstCategory: String,
  cost: String,
  category: String
});

module.exports = mongoose.model("Service", serviceSchema);
