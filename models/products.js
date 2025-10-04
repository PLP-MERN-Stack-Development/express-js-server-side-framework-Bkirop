const mongoose = require('mongoose');

// Define the Product schema
const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => require('uuid').v4(), // Generate a unique ID using UUID
  },
  name: {
    type: String,
    required: true,
  },
 
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Create the Product model
const Product = mongoose.model('products', productSchema);

module.exports = Product;
