import express from "express";

const router = express.Router();

export const tokenAuthentication = async (req, res) => {
    try{
        res.json({
        message: `Welcome to your dashboard, ${req.user.username}!`,
        user: req.user,
        });
    } catch(err){
        console.error(err);
        res.status(500).json({error: "Server Error"})
    }
}

export default router;
