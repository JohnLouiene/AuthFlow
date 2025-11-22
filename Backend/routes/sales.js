import express from "express"
import {
    getSales, 
    getSalesIds, 
    getBusinessSaleIds, 
    getOrderNumber, 
    getCustomerNames, 
    getProductNames, 
    getSalePrices} 
    from "../models/Sales.js"
import { 
    addRoute } 
    from "../controllers/SalesController.js";


//Initialize a new router
const router = express.Router();

//Get all sales and return as json
addRoute(router, '/', getSales);

//Get all sales and return as json
addRoute(router, '/ids', getSalesIds);

//Get all sales and return as json
addRoute(router, '/business-ids', getBusinessSaleIds);

//Get all sales and return as json
addRoute(router, '/order-number', getOrderNumber);

//Get all sales and return as json
addRoute(router, '/customer-names', getCustomerNames);

//Get all sales and return as json
addRoute(router, '/product-names', getProductNames);

//Get all sales and return as json
addRoute(router, '/sale-prices', getSalePrices);

export default router;