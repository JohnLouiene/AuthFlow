import pool from "./db.js"

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
export const getBusinesses = () => queryColumn("*");

//Querying Business Business Id rows from the table business
export const getBusinessIds = () => queryColumn("id");

//Querying Business User Ids rows from the table business
export const getBusinessUserIds = () => queryColumn("user_id");

//Querying Business Name rows from the table business
export const getBusinessNames = () => queryColumn("business_name");

