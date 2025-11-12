# API Testing Guide

## Quick Start with Postman/Thunder Client

### 1. Register a New User

**POST** `http://localhost:3000/api/auth/register`

**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "TestPass123",
  "first_name": "Test",
  "last_name": "User"
}
```

✅ **Expected Response:** Status 201

- Returns user data and tokens
- Sets cookies: `accessToken` and `refreshToken`

---

### 2. Login

**POST** `http://localhost:3000/api/auth/login`

**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "username": "testuser",
  "password": "TestPass123"
}
```

✅ **Expected Response:** Status 200

- Returns user data and tokens
- Sets cookies: `accessToken` and `refreshToken`

---

### 3. Get Profile (Protected Route)

**GET** `http://localhost:3000/api/auth/profile`

**Option A - Using Cookies (Recommended):**

- No additional headers needed if cookies are enabled in your client

**Option B - Using Authorization Header:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

✅ **Expected Response:** Status 200

- Returns current user profile

---

### 4. Get All Customers

**GET** `http://localhost:3000/api/customers`

**Optional Query Parameters:**

- `?page=1`
- `&limit=10`
- `&username=test`
- `&email=test@example.com`

✅ **Expected Response:** Status 200

- Returns list of customers with pagination

---

### 5. Get Customer by ID

**GET** `http://localhost:3000/api/customers/{customer_id}`

Replace `{customer_id}` with actual MongoDB ObjectId

✅ **Expected Response:** Status 200

- Returns single customer data

---

### 6. Create Customer (Protected)

**POST** `http://localhost:3000/api/customers`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**Body (JSON):**

```json
{
  "username": "newcustomer",
  "email": "new@example.com",
  "password": "NewPass123",
  "first_name": "New",
  "last_name": "Customer"
}
```

✅ **Expected Response:** Status 201

- Returns created customer data

---

### 7. Update Customer (Protected)

**PUT** `http://localhost:3000/api/customers/{customer_id}`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**Body (JSON):**

```json
{
  "first_name": "Updated",
  "last_name": "Name",
  "email": "updated@example.com"
}
```

✅ **Expected Response:** Status 200

- Returns updated customer data

---

### 8. Delete Customer (Protected)

**DELETE** `http://localhost:3000/api/customers/{customer_id}`

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

✅ **Expected Response:** Status 200

- Returns success message

---

### 9. Refresh Token

**POST** `http://localhost:3000/api/auth/refresh`

**Option A - Using Cookies (Automatic):**

- No body needed

**Option B - Using Body:**

```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
}
```

✅ **Expected Response:** Status 200

- Returns new access and refresh tokens

---

### 10. Logout

**POST** `http://localhost:3000/api/auth/logout`

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

✅ **Expected Response:** Status 200

- Clears cookies
- Returns success message

---

## Testing Flow

### Recommended Testing Sequence:

1. **Register** → Get tokens
2. **Login** → Verify login works
3. **Get Profile** → Test authentication
4. **Create Customer** → Test protected route
5. **Get All Customers** → Verify creation
6. **Update Customer** → Test update
7. **Delete Customer** → Test deletion
8. **Refresh Token** → Test token refresh
9. **Logout** → Clear session

---

## Postman Settings

### Enable Cookie Management:

1. Go to Settings → General
2. Enable "Automatically follow redirects"
3. Enable "Send cookies"

### Save Tokens Automatically:

In Tests tab, add:

```javascript
// Save access token
if (pm.response.json().data?.accessToken) {
  pm.environment.set("accessToken", pm.response.json().data.accessToken);
}

// Save refresh token
if (pm.response.json().data?.refreshToken) {
  pm.environment.set("refreshToken", pm.response.json().data.refreshToken);
}
```

### Use Saved Token:

In Authorization tab:

- Type: Bearer Token
- Token: `{{accessToken}}`

---

## Common Error Responses

### 400 - Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "errors": [
      "Username is required",
      "Password must be at least 8 characters..."
    ]
  }
}
```

### 401 - Unauthorized

```json
{
  "success": false,
  "message": "Access token required"
}
```

### 403 - Forbidden

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 404 - Not Found

```json
{
  "success": false,
  "message": "Customer not found"
}
```

### 409 - Conflict

```json
{
  "success": false,
  "message": "Username already exists"
}
```

---

## Tips

1. **Use Environment Variables** in Postman for base URL and tokens
2. **Enable Cookie Jar** to automatically handle cookies
3. **Create a Collection** with all endpoints
4. **Use Pre-request Scripts** to automatically refresh expired tokens
5. **Save successful responses** as examples for documentation

---

## Health Check

**GET** `http://localhost:3000/health`

Quick check if server is running:

```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2024-11-12T..."
}
```
