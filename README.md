# Product API - Express.js RESTful API

A fully-featured RESTful API built with Express.js and MongoDB for managing product inventory. This project includes authentication, validation, error handling, filtering, pagination, and search capabilities.

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Middleware](#middleware)
- [Error Handling](#error-handling)
- [Testing with Postman](#testing-with-postman)
- [Examples](#examples)

## ✨ Features

### Core Features
- **RESTful API Design** - Full CRUD operations for products
- **MongoDB Integration** - Persistent data storage
- **Auto Database Seeding** - Automatic population of initial data
- **Authentication** - API key-based authentication
- **Validation** - Request validation middleware
- **Error Handling** - Comprehensive error handling with custom error classes

### Advanced Features
- **Filtering** - Filter products by category and stock status
- **Pagination** - Support for paginated results
- **Search** - Full-text search by product name
- **Statistics** - Product analytics and insights
- **Request Logging** - Custom logging middleware

## 🛠 Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **body-parser** - Request body parsing
- **dotenv** - Environment variable management
- **uuid** - Unique identifier generation

## 📁 Project Structure

```
product-api/
├── config/
│   └── db.js                 # Database connection configuration
├── models/
│   └── products.js           # Product schema and model
├── routes/
│   └── productsroute.js      # Product routes (alternative structure)
├── .env                      # Environment variables (NOT in Git)
├── .env.example              # Environment template (safe to commit)
├── .gitignore                # Git ignore rules
├── server.js                 # Main application file
├── package.json              # Project dependencies
└── README.md                 # Project documentation
```

### Required Project Files

Create these files in your project:

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/PLP-MERN-Stack-Development/express-js-server-side-framework-Bkirop.git
   cd product-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install required packages**
   ```bash
   npm install express body-parser mongoose dotenv uuid
   ```

## ⚙️ Configuration

### Environment Variables Setup

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your actual configuration:**

   **MongoDB Atlas (Cloud):**
   ```env
   PORT=3000
   NODE_ENV=production
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/productdb?retryWrites=true&w=majority
   API_KEY=sk_prod_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
   AUTO_SEED_DATABASE=true
   DEFAULT_PAGE_LIMIT=10
   MAX_PAGE_LIMIT=100
   LOG_LEVEL=production
   ```

3. **Get MongoDB Atlas Connection String:**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<cluster>` with your actual values

### Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port number | 3000 | No |
| `NODE_ENV` | Environment mode (development/production) | development | No |
| `MONGO_URI` | MongoDB connection string | - | Yes |
| `API_KEY` | API authentication key | - | Yes |
| `AUTO_SEED_DATABASE` | Auto-populate database on startup | true | No |
| `DEFAULT_PAGE_LIMIT` | Default pagination limit | 10 | No |
| `MAX_PAGE_LIMIT` | Maximum pagination limit | 100 | No |
| `LOG_LEVEL` | Logging level | development | No |

### Required Project Files

Create these files in your project:

#### 1. `.gitignore` (Protects sensitive files)

```bash
# Environment Variables
.env
.env.local
.env.*.local

# Dependencies
node_modules/
npm-debug.log*
package-lock.json

# Logs
logs/
*.log

# Operating System Files
.DS_Store
Thumbs.db

# IDE Files
.vscode/
.idea/

# Build Output
dist/
build/
```

#### 2. `config/db.js` (Database connection)

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

#### 2. `config/db.js` (Database connection)

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

#### 3. `models/products.js` (Product schema)

```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

#### 3. `models/products.js` (Product schema)

```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
```

### Verify Your Setup

After configuration, test your setup:

```bash
# 1. Start the server
npm start

# 2. Check console output - should see:
# ✅ MongoDB connected successfully
# ✅ Database seeded successfully with 5 products
# Server is running on http://localhost:3000

# 3. Test database connection
curl http://localhost:3000/api/test-db
# Or visit in browser: http://localhost:3000/api/test-db
```

## 🏃 Running the Server

### Development Mode
```bash
node server.js
```

### With nodemon (auto-restart)
```bash
npm install -g nodemon
nodemon server.js
```

The server will start on `http://localhost:3000`

## 📡 API Endpoints

### Product Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products (with filtering & pagination) | No |
| GET | `/api/products/:id` | Get a specific product | No |
| GET | `/api/products/search` | Search products by name | No |
| GET | `/api/products/statistics` | Get product statistics | No |
| POST | `/api/products` | Create a new product | Yes |
| PUT | `/api/products/:id` | Update a product | Yes |
| DELETE | `/api/products/:id` | Delete a product | Yes |

## 🔐 Authentication

Protected routes require an API key in the request headers:

```
api-key: your-secret-api-key
```

**Protected Routes:**
- POST `/api/products`
- PUT `/api/products/:id`
- DELETE `/api/products/:id`

## 🛡️ Middleware

### 1. Request Logger
Logs all incoming requests with timestamp, method, and URL.

```javascript
function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
}
```

### 2. Authentication
Validates API key in request headers.

### 3. Validation Middleware
- `validateProduct` - Validates product creation (strict)
- `validateProductUpdate` - Validates product updates (flexible)

**Validation Rules:**
- `name`: Required, non-empty string
- `price`: Required, non-negative number
- `category`: Required, non-empty string
- `inStock`: Optional boolean

## ❌ Error Handling

### Custom Error Classes

```javascript
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.isOperational = true;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.isOperational = true;
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.isOperational = true;
  }
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Server Error |

## 🧪 Testing with Postman

### Postman Collection Setup

1. **Import Environment Variables:**
   - Create a new environment in Postman
   - Add variable: `base_url` = `http://localhost:3000`
   - Add variable: `api_key` = `your-secret-api-key`

2. **Use variables in requests:**
   - URL: `{{base_url}}/api/products`
   - Header: `api-key: {{api_key}}`

### Quick Test Checklist

Before testing, ensure:
- ✅ MongoDB is running
- ✅ Server is started (`npm start`)
- ✅ Database is seeded (check console logs)
- ✅ `.env` file is configured correctly

### Test Endpoints

### 1. Get All Products
```
GET http://localhost:3000/api/products
```

**Response:**
```json
{
  "status": "success",
  "results": 5,
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalProducts": 5,
    "limit": 10
  },
  "data": [...]
}
```

### 2. Filter Products by Category
```
GET http://localhost:3000/api/products?category=electronics
```

### 3. Pagination
```
GET http://localhost:3000/api/products?page=1&limit=2
```

### 4. Filter by Stock Status
```
GET http://localhost:3000/api/products?inStock=true
```

### 5. Combined Filters
```
GET http://localhost:3000/api/products?category=electronics&inStock=true&page=1&limit=5
```

### 6. Search Products
```
GET http://localhost:3000/api/products/search?q=laptop
```

**Response:**
```json
{
  "status": "success",
  "results": 1,
  "searchQuery": "laptop",
  "data": [...]
}
```

### 7. Get Statistics
```
GET http://localhost:3000/api/products/statistics
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "totalProducts": 5,
    "inStock": 4,
    "outOfStock": 1,
    "priceStatistics": {
      "averagePrice": 431,
      "minPrice": 25,
      "maxPrice": 1200
    },
    "categoryBreakdown": [
      {
        "_id": "electronics",
        "count": 3,
        "averagePrice": 675,
        "totalValue": 2025
      },
      {
        "_id": "kitchen",
        "count": 2,
        "averagePrice": 65,
        "totalValue": 130
      }
    ]
  }
}
```

### 8. Create Product (Requires Authentication)
```
POST http://localhost:3000/api/products
Headers:
  api-key: your-secret-api-key
  Content-Type: application/json

Body:
{
  "name": "Wireless Headphones",
  "description": "Noise-cancelling Bluetooth headphones",
  "price": 199,
  "category": "electronics",
  "inStock": true
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Product created successfully",
  "data": {
    "id": "generated-uuid",
    "name": "Wireless Headphones",
    "description": "Noise-cancelling Bluetooth headphones",
    "price": 199,
    "category": "electronics",
    "inStock": true,
    "_id": "mongodb-id",
    "createdAt": "2025-10-04T...",
    "updatedAt": "2025-10-04T..."
  }
}
```

### 9. Update Product (Requires Authentication)
```
PUT http://localhost:3000/api/products/1
Headers:
  api-key: your-secret-api-key
  Content-Type: application/json

Body:
{
  "price": 1100,
  "inStock": false
}
```

### 10. Delete Product (Requires Authentication)
```
DELETE http://localhost:3000/api/products/3
Headers:
  api-key: your-secret-api-key
```

**Response:**
```json
{
  "status": "success",
  "message": "Product deleted successfully",
  "data": {...}
}
```

## 📝 Examples

### Example: Validation Error
**Request:**
```
POST http://localhost:3000/api/products
Headers:
  api-key: your-secret-api-key
  Content-Type: application/json

Body:
{
  "name": "",
  "price": -50
}
```

**Response (400):**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    "Name is required and must be a non-empty string",
    "Price must be a non-negative number",
    "Category is required and must be a non-empty string"
  ]
}
```

### Example: Authentication Error
**Request:**
```
POST http://localhost:3000/api/products
Body: {...}
```

**Response (401):**
```json
{
  "status": "error",
  "message": "API key is required. Please provide api-key in headers."
}
```

### Example: Not Found Error
**Request:**
```
GET http://localhost:3000/api/products/999
```

**Response (404):**
```json
{
  "status": "error",
  "message": "Product with id 999 not found"
}
```

## 🔧 Development Tips

### Quick Start Commands

```bash
# Install dependencies
npm install

# Start server
npm start

# Start with auto-reload (requires nodemon)
npm run dev

# Test database connection
curl http://localhost:3000/api/test-db

# Manually seed database
curl -X POST http://localhost:3000/api/seed
```

### Common Issues & Solutions

#### Issue: "MongooseServerSelectionError: connect ECONNREFUSED"
**Solution:** MongoDB is not running
```bash
# Start MongoDB locally:
# macOS (with Homebrew)
brew services start mongodb-community

# Windows
net start MongoDB

# Linux
sudo systemctl start mongod
```

#### Issue: "API key is required"
**Solution:** Add API key header to your request
```bash
# In Postman: Add header
api-key: your-secret-api-key

# In curl:
curl -H "api-key: your-secret-api-key" http://localhost:3000/api/products
```

#### Issue: Database is empty / No products returned
**Solution:** Manually seed the database
```bash
curl -X POST http://localhost:3000/api/seed
```

#### Issue: "Cannot find module './config/db'"
**Solution:** Create the required files
```bash
mkdir config models
# Then create config/db.js and models/products.js
```

### Enable Auto-seeding

The database automatically seeds with 5 sample products on first startup if empty. To control this:

```env
# In .env file
AUTO_SEED_DATABASE=true   # Enable auto-seeding
AUTO_SEED_DATABASE=false  # Disable auto-seeding
```

### Manual Database Operations

**Seed Database:**
```bash
POST http://localhost:3000/api/seed
```

**Check Database Status:**
```bash
GET http://localhost:3000/api/test-db
```

**Clear and Re-seed:**
```bash
# This will delete all products and re-seed
POST http://localhost:3000/api/seed
```

### Environment-Specific Configurations

**Development:**
```env
NODE_ENV=development
LOG_LEVEL=development
API_KEY=dev-test-key-12345
```

**Production:**
```env
NODE_ENV=production
LOG_LEVEL=production
API_KEY=sk_prod_secure_random_key_here
```

## 📦 Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "name": "product-api",
  "version": "1.0.0",
  "description": "RESTful Product API with Express.js and MongoDB",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["express", "mongodb", "rest-api", "nodejs"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "body-parser": "^1.20.2",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### Install All Dependencies

```bash
# Install production dependencies
npm install express body-parser mongoose dotenv uuid

# Install development dependencies
npm install --save-dev nodemon
```

## 🚀 Deployment

### Deploy to Production

#### Prerequisites
- MongoDB Atlas account (for cloud database)
- Production server (Heroku, AWS, DigitalOcean, etc.)
- Strong API key for production

#### Steps

1. **Set up MongoDB Atlas:**
   ```bash
   # Get your production connection string
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/productdb
   ```

2. **Configure Production Environment:**
   ```env
   NODE_ENV=production
   PORT=3000
   MONGO_URI=your_production_mongodb_uri
   API_KEY=your_strong_production_api_key
   AUTO_SEED_DATABASE=false
   ```

3. **Deploy to Heroku (Example):**
   ```bash
   # Login to Heroku
   heroku login
   
   # Create app
   heroku create your-product-api
   
   # Set environment variables
   heroku config:set NODE_ENV=production
   heroku config:set MONGO_URI=your_mongodb_uri
   heroku config:set API_KEY=your_api_key
   
   # Deploy
   git push heroku main
   ```

4. **Deploy to DigitalOcean/AWS:**
   - Upload your code (excluding node_modules and .env)
   - Install dependencies: `npm install --production`
   - Set environment variables on the server
   - Use PM2 for process management:
     ```bash
     npm install -g pm2
     pm2 start server.js --name product-api
     pm2 startup
     pm2 save
     ```

#### Production Checklist

- ✅ Use MongoDB Atlas (not local MongoDB)
- ✅ Set `NODE_ENV=production`
- ✅ Use strong, unique API keys
- ✅ Disable auto-seeding in production
- ✅ Enable HTTPS/SSL
- ✅ Set up monitoring and logging
- ✅ Configure CORS for your frontend domains
- ✅ Set up rate limiting
- ✅ Regular database backups

## 🧪 Testing

### Manual Testing

Use the provided Postman examples throughout this README.

### Automated Testing (Future Enhancement)

```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Run tests
npm test
```

Example test structure:
```javascript
// tests/products.test.js
const request = require('supertest');
const app = require('../server');

describe('Product API', () => {
  it('GET /api/products - should return all products', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
  });
});
```

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Brian Kirop - [briankirop@gmail.com]


## 📞 Support

If you have any questions or need help:

1. **Check the README** - Most common issues are covered here

## 🔮 Future Enhancements

Planned features for future versions:

- [ ] User authentication and authorization (JWT)
- [ ] Product images upload
- [ ] Product reviews and ratings
- [ ] Order management system
- [ ] Email notifications
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] API versioning
- [ ] Automated testing suite
- [ ] API documentation with Swagger/OpenAPI
- [ ] GraphQL support
- [ ] WebSocket for real-time updates
- [ ] Caching with Redis
- [ ] Docker containerization

## 🙏 Acknowledgments

- Express.js team for the amazing framework
- MongoDB team for the powerful database
- Node.js community

---

**Built with ❤️ using Express.js and MongoDB**
