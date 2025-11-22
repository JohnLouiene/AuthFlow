import express from "express"
import { validate } from "../middleware/Validate.js";
import { registerUser, loginUser, refresh } from "../controllers/AuthController.js";
import { loginSchema, registerSchema } from "../shcemas/auth.schema.js";

const router = express.Router();

//Register new user
router.post("/register", validate(registerSchema), registerUser);

//Login
router.post("/login", validate(loginSchema), loginUser);

//Refresh tokens
router.post("/refresh", refresh)

export default router;