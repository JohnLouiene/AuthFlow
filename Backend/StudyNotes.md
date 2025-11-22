### Key Markdown Features in This Example:
- `#` for main heading, `##` for subheading, `###` for smaller sections.
- `>` for blockquotes (good for notes or reminders).
- Triple backticks ````` for code blocks; optionally specify language for syntax highlighting (`javascript` in this case).
- Lists (`-` or `*`) for tips or steps.

# PostgreSQL + Node.js Notes

---

## 1. Setting Up the Connection Pool

> Use a connection pool to efficiently manage multiple connections to the database.

```javascript
const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
});
```
### Tips

- Always use environment variables for credentials.

- Close the pool on app shutdown:
> pool.end();

---

## 2. Querying the Database

Use pool.query() to execute SQL statements.

```javascript
const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
console.log(result.rows);
```

### Tips

- Use parameterized queries ($1, $2) to prevent SQL injection.
- result.rows contains the returned data.

---

## 3. Error Handling

```javascript
try {
    const result = await pool.query('SELECT * FROM users');
} catch (err) {
    console.error('Database query error:', err);
}
```

### Tips

- Always handle errors to avoid crashing your server.
- Consider using a global error logger.

---

## 4. Transactions

> Transactions help maintain data integrity when multiple queries must succeed together.

```javascript
const client = await pool.connect();

try {
    await client.query('BEGIN');
    await client.query('INSERT INTO accounts(user_id, balance) VALUES($1, $2)', [id, 100]);
    await client.query('UPDATE accounts SET balance = balance - 50 WHERE user_id = $1', [id]);
    await client.query('COMMIT');
} catch (err) {
    await client.query('ROLLBACK');
    throw err;
} finally {
    client.release();
}
```
### Tips
- Always COMMIT or ROLLBACK to ensure data consistency.
- Release the client after the transaction.

---

## 5. Additional Notes

- Use .env for all sensitive info.
- Consider using pg-promise or knex.js for complex queries.
- Monitor pool size and connection limits in production.

## 6. Creating a function for multiple models.

- You can make it safer and more flexible by:
>Allowing an array of column names,
>Sanitizing them to prevent injections.

```javascript
//export it as a class (This is for safe columns)
export async function queryTable(table, columns = ["*"]) {
  // Ensure table and column names are safe identifiers
  const safeTable = table.replace(/[^a-zA-Z0-9_]/g, ""); // whitelist letters, numbers, underscore
  const safeColumns = columns.map(c => c.replace(/[^a-zA-Z0-9_]/g, "")).join(", ");

  const result = await pool.query(`SELECT ${safeColumns} FROM ${safeTable};`);
  return result.rows;
}
```
> Example Usage

```javascript
// Get all rows
const allBusinesses = await queryTable("business");

// Get only certain columns
const businessNames = await queryTable("business", ["business_name"]);
const businessUserIds = await queryTable("business", ["user_id"]);
const users = await queryTable("users", ["id", "username"]);
```

> This is for small projects

```javascript
//Creating functions to query the table sales
async function queryColumn(column) {
    try {
        const result = await pool.query(`SELECT ${column} FROM sales`);
        return result.rows;
    } catch (err) {
        console.error(`Error getting ${column}`, err)
        throw err;
    }
}

//Querying Sales rows from the table sales
export const getColumn = () => queryColumn("ColumnName");
```

> This is for whitelisting

```javascript
//Optional: Whitelist columns

/*For extra safety (avoiding accidental SQL injection if column names ever come from variables):*/

async function queryColumn(column) {
    const allowedColumns = ["*", "id", "user_id", "business_name"];
    if (!allowedColumns.includes(column)) throw new Error("Invalid column name");

    try {
        const result = await pool.query(`SELECT ${column} FROM business`);
        return result.rows;
    } catch (err) {
        console.error(`Error getting ${column}`, err);
        throw err;
    }
}
```

> For multiple tables

```javascript
//Optional: Use one helper for all tables

//Later, you could create a generic queryTable(table, column) in a dbHelpers.js file:

export async function queryTable(table, column) {
    const result = await pool.query(`SELECT ${column} FROM ${table}`);
    return result.rows;
}

//Then your models become one-liners:

export const getUsers = () => queryTable("users", "*");
export const getBusinessNames = () => queryTable("business", "business_name");
```
--

## 8. Dynamic SQL
```javascript
async function queryColumn(column) {
    try {
        const result = await pool.query(`SELECT ${column} FROM business`);
        return result.rows;
    } catch (err) {
        console.error(`Error getting ${column}`, err)
        throw err;
    }
}

`SELECT ${column} FROM business` //Dynamic SQL
```

--
## 7. Parameterized Query to avoid SQL injections

```javascript
export async function createUser(username, email, hashedPassword) {
    try{
        const result = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            // $1, $2, $3 are placeholders for the actual values.
            // This ensures Postgres treats the values as data, not SQL code.
            // Prevents SQL injection, even if username, email, or hashedPassword contains malicious input.
            [username, email, hashedPassword]
            // These values are mapped to $1, $2, $3 respectively.
            // The database safely escapes them.
        );
        return result.rows[0];
    } catch (err) {
        console.error(`Error creating new user`, err)
        throw err;
    }
}
```




