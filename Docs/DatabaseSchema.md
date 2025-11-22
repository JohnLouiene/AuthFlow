# Database Schema Documentation

This document describes the tables, columns, and relationships for the project database.

---

## Users Table

- Stores all user accounts.

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Business Table

- Stores all businesses registered

```sql
CREATE TABLE business (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    business_name VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Sales Table

- Stores all sales made by a business

```sql
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    business_id INTEGER NOT NULL,
    sale_date TIMESTAMP NOT NULL,
    order_number INT NOT NULL,
    customer_name VARCHAR,
    product_name VARCHAR,
    sale_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_business FOREIGN KEY(business_id) REFERENCES business(id) ON DELETE CASCADE
);
```

## Relationships

- users.id → business.user_id (1-to-many)

- business.id → sales.business_id (1-to-many)