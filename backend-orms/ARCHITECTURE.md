# Backend Architecture Overview

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                              │
│                  (React/Frontend App)                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP Requests (JSON)
                     │ Cookies: accessToken, refreshToken
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                     EXPRESS SERVER                          │
│                      (index.js)                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              MIDDLEWARE LAYER                        │  │
│  │  - CORS                                              │  │
│  │  - Body Parser (JSON/URL-encoded)                    │  │
│  │  - Cookie Parser                                     │  │
│  │  - Input Sanitization                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │               ROUTES LAYER                           │  │
│  │  ┌──────────────────┐  ┌────────────────────────┐   │  │
│  │  │  Auth Routes     │  │  Customer Routes       │   │  │
│  │  │  /api/auth/*     │  │  /api/customers/*      │   │  │
│  │  └──────────────────┘  └────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            VALIDATION MIDDLEWARE                     │  │
│  │  - Validate Input                                    │  │
│  │  - Sanitize Data                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         AUTHENTICATION MIDDLEWARE                    │  │
│  │  - Verify Access Token (from cookies/header)         │  │
│  │  - Decode JWT                                        │  │
│  │  - Attach user to request                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              CONTROLLERS LAYER                       │  │
│  │  ┌──────────────────┐  ┌────────────────────────┐   │  │
│  │  │ Auth Controller  │  │  Customer Controller   │   │  │
│  │  │  - register()    │  │  - getAllCustomers()   │   │  │
│  │  │  - login()       │  │  - getCustomerById()   │   │  │
│  │  │  - refresh()     │  │  - createCustomer()    │   │  │
│  │  │  - logout()      │  │  - updateCustomer()    │   │  │
│  │  │  - getProfile()  │  │  - deleteCustomer()    │   │  │
│  │  └──────────────────┘  └────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │               MODELS LAYER                           │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │          Customer Model                      │   │  │
│  │  │  - create()                                  │   │  │
│  │  │  - findByUsername()                          │   │  │
│  │  │  - findByEmail()                             │   │  │
│  │  │  - findById()                                │   │  │
│  │  │  - findAll()                                 │   │  │
│  │  │  - updateById()                              │   │  │
│  │  │  - deleteById()                              │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │             UTILITIES LAYER                          │  │
│  │  ┌─────────────┐ ┌──────────────┐ ┌──────────────┐  │  │
│  │  │   Token     │ │  Response    │ │  Validation  │  │  │
│  │  │   Utils     │ │   Utils      │ │    Utils     │  │  │
│  │  └─────────────┘ └──────────────┘ └──────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           ERROR HANDLER MIDDLEWARE                   │  │
│  │  - Catch all errors                                  │  │
│  │  - Format error responses                            │  │
│  │  - Log errors                                        │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                           │
│                  MongoDB (customers)                        │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow Example: User Login

```
1. POST /api/auth/login
   ↓
2. CORS Middleware → Parse JSON → Parse Cookies
   ↓
3. Sanitize Input (trim whitespace)
   ↓
4. Validate Input (username & password required)
   ↓
5. Auth Controller: login()
   ↓
6. Customer Model: findByUsername()
   ↓
7. MongoDB Query
   ↓
8. Bcrypt: Compare password hash
   ↓
9. Token Utils: Generate access & refresh tokens
   ↓
10. Set httpOnly cookies (accessToken, refreshToken)
    ↓
11. Response Utils: Send success response
    ↓
12. Return JSON + Set-Cookie headers
```

## 🔐 Authentication Flow

```
┌──────────────┐
│   REGISTER   │
└──────┬───────┘
       │
       ├─→ Validate input
       ├─→ Check if user exists
       ├─→ Hash password (bcrypt)
       ├─→ Create user in DB
       ├─→ Generate tokens (access + refresh)
       └─→ Set cookies + Return tokens
              │
              ▼
┌──────────────────────────────────┐
│   CLIENT STORES TOKENS           │
│   - Cookies (httpOnly, secure)   │
│   - Optional: localStorage       │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  PROTECTED ROUTE REQUEST         │
│  (e.g., GET /api/auth/profile)   │
└──────────────┬───────────────────┘
               │
               ├─→ Extract token from cookie/header
               ├─→ Verify JWT signature
               ├─→ Check expiration
               │
               ├─→ [Valid] → Attach user to req → Continue
               │
               └─→ [Invalid/Expired] → Return 401/403
                      │
                      ▼
              ┌───────────────┐
              │ REFRESH TOKEN │
              └───────┬───────┘
                      │
                      ├─→ Send refresh token
                      ├─→ Verify refresh token
                      ├─→ Generate new tokens
                      └─→ Set new cookies + Return tokens
```

## 📁 File Responsibilities

### `/config`

- **database.js**: MongoDB connection setup and management
- **index.js**: Centralized configuration from environment variables

### `/controllers`

- **auth.controller.js**: Business logic for authentication (register, login, etc.)
- **customer.controller.js**: Business logic for customer CRUD operations

### `/middleware`

- **auth.js**: JWT verification and user authentication
- **errorHandler.js**: Global error handling and 404 handling
- **validation.js**: Input validation and sanitization

### `/models`

- **Customer.js**: Database operations for customer collection

### `/routes`

- **auth.routes.js**: Authentication endpoint definitions
- **customer.routes.js**: Customer CRUD endpoint definitions

### `/utils`

- **tokenUtils.js**: JWT generation and verification
- **responseUtils.js**: Standardized API response formatting
- **validationUtils.js**: Input validation rules and helpers

### Root Files

- **index.js**: Application entry point and server setup
- **.env**: Environment variables (not committed to git)
- **package.json**: Dependencies and scripts

## 🎯 Design Patterns Used

1. **MVC Pattern**: Models, Controllers, Routes separation
2. **Middleware Pattern**: Request processing pipeline
3. **Singleton Pattern**: Database connection instance
4. **Factory Pattern**: Token generation utilities
5. **Repository Pattern**: Customer model with DB methods

## 🔒 Security Layers

```
Layer 1: CORS → Validate origin
Layer 2: Input Sanitization → Trim whitespace
Layer 3: Input Validation → Check format & requirements
Layer 4: Authentication → Verify JWT token
Layer 5: Password Hashing → Bcrypt (salt rounds: 10)
Layer 6: HttpOnly Cookies → Prevent XSS
Layer 7: Secure Cookies → HTTPS in production
Layer 8: SameSite Policy → CSRF protection
```

## 📊 Token Strategy

```
Access Token:
- Short-lived (15 minutes)
- Used for API requests
- Stored in httpOnly cookie
- Contains: user id, username, email

Refresh Token:
- Long-lived (7 days)
- Used to get new access tokens
- Stored in httpOnly cookie
- Contains: user id, username, email
```

## 🚦 Response Status Codes

```
2xx Success
├─ 200: OK (successful GET, PUT, DELETE)
└─ 201: Created (successful POST)

4xx Client Errors
├─ 400: Bad Request (validation error)
├─ 401: Unauthorized (missing token)
├─ 403: Forbidden (invalid/expired token)
├─ 404: Not Found (resource not found)
└─ 409: Conflict (duplicate username/email)

5xx Server Errors
└─ 500: Internal Server Error
```
