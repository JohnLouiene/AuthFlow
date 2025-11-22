import express from "express"
import {
    getUsers, 
    getUserIds, 
    getUsernames, 
    getPasswords } 
    from "../models/Users.js"

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

//Get all user IDs and return as json
addRoute(router, '/ids', getUserIds);

//Get all usernames and return as json
addRoute(router, '/usernames', getUsernames);

//Get all passwords and return as json (for learning only — never expose in production!)
//addRoute(router, '/password', getPasswords);

export default router;