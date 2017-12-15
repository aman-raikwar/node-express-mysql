var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
  prod_name: String,
  prod_desc: String,
  prod_price: Number,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema);
