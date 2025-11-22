import pool from "./db.js"
//NOTE: REMOVE THIS ROUTE LATER, REMOVE GET OR ADD JWT TOKENS

//Creating functions to query the table users
async function queryColumn(column) {
    try {
        const result = await pool.query(`SELECT ${column} FROM users`);
        return result.rows;
    } catch (err) {
        console.error(`Error getting ${column}`, err)
        throw err;
    }
}

//Querying User rows from the table users
export const getUsers = () => queryColumn("*");

//Querying User IDs from the table users
export const getUserIds = () => queryColumn("id");

//Querying Usernames from the table users
export const getUsernames = () => queryColumn("username");

//Querying passwords from the table users
export const getPasswords = () => queryColumn("password");

