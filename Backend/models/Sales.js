import pool from "./db.js"

//Creating functions to query the table sales
export async function queryColumn(column) {
    try {
        const result = await pool.query(`SELECT ${column} FROM sales`);
        return result.rows;
    } catch (err) {
        console.error(`Error getting ${column}`, err)
        throw err;
    }
}

//Querying Sales rows from the table sales
export const getSales = () => queryColumn("*");

//Querying Sales ids rows from the table sales
export const getSalesIds = () => queryColumn("id");

//Querying Sales ids rows from the table sales
export const getBusinessSaleIds = () => queryColumn("business_id");

//Querying Order Number rows from the table sales
export const getOrderNumber = () => queryColumn("order_number");

//Querying Customer Name rows from the table sales
export const getCustomerNames = () => queryColumn("customer_name");

//Querying Product Name rows from the table sales
export const getProductNames = () => queryColumn("product_name");

//Querying Sale Price rows from the table sales
export const getSalePrices = () => queryColumn("sale_price");