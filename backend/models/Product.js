const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  quantity: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['available', 'sold', 'canceled'], default: 'available' },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
