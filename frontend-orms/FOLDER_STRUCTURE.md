# Frontend ORMS - Complete Folder Structure

```
frontend-orms/
│
├── node_modules/                    # Dependencies (after npm install)
│
├── public/                          # Static assets
│
├── src/                            # Source code
│   ├── assets/                     # Images, icons, etc.
│   │
│   ├── components/                 # Reusable components
│   │   └── ProtectedRoute.jsx     # Route guard for authenticated routes
│   │
│   ├── contexts/                   # React context providers
│   │   └── AuthContext.jsx        # Authentication state management
│   │
│   ├── pages/                      # Page components
│   │   ├── Home.jsx               # Landing page
│   │   ├── Login.jsx              # Login page
│   │   ├── Register.jsx           # Registration page
│   │   └── Dashboard.jsx          # Protected dashboard page
│   │
│   ├── services/                   # API and external services
│   │   └── api.js                 # Axios configuration & API endpoints
│   │
│   ├── App.css                     # App-specific styles
│   ├── App.jsx                     # Main app component with routing
│   ├── index.css                   # Global styles with Tailwind
│   └── main.jsx                    # React entry point
│
├── .gitignore                      # Git ignore file
├── eslint.config.js                # ESLint configuration
├── index.html                      # HTML entry point
├── package.json                    # Dependencies and scripts
├── package-lock.json               # Lock file for dependencies
├── vite.config.js                  # Vite configuration
├── README.md                       # Original readme
```

## Files Created/Modified

### New Files Created:

1. `src/services/api.js` - API service with Axios
2. `src/contexts/AuthContext.jsx` - Authentication context
3. `src/components/ProtectedRoute.jsx` - Route protection component
4. `src/pages/Home.jsx` - Landing page
5. `src/pages/Login.jsx` - Login page
6. `src/pages/Register.jsx` - Registration page
7. `src/pages/Dashboard.jsx` - Dashboard page
8. `tailwind.config.js` - Tailwind configuration
9. `postcss.config.js` - PostCSS configuration
10. `INSTALLATION.md` - Quick installation guide
11. `SETUP_GUIDE.md` - Complete setup documentation

### Modified Files:

1. `src/App.jsx` - Updated with routing
2. `src/App.css` - Simplified for Tailwind
3. `src/index.css` - Added Tailwind directives

## Key Features Implemented

### 1. Authentication System

- Login with username/password
- User registration with validation
- JWT token management
- Automatic token refresh
- Secure logout

### 2. Routing Structure

- `/` - Home/Landing page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Protected dashboard (requires auth)

### 3. Protected Routes

- Dashboard requires authentication
- Automatic redirect to login if not authenticated
- Loading state while checking auth

### 4. API Integration

- Centralized Axios configuration
- Automatic token injection
- Token refresh on 401 errors
- Error handling

### 5. UI/UX Design

- Gaming-themed dark interface
- Responsive design (mobile-friendly)
- Smooth animations and transitions
- Blataditz brand styling

## Component Hierarchy

```
App (Router + AuthProvider)
├── Home (Public)
├── Login (Public)
├── Register (Public)
└── Dashboard (Protected)
    └── ProtectedRoute wrapper
```

## State Management

- **Global State**: AuthContext
  - user (current user object)
  - loading (auth check status)
  - error (error messages)
  - login() method
  - register() method
  - logout() method
  - checkAuth() method

## API Endpoints Used

### Authentication:

- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout`
- GET `/api/auth/profile`
- GET `/api/auth/verify`
- POST `/api/auth/refresh`

### Customers:

- GET `/api/customers`
- GET `/api/customers/:id`
- PUT `/api/customers/:id`
- DELETE `/api/customers/:id`

## Styling Approach

- **Primary**: Tailwind CSS utility classes
- **Theme**: Dark gaming theme
- **Colors**:
  - Red (#ef4444) - Primary brand
  - Dark gradients (gray-900 → slate-900 → black)
  - Accent colors for categories
- **Typography**: Inter font family
- **Effects**: Hover states, transitions, shadows, glows
