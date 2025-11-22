import express from "express";
import { tokenAuthentication } from "../controllers/DashboardController.js";
import { authenticateToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// This route can only be accessed if you have a valid JWT
router.get("/", authenticateToken, tokenAuthentication);

export default router;
