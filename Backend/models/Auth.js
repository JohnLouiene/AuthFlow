import pool from "./db.js"

//Query search user by username
export async function getUserByUsername(username) {
    try{
        const result = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );
        return result.rows[0];
    } catch (err) {
        console.error(`Error finding ${username}`, err)
        throw err;
    }
}

//Create or Register new user
export async function createUser(username, email, hashedPassword) {
    try{
        const result = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, hashedPassword]
        );
        return result.rows[0];
    } catch (err) {
        console.error(`Error creating new user ${username}`, err)
        throw err;
    }
}