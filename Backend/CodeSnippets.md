# Models

## Models/db.js

```javascript
//Creating a connection pool to the database in postgres
const pool = new pg.Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
});
```

## Models/Users.js

```javascript
//Creating functions to query the database Users
export async function getUsers() { //Export exports the function, async is used to pause the request until a promise is resolved
    try{
        const result = await pool.query("SELECT * FROM users") //We query the database using await to wait for the promised data
        return result.rows; //The function returns all rows of the table users
    } catch(err){
        console.error("Error getting users:", err)
        throw err;
    }
}

//
//Or use for multiple queries
//

//Creating functions to query the table business
async function queryColumn(column) {
    try {
        const result = await pool.query(`SELECT ${column} FROM business`);
        return result.rows;
    } catch (err) {
        console.error(`Error getting ${column}`, err)
        throw err;
    }
}

//Querying Business rows from the table business
export const getUsers = () => queryColumn("*");
```
## Creating a function for multiple models.

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

# Routes

## users.js

```javascript
//Get all users and return as json
router.get('/', async(req, res) => { 
    try{
        const users = await getUsers(); //Use getUsers to await data and input into users
        res.json(users); //Return data as javascript object notation
    } catch (err){ //Error handling
        console.error("Failed to get users:", err); //Log error into terminal
        res.status(500).json({error: "Failed to get users"}); //Respond with a status 500 and return Failed to get users
    }
});

//
//Or use for multiple queries
//

//Adding routes
export function addRoute(router, route, queryFn) {
    router.get(route, async(req, res) => {
    try{
        const data = await queryFn();
        res.json(data);
        console.log(`Route added: GET ${route}`);
    } catch (err){
        console.error(`Failed to get data for ${route}:`, err);
        res.status(500).json({error: `Failed to get data for ${route}`});
    }
});
}

//Initialize a new router
const router = express.Router();

//Get all users and return as json
addRoute(router, '/', getUsers);

//
//Modified version that supports optional query parameters
//

export function addRoute(router, route, queryFn) {
    router.get(route, async (req, res) => {
        try {
            // Pass query parameters to the model function
            const data = await queryFn(req.query);
            res.json(data);
        } catch (err) {
            console.error(`Failed to get data for ${route}:`, err);
            res.status(500).json({ error: `Failed to get data for ${route}` });
        }
    });
}

//Then in your model, queryFn can handle filtering:

// sales.model.js
export async function getSales(filter = {}) {
    let query = "SELECT * FROM sales";
    const values = [];
    const conditions = [];

    if (filter.business_id) {
        values.push(filter.business_id);
        conditions.push(`business_id = $${values.length}`);
    }

    if (conditions.length) {
        query += " WHERE " + conditions.join(" AND ");
    }

    const result = await pool.query(query, values);
    return result.rows;
}
```

## Main

## app.js

```javascript
import express from "express"
import userRoutes from "./routes/users.js"
import businessRoutes from "./routes/business.js"

// Debug: check the imported router
console.log("userRoutes", userRoutes);
console.log("businessRoutes:", businessRoutes);
//Or use this to keep it in development mode
// Optional debug logs, only in development
if (process.env.NODE_ENV === "development") {
  console.log("userRoutes:", userRoutes);
  console.log("businessRoutes:", businessRoutes);
}

/*Creates an Express application instance kind of like a main server object where we 
attach routes, middleware and configuration
*/
const app = express(); 

//parses incoming JSON requests and makes request bodies available in your routes.
// Middleware to parse JSON
app.use(express.json())

/*
Mounts the user router at the path /users.
All routes inside userRoutes will now be prefixed with /users.
ex. 
Router Path     Full Url Path
    /               /users/
    /ids            /users/ids
*/
app.use("/users", userRoutes);
app.use("/business", businessRoutes);

// Start server

/*
Chooses which port your server listens on.
process.env.PORT is often set in production (like Heroku).
Defaults to 3000 if no environment variable is set.
*/

const PORT = process.env.PORT || 3000;

/*Starts the server and begins listening for incoming HTTP requests.
Callback function runs once the server is ready.*/

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
```
