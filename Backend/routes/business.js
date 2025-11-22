import express from "express"
import { 
    getBusinesses, 
    getBusinessIds, 
    getBusinessNames, 
    getBusinessUserIds } 
    from "../models/Business.js";
import { 
    addRoute } 
    from "../controllers/BusinessController.js";


//Initialize a new router
const router = express.Router();

//Get all businesses and return as json
addRoute(router, '/', getBusinesses);

//Get all business ids and return as json
addRoute(router, '/ids', getBusinessIds);

//Get all business user ids and return as json
addRoute(router, '/user-ids', getBusinessUserIds);

//Get all business names and return as json
addRoute(router, '/names', getBusinessNames);

export default router;