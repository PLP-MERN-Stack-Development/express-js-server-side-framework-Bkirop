// server.js - Complete Express server meeting all assignment requirements

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/products');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB and seed database
connectDB().then(() => {
  seedDatabase();
});

// Function to seed the database with initial products
async function seedDatabase() {
  try {
    const count = await Product.countDocuments();
    
    if (count === 0) {
      console.log('Database is empty. Seeding initial products...');
      
      const initialProducts = [
        {
          id: '1',
          name: 'Laptop',
          description: 'High-performance laptop with 16GB RAM',
          price: 1200,
          category: 'electronics',
          inStock: true
        },
        {
          id: '2',
          name: 'Smartphone',
          description: 'Latest model with 128GB storage',
          price: 800,
          category: 'electronics',
          inStock: true
        },
        {
          id: '3',
          name: 'Coffee Maker',
          description: 'Programmable coffee maker with timer',
          price: 50,
          category: 'kitchen',
          inStock: false
        },
        {
          id: '4',
          name: 'Wireless Mouse',
          description: 'Ergonomic wireless mouse',
          price: 25,
          category: 'electronics',
          inStock: true
        },
        {
          id: '5',
          name: 'Blender',
          description: 'High-speed blender for smoothies',
          price: 80,
          category: 'kitchen',
          inStock: true
        }
      ];

      await Product.insertMany(initialProducts);
      console.log('✅ Database seeded successfully with', initialProducts.length, 'products');
    } else {
      console.log('✅ Database already contains', count, 'products');
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

// MIDDLEWARE

// 1. Custom logger middleware - Logs request method, URL, and timestamp
function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
}

// 2. JSON body parser middleware
app.use(bodyParser.json());

// 3. Authentication middleware - Checks for API key in headers
function authenticate(req, res, next) {
  const apiKey = req.headers['api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ 
      status: 'error',
      message: 'API key is required. Please provide api-key in headers.' 
    });
  }
  
  if (apiKey !== process.env.API_KEY && apiKey !== 'your-secret-api-key') {
    return res.status(401).json({ 
      status: 'error',
      message: 'Invalid API key' 
    });
  }
  
  next();
}

// 4. Validation middleware for product creation and updates
function validateProduct(req, res, next) {
  const { name, price, category } = req.body;
  const errors = [];

  // Validate name
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }

  // Validate price
  if (price === undefined || price === null) {
    errors.push('Price is required');
  } else if (typeof price !== 'number' || price < 0) {
    errors.push('Price must be a non-negative number');
  }

  // Validate category
  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.push('Category is required and must be a non-empty string');
  }

  // Validate inStock if provided
  if (req.body.inStock !== undefined && typeof req.body.inStock !== 'boolean') {
    errors.push('inStock must be a boolean value');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
}

// Validation middleware for product updates (partial updates allowed)
function validateProductUpdate(req, res, next) {
  const { name, price, category, inStock } = req.body;
  const errors = [];

  // Only validate if fields are provided
  if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
    errors.push('Name must be a non-empty string');
  }

  if (price !== undefined && (typeof price !== 'number' || price < 0)) {
    errors.push('Price must be a non-negative number');
  }

  if (category !== undefined && (typeof category !== 'string' || category.trim().length === 0)) {
    errors.push('Category must be a non-empty string');
  }

  if (inStock !== undefined && typeof inStock !== 'boolean') {
    errors.push('inStock must be a boolean value');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
}

// Apply global middleware
app.use(requestLogger);

// CUSTOM ERROR CLASSES 

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
    this.isOperational = true;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.isOperational = true;
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
    this.isOperational = true;
  }
}

// Async error wrapper function
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ROUTES

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Product API!',
    endpoints: {
      products: '/api/products',
      search: '/api/products/search',
      statistics: '/api/products/statistics'
    }
  });
});

