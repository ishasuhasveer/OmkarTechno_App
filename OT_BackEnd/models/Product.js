const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true }, // added
  type: [{ type: String, required: true }], // added
  description: { type: String },
  image: { type: String },
  grades: [{ type: String }],
  category: { type: String },
  company: [{ type: String }],
  units: { type: Number },
  price: [{ type: Number }], // only for admin view
  quoteCount: { type: Number, default: 0 }, // auto-increment for quotes
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Product', productSchema);
