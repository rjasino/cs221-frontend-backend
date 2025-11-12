# Blataditz Retail Backend API

A robust Node.js/Express backend API with MongoDB for customer management and authentication.

## 📁 Project Structure

```
backend-orms/
├── config/                  # Configuration files
│   ├── database.js         # MongoDB connection setup
│   └── index.js            # App configuration & environment variables
├── controllers/             # Business logic
│   ├── auth.controller.js  # Authentication logic
│   └── customer.controller.js # Customer CRUD logic
├── middleware/              # Custom middleware
│   ├── auth.js             # JWT authentication middleware
│   ├── errorHandler.js     # Global error handling
│   └── validation.js       # Input validation middleware
├── models/                  # Data models
│   └── Customer.js         # Customer model with DB methods
├── routes/                  # API routes
│   ├── auth.routes.js      # Authentication routes
│   └── customer.routes.js  # Customer CRUD routes
├── utils/                   # Utility functions
│   ├── tokenUtils.js       # JWT token generation/validation
│   ├── responseUtils.js    # Standardized API responses
│   └── validationUtils.js  # Input validation helpers
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── index.js                # App entry point
└── package.json            # Dependencies
```

## 🚀 Features

- ✅ **JWT Authentication** with refresh tokens
- ✅ **Cookie-based token storage** (httpOnly, secure)
- ✅ **Password hashing** with bcrypt
- ✅ **Input validation** with comprehensive error messages
- ✅ **Standardized API responses**
- ✅ **Global error handling**
- ✅ **CORS enabled**
- ✅ **Clean architecture** (MVC pattern)

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
MONGODB_NAME=blataditz-retail
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_refresh_token_secret
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## 📦 Installation

```bash
npm install
```

## 🏃 Running the Server

### Development mode (with nodemon):

```bash
npm run dev
```

### Production mode:

```bash
npm start
```

## 📚 API Documentation

### Base URL

```
http://localhost:3000
```

### Authentication Endpoints

#### 1. Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "username": "johndoe",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "created_at": "2024-11-12T..."
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Cookies Set:**

- `accessToken` (expires in 15 minutes)
- `refreshToken` (expires in 7 days)

---

#### 2. Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "SecurePass123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

---

#### 3. Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json

// Refresh token is read from cookies automatically
// Or you can send it in body:
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

---

#### 4. Logout

```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

#### 5. Get Profile

```http
GET /api/auth/profile
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": { ... }
  }
}
```

---

#### 6. Verify Token

```http
GET /api/auth/verify
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "user": {
      "id": "...",
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
}
```

---

### Customer Endpoints

#### 1. Get All Customers

```http
GET /api/customers?page=1&limit=10&username=john&email=john@example.com
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 100)
- `username` (optional): Filter by username
- `email` (optional): Filter by email

**Response:**

```json
{
  "success": true,
  "message": "Customers retrieved successfully",
  "data": {
    "customers": [ ... ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

---

#### 2. Get Customer by ID

```http
GET /api/customers/:id
```

**Response:**

```json
{
  "success": true,
  "message": "Customer retrieved successfully",
  "data": {
    "customer": { ... }
  }
}
```

---

#### 3. Create Customer (Protected)

```http
POST /api/customers
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "username": "janedoe",
  "email": "jane@example.com",
  "password": "SecurePass123",
  "first_name": "Jane",
  "last_name": "Doe"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Customer created successfully",
  "data": {
    "customer": { ... }
  }
}
```

---

#### 4. Update Customer (Protected)

```http
PUT /api/customers/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "first_name": "Jane Updated",
  "email": "jane.updated@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Customer updated successfully",
  "data": {
    "customer": { ... }
  }
}
```

---

#### 5. Delete Customer (Protected)

```http
DELETE /api/customers/:id
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Customer deleted successfully"
}
```

---

## 🔐 Authentication Flow

### Using Cookies (Recommended)

Tokens are automatically stored in httpOnly cookies and sent with each request. No need to manually include Authorization header.

### Using Authorization Header

```
Authorization: Bearer <access_token>
```

### Token Refresh Flow

1. Access token expires (15 minutes)
2. Client sends refresh token to `/api/auth/refresh`
3. Server validates refresh token
4. Server issues new access + refresh tokens
5. Client continues with new tokens

---

## ✅ Validation Rules

### Username

- 3-20 characters
- Alphanumeric and underscores only
- Required

### Email

- Valid email format
- Required

### Password

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- Required

### Names

- Required
- Cannot be empty

---

## 🛡️ Security Features

1. **Password Hashing**: Bcrypt with salt rounds of 10
2. **JWT Tokens**: Access (15m) and Refresh (7d) tokens
3. **HttpOnly Cookies**: Prevents XSS attacks
4. **Secure Cookies**: HTTPS in production
5. **SameSite Policy**: CSRF protection
6. **CORS Configuration**: Controlled origins
7. **Input Sanitization**: Trim whitespace
8. **Validation**: Comprehensive input validation

---

## 📊 Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "data": {
    "errors": [ ... ] // For validation errors
  }
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (expired token)
- `404` - Not Found
- `409` - Conflict (duplicate username/email)
- `500` - Internal Server Error

---

## 🧪 Testing with curl

### Register:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123",
    "first_name": "Test",
    "last_name": "User"
  }' \
  -c cookies.txt
```

### Login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPass123"
  }' \
  -c cookies.txt
```

### Get Profile (using cookies):

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -b cookies.txt
```

---

## 📝 Notes

- Passwords are never returned in API responses
- All timestamps are in ISO 8601 format
- Database connection is established before server starts
- Global error handler catches all unhandled errors
- Input is automatically sanitized (trimmed)

---

## 🤝 Contributing

1. Follow the existing folder structure
2. Use the utility functions for responses
3. Add validation for all user inputs
4. Handle errors properly using try-catch
5. Document new endpoints in this README

---

## 📄 License

ISC
