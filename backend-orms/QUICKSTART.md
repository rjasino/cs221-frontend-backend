# ⚡ Quick Start Guide

Get your backend running in 3 minutes!

## 📋 Prerequisites

- Node.js installed (v14 or higher)
- MongoDB running locally or MongoDB Atlas account
- Terminal/Command Prompt

---

## 🚀 Setup Steps

### Step 1: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` file with your values:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/

MONGODB_NAME=blataditz-retail
JWT_SECRET=mysecretkey123
JWT_REFRESH_SECRET=myrefreshsecret456
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

You should see:

```
Connected to MongoDB
Server is running on http://localhost:3000
Environment: development
```

---

## ✅ Test It Works

### 1. Health Check

Open browser: `http://localhost:3000/health`

Should see:

```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "..."
}
```

### 2. Register a User

**Using curl:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"TestPass123\",\"first_name\":\"Test\",\"last_name\":\"User\"}"
```

**Using Postman/Thunder Client:**

- Method: POST
- URL: `http://localhost:3000/api/auth/register`
- Headers: `Content-Type: application/json`
- Body:

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "TestPass123",
  "first_name": "Test",
  "last_name": "User"
}
```

### 3. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"password\":\"TestPass123\"}" \
  -c cookies.txt
```

### 4. Get Profile (Protected Route)

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -b cookies.txt
```

---

## 🎯 Available Endpoints

### Public Routes (No authentication needed)

```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login
POST   /api/auth/refresh       - Refresh token
GET    /api/customers          - Get all customers
GET    /api/customers/:id      - Get customer by ID
GET    /health                 - Health check
```

### Protected Routes (Require authentication)

```
POST   /api/auth/logout        - Logout
GET    /api/auth/profile       - Get user profile
GET    /api/auth/verify        - Verify token
POST   /api/customers          - Create customer
PUT    /api/customers/:id      - Update customer
DELETE /api/customers/:id      - Delete customer
```

---

## 🔍 Troubleshooting

### MongoDB Connection Error

```
Error: Failed to connect to the database
```

**Solution:**

- Check MongoDB is running: `mongod` or verify Atlas connection
- Verify `MONGODB_URI` in `.env` is correct

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

- Change `PORT` in `.env` to another port (e.g., 3001)
- OR kill the process using port 3000

### JWT Secret Error

```
Error: secretOrPrivateKey must have a value
```

**Solution:**

- Make sure `JWT_SECRET` is set in `.env` file

### CORS Error

```
Access to fetch has been blocked by CORS policy
```

**Solution:**

- Update `CORS_ORIGIN` in `.env` to match your frontend URL

---

## 📚 Next Steps

1. **Read Full Documentation**

   - `README.md` - Complete API reference
   - `API_TESTING_GUIDE.md` - Testing examples
   - `ARCHITECTURE.md` - System design

2. **Test All Endpoints**

   - Use Postman or Thunder Client
   - Follow the API_TESTING_GUIDE.md

3. **Integrate with Frontend**

   - Update frontend API base URL
   - Use tokens from cookies or headers
   - Handle token refresh

4. **Customize**
   - Add more models
   - Create additional routes
   - Add business logic

---

## 💡 Tips

### Using with Frontend (React/Vue)

**Axios configuration:**

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // Important for cookies!
});

// Register
await api.post("/auth/register", userData);

// Login
await api.post("/auth/login", credentials);

// Protected request (token from cookie automatically)
await api.get("/auth/profile");
```

### Token Management

**Cookies (Recommended):**

- Tokens are automatically sent with requests
- No manual handling needed
- Set `withCredentials: true` in axios

**Manual (Optional):**

```javascript
// Store token
localStorage.setItem("accessToken", token);

// Use in requests
axios.get("/api/auth/profile", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});
```

---

## 🎉 You're All Set!

Your backend is now running with:

- ✅ Secure authentication
- ✅ Refresh tokens
- ✅ Input validation
- ✅ Error handling
- ✅ Clean architecture

**Happy coding! 🚀**

---

## 📞 Need Help?

Check these files:

- **README.md** - Full documentation
- **API_TESTING_GUIDE.md** - Testing examples
- **ARCHITECTURE.md** - System architecture
- **CHANGELOG.md** - What was changed