// GET /api/products - Get all products with filtering and pagination
app.get('/api/products', asyncHandler(async (req, res) => {
  const { category, inStock, page = 1, limit = 10 } = req.query;
  
  // Build filter object
  const filter = {};
  
  if (category) {
    filter.category = category;
  }
  
  if (inStock !== undefined) {
    filter.inStock = inStock === 'true';
  }
  
  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const totalProducts = await Product.countDocuments(filter);
  const totalPages = Math.ceil(totalProducts / parseInt(limit));
  
  // Fetch products with filter and pagination
  const products = await Product.find(filter)
    .limit(parseInt(limit))
    .skip(skip)
    .sort({ name: 1 });
  
  res.status(200).json({
    status: 'success',
    results: products.length,
    pagination: {
      currentPage: parseInt(page),
      totalPages: totalPages,
      totalProducts: totalProducts,
      limit: parseInt(limit)
    },
    data: products
  });
}));

// GET /api/products/search - Search products by name
app.get('/api/products/search', asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    throw new ValidationError('Search query parameter "q" is required');
  }
  
  // Search for products with name matching the query (case-insensitive)
  const products = await Product.find({
    name: { $regex: q, $options: 'i' }
  });
  
  res.status(200).json({
    status: 'success',
    results: products.length,
    searchQuery: q,
    data: products
  });
}));

// GET /api/products/statistics - Get product statistics
app.get('/api/products/statistics', asyncHandler(async (req, res) => {
  // Get count by category
  const categoryStats = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        averagePrice: { $avg: '$price' },
        totalValue: { $sum: '$price' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
  
  // Get overall statistics
  const totalProducts = await Product.countDocuments();
  const inStockCount = await Product.countDocuments({ inStock: true });
  const outOfStockCount = await Product.countDocuments({ inStock: false });
  
  // Get price statistics
  const priceStats = await Product.aggregate([
    {
      $group: {
        _id: null,
        averagePrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    }
  ]);
  
  res.status(200).json({
    status: 'success',
    data: {
      totalProducts: totalProducts,
      inStock: inStockCount,
      outOfStock: outOfStockCount,
      priceStatistics: priceStats[0] || {},
      categoryBreakdown: categoryStats
    }
  });
}));

// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', asyncHandler(async (req, res) => {
  const product = await Product.findOne({ id: req.params.id });
  
  if (!product) {
    throw new NotFoundError(`Product with id ${req.params.id} not found`);
  }
  
  res.status(200).json({
    status: 'success',
    data: product
  });
}));

// POST /api/products - Create a new product (with authentication and validation)
app.post('/api/products', authenticate, validateProduct, asyncHandler(async (req, res) => {
  const productData = {
    ...req.body,
    id: req.body.id || uuidv4()
  };
  
  const newProduct = new Product(productData);
  await newProduct.save();
  
  res.status(201).json({
    status: 'success',
    message: 'Product created successfully',
    data: newProduct
  });
}));

// PUT /api/products/:id - Update a product (with authentication and validation)
app.put('/api/products/:id', authenticate, validateProductUpdate, asyncHandler(async (req, res) => {
  const updatedProduct = await Product.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!updatedProduct) {
    throw new NotFoundError(`Product with id ${req.params.id} not found`);
  }
  
  res.status(200).json({
    status: 'success',
    message: 'Product updated successfully',
    data: updatedProduct
  });
}));

// DELETE /api/products/:id - Delete a product (with authentication)
app.delete('/api/products/:id', authenticate, asyncHandler(async (req, res) => {
  const deletedProduct = await Product.findOneAndDelete({ id: req.params.id });
  
  if (!deletedProduct) {
    throw new NotFoundError(`Product with id ${req.params.id} not found`);
  }
  
  res.status(200).json({
    status: 'success',
    message: 'Product deleted successfully',
    data: deletedProduct
  });
}));


//  ERROR HANDLING

// 404 handler for unmatched routes
app.use((req, res, next) => {
  next(new NotFoundError(`Cannot find ${req.originalUrl} on this server`));
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Set default values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle MongoDB validation errors
  if (err.name === 'ValidationError') {
    err.statusCode = 400;
    err.message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  // Handle MongoDB CastError
  if (err.name === 'CastError') {
    err.statusCode = 400;
    err.message = `Invalid ${err.path}: ${err.value}`;
  }

  // Send error response
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Export the app for testing purposes
module.exports = app;