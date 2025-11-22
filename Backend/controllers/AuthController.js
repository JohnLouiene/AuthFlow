import bcrypt from "bcrypt";
import redis from "../utils/redis.js";
import jwt from "jsonwebtoken"
import { 
    getUserByUsername, 
    createUser } 
    from "../models/Auth.js";
import { 
    generateToken, 
    generateRefreshToken } 
    from "../utils/jwt.js";

//Register new user and generate token
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.validated;

        //Find if user is already made in Database
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        //Encrypt Password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser(username, email, hashedPassword);

        //Note: remove hashed password
        const { password: _, ...safeUser } = newUser;

        const token = generateToken(safeUser);

        res.status(201).json({
            message:
                "New user created sucessfully",
            user: safeUser,
            token,
        });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ error: "Server error during registration" });
    }
};

//Login user and generate token
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.validated;

        //Find user in database
        const user = await getUserByUsername(username);

        if (!user) return res.status(404).json({ error: "User not found" });

        //If user is found, check if password entered matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(404).json({ error: "Wrong Username or Password" });

        //Hide password from API
        const { password: _, ...safeUser } = user;

        //Generate tokens
        const refreshToken = generateRefreshToken(safeUser);
        const token = generateToken(safeUser);

        //Refresh token set for 7 days
        await redis.set(
            `refresh:${safeUser.id}`,
            refreshToken,
            { EX: 60 * 60 * 24 * 7 } //7 days
        );

        //Save refresh token to cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/",
        });

        //Provide token to user
        res.json({
            message: "Login Successful",
            safeUser,
            token,
        })

    } catch (err) {
        console.log("Login error", err)
        res.status(500).json({ error: "Server error during login" })
    }
}

export const refresh = async (req, res) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;

        if (!oldRefreshToken)
            return res.status(401).json({ message: "No Refresh Token" });

        //Verify Token
        let decoded;
        try {
            decoded = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        } catch (err) {
            return res.status(403).json({ message: "Invalid refresh token" })
        }

        const userId = decoded.id;

        //Check redis stored token
        const storedToken = await redis.get(`refresh:${userId}`);

        if (!storedToken || storedToken !== oldRefreshToken) {
            return res.status(403).json({ message: "Expired or invalid refresh token" });
        }

        //Generate new tokens
        const newAccessToken = generateToken(decoded);
        const newRefreshToken = generateRefreshToken(decoded);

        //Update redis
        await redis.set(
            `refresh:${userId}`,
            newRefreshToken,
            { EX: 60 * 60 * 24 * 7 } //7 days
        );

        //Update Cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/",
        });

        return res.json({ token: newAccessToken })
    } catch (err) {
        console.error("Refresh Error", err);
        return res.status(500).json({ message: "Server error during refresh" })
    }
};
