Perfect — your routes are now consistent and modular 👍
# **ArtanFinance API Documentation**

## **Base URL**

```
http://localhost:3000
```

---

## **Auth Routes** (`/auth`)

### **POST /auth/register**

**Description:** Register a new user.
**Request Body:**

```json
{
  "username": "newuser",
  "email": "new@example.com",
  "password": "mypassword"
}
```

**Response Example:**

```json
{
  "message": "New user created successfully",
  "user": { "id": 1, "username": "newuser", "email": "new@example.com" }
}
```

### **POST /auth/login**

**Description:** Log in an existing user.
**Request Body:**

```json
{
  "username": "newuser",
  "password": "mypassword"
}
```

**Response Example:**

```json
{
  "message": "Login Successful",
  "safeUser": { "id": 1, "username": "newuser", "email": "new@example.com" }
}
```

---

## **User Routes** (`/users`)

### **GET /users/**

Get all users.
**Response:**

```json
[
  { "id": 1, "username": "testuser", "email": "test@example.com" }
]
```

### **GET /users/ids**

Get all user IDs.
**Response:**

```json
[1, 2, 3]
```

### **GET /users/usernames**

Get all usernames.
**Response:**

```json
["testuser", "janedoe"]
```

### ⚠️ **GET /users/password**

**Learning only – do not use in production.**
**Response:**

```json
["$2b$10$HashedExample"]
```

---

## **Business Routes** (`/businesses`)

### **GET /businesses/**

Get all businesses.
**Response:**

```json
[
  { "id": 1, "name": "Artan Solutions", "user_id": 1 }
]
```

### **GET /businesses/ids**

Get all business IDs.
**Response:**

```json
[1, 2]
```

### **GET /businesses/user-ids**

Get user IDs linked to businesses.
**Response:**

```json
[1, 3, 5]
```

### **GET /businesses/names**

Get all business names.
**Response:**

```json
["Artan Solutions", "Orion Labs"]
```

---

## **Sales Routes** (`/sales`)

### **GET /sales/**

Get all sales.
**Response:**

```json
[
  { "id": 1, "business_id": 1, "order_number": "ORD001", "product_name": "Laptop", "sale_price": 899.99 }
]
```

### **GET /sales/ids**

Get all sale IDs.
**Response:**

```json
[1, 2, 3]
```

### **GET /sales/business-ids**

Get all business IDs tied to sales.
**Response:**

```json
[1, 2]
```

### **GET /sales/order-number**

Get all order numbers.
**Response:**

```json
["ORD001", "ORD002"]
```

### **GET /sales/customer-names**

Get all customer names.
**Response:**

```json
["Alice", "Bob"]
```

### **GET /sales/product-names**

Get all product names.
**Response:**

```json
["Laptop", "Headphones"]
```

### **GET /sales/sale-prices**

Get all sale prices.
**Response:**

```json
[899.99, 129.50]
```

---

✅ **Notes**

* All responses return JSON.
* Use `Content-Type: application/json` for POST requests.
* `/users/password` is **only for learning/debugging**; never use in a deployed API.
* Authentication currently uses plain responses — no tokens yet.

---

