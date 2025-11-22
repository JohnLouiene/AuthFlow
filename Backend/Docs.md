
---

## Runtime Environment

### Node.js

* A JavaScript runtime built on Chrome’s V8 engine that allows execution of JavaScript outside the browser. Provides the foundation for backend applications and server-side logic.

---

# Packages Installed

```bash
npm install express pg dotenv cors bcrypt jsonwebtoken redis zod
```

---

## Libraries

### Express

* Web framework for building APIs and applications.

### PG

* PostgreSQL client for Node.js, allows querying relational database.

### Dotenv

* Loads environment variables from `.env` into `process.env`.

### CORS

* Enables Cross-Origin Resource Sharing for frontend-backend communication.

### Bcrypt

* Hashes passwords securely for storage and comparison.

### JSONWebToken

* Generates and verifies JWTs for authentication.

### Redis

* In-memory key-value store used for storing refresh tokens securely.

### Zod

* Schema validation library for validating incoming request data.

---

## Environment Variables / Ports

Example `.env`:

```
PGUSER=postgres
PGHOST=localhost
PGDATABASE=mydb
PGPASSWORD=password
PGPORT=5432

ACCESS_TOKEN_SECRET=someaccesssecret
REFRESH_TOKEN_SECRET=somerefreshsecret

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redispassword

PORT=3000
NODE_ENV=development
```

---

## Middleware

### authenticateToken

* Verifies JWT from Authorization header.
* If valid → attaches `req.user` and calls `next()`.
* If missing or invalid → returns `401 Unauthorized` or `403 Forbidden`.

### validate

* Verifies request body using a Zod schema.
* If invalid → returns `400 Bad Request` with a generic error message: `"Invalid Data Entered"`.
* Attaches `req.validated` with parsed data for use in controllers.

---

## Routes

### `/auth`

* **POST `/register`** → create a new user with hashed password; returns JWT and optionally refresh token.
* **POST `/login`** → authenticate user, return JWT and set refresh token in cookie.
* **POST `/refresh`** → issue new access & refresh tokens using stored refresh token in Redis.

### `/dashboard`

* **GET `/`** → protected route, requires valid JWT.

---

## Controllers

```javascript
// =============================
// dashboardController.js
// =============================
export const tokenAuthentication = (req, res) => {
  res.json({
    message: `Welcome to your dashboard, ${req.user.username}!`,
    user: req.user,
  });
};

// =============================
// authController.js
// =============================
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.validated;

    const errors = [];

    const existingUser = await getUserByUsername(username);
    if (existingUser) errors.push({ field: "username", message: "Username already exists" });

    const existingEmail = await getUserByEmail(email);
    if (existingEmail) errors.push({ field: "email", message: "Email already exists" });

    if (errors.length > 0) {
      const combinedErrors = errors.map(err => `${err.field}: ${err.message}`).join(", ");
      return res.status(400).json({ error: combinedErrors });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(username, email, hashedPassword);

    const { password: _, ...safeUser } = newUser;
    const token = generateToken(safeUser);

    res.status(201).json({
      message: "New user created successfully",
      user: safeUser,
      token,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.validated;
    const user = await getUserByUsername(username);

    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Wrong Username or Password" });

    const { password: _, ...safeUser } = user;
    const token = generateToken(safeUser);
    const refreshToken = generateRefreshToken(safeUser);

    // Store refresh token in Redis
    await redis.set(refreshToken, safeUser.id, { EX: 7 * 24 * 60 * 60 });

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    res.json({ message: "Login successful", user: safeUser, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ error: "No refresh token provided" });

    const userId = await redis.get(refreshToken);
    if (!userId) return res.status(403).json({ error: "Invalid refresh token" });

    const user = await getUserById(userId);
    const { password: _, ...safeUser } = user;
    const token = generateToken(safeUser);

    res.json({ message: "Token refreshed", token });
  } catch (err) {
    console.error("Token refresh error:", err);
    res.status(500).json({ error: "Server error during token refresh" });
  }
};
```

---

## Models

```javascript
// =============================
// users.js
// =============================
export const getUsers = () => queryColumn("*");
export const getUserIds = () => queryColumn("id");
export const getUsernames = () => queryColumn("username");
export const getPasswords = () => queryColumn("password");

// Auth-specific functions
export async function getUserByUsername(username) {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  return result.rows[0];
}

export async function getUserByEmail(email) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
}

export async function createUser(username, email, hashedPassword) {
  const result = await pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
    [username, email, hashedPassword]
  );
  return result.rows[0];
}

export async function getUserById(id) {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
}
```

```javascript
// =============================
// business.js
// =============================
export const getBusinesses = () => queryColumn("*");
export const getBusinessIds = () => queryColumn("id");
export const getBusinessUserIds = () => queryColumn("user_id");
export const getBusinessNames = () => queryColumn("name");
```

```javascript
// =============================
// sales.js
// =============================
export const getSales = () => queryColumn("*");
export const getSalesIds = () => queryColumn("id");
export const getBusinessSaleIds = () => queryColumn("business_id");
export const getOrderNumber = () => queryColumn("order_number");
export const getCustomerNames = () => queryColumn("customer_name");
export const getProductNames = () => queryColumn("product_name");
export const getSalePrices = () => queryColumn("sale_price");
```

---

## Utilities

### jwt.js

```javascript
import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};
```

### redis.js

```javascript
import { createClient } from "redis";

const client = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

client.on("error", err => console.log("Redis Client Error", err));

await client.connect();

export default client;
```

---

## Notes on Error Handling

* **Validation errors:** use `400 Bad Request` (Zod / request body issues).
* **Authentication errors:** use `401 Unauthorized` (invalid login) or `403 Forbidden` (invalid refresh token).
* **Server errors:** use `500 Internal Server Error` (DB / bcrypt / Redis failures).
* **Frontend expects:** single `error` string or `errors: []` array depending on how you implement multi-error reporting.

---
