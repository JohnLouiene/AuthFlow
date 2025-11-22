import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) return res.status(404).json({error: "Access Denied, no token provided"});
    

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if(err) return res.status(404).json({error: "Invalid Token"});
        req.user = user;
        next();
    });
};

/*
Usage Example:
import { authenticateToken } from "../middleware/authMiddleware.js";

router.get("/dashboard", authenticateToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.username}` });
});
*/