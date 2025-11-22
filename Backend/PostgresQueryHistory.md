```sql

-- 2025-10-29
-- users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2025-10-31
-- business table
CREATE TABLE business (
	id serial PRIMARY KEY,
	user_id INTEGER NOT NULL,
	business_name VARCHAR(100) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- sales table
CREATE TABLE sales (
	id serial PRIMARY KEY,
	business_id INTEGER NOT NULL,
	sale_date TIMESTAMPTZ NOT NULL,
	order_number INTEGER NOT NULL,
	customer_name VARCHAR(100),
	product_name VARCHAR(100),
	sale_price DECIMAL(10,2) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_business FOREIGN KEY (business_id) 
		REFERENCES business(id) 
		ON DELETE CASCADE
);