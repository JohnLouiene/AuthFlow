# Progress Log

## 2025-10-28
- Created ERD and normalized to 3NF
- Created DB schema and ERD for user, business and sales table.
- Created a frontend repo and initialized React Vite project.
- Created a backend repo and initialized Express server.
- Started documenting architecture in architecture.md.

## 2025-10-29
- Created postgres server and added the `users` table
- Added basic attributes to the table (ie. `id`, `username`, `password`).
- Connected postgres to backend using dotenv for environmental variables
- Configured the connection pool in models/db.js using pg.Pool
- Added model functions in models/User.js to query the database (getUsers, getUserIds, etc.).
- Added routes in routes/users.js to call model functions and return JSON responses.
- Exported the router and mounted it in app.js for basic routing and server listening.
- Added basic error handling in routes for database queries.

> Notes / Clarifications
-db.js holds the pool; User.js holds query functions — you already did this separation correctly.
-Routes are now acting as your internal API endpoints (e.g., /users, /users/ids).
-app.js is fully set up to receive requests and forward them to the user router.
-You haven’t implemented authentication/password hashing yet — the /passwords route is for learning only. (IMPORTANT DO THIS NEXT TIME) (DONE)

## 2025-10-31
- Added tables for sales and business in the database
- Added models and routes for business and sales
- Mounted routes in app.js
- Refactored models and routes
- Cleaned up app.js

## 2025-11-05
- Tested server connection and database queries
- Added auth model and routes for register/login
- Implemented bcrypt password hashing and safe user response
- Created reusable addRoute for GET routes in users, business, and sales
- Tested endpoints with Postman
- Reviewed dynamic SQL, parameterized queries, and HTTP methods
- Updated package.json and confirmed Node ES module usage

## 2025-11-06
- Added CORS to connect backend Express server to frontend React Vite.
- Tested API connections for authentication and routes of registration and login.
- Created Basic Login page for testing login route.

## 2025-11-06
- Code Review and cleaning up senstive info on the repository

## 2025-11-10
- Created registration page for testing route for registration.
- Updated frontend with react-router-dom to include page navigation.
- Created routes in login and registration to switch between pages.
- Created route in login to authenticate and navigate to dashboard.

## 2025-11-13
- Implemented JWT authentication for login and registration routes.
- Created authenticateToken middleware to protect backend routes.
- Updated frontend to store JWT and fetch protected dashboard data.
- Added ProtectedRoute in React to restrict dashboard access for unauthorized users.
- Implemented logout functionality clearing token and redirecting to login.
- Tested full login → dashboard flow and confirmed route protection works.

## 2025-11-18
- Integrated Redis for refresh token storage in backend.
- Updated backend login route to generate refresh tokens and store them in Redis with 7-day expiry.
- Set refresh token as httpOnly cookie for secure storage.
- Created backend refresh route to verify refresh token, issue new access and refresh tokens, and update Redis and cookie.
- Fixed backend issues with Redis key formatting and cookie parsing.
- Frontend login flow updated to fetch access token from backend; refresh token handled via cookie (no hook yet needed).

## 2025-11-20

* Added Zod validation middleware for request body validation in backend (`validate` function).
* Updated registration controller to use validated input (`req.validated`) and handle duplicate username/email with custom error messages.
* Fixed issue where password was missing in controller destructuring, preventing bcrypt hashing.
* Standardized error responses with HTTP status codes (400 for validation/client errors, 401/403 for auth, 500 for server errors).
* Cleaned up backend logging of routes and routers for debugging.
* Verified registration and login flows work with Zod validation and proper error handling.
* Simplified error response to a single `error` string for frontend compatibility.
* Ensured frontend receives meaningful feedback for invalid inputs, duplicate accounts, or authentication failures.

