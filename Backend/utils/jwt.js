import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email
        },
        JWT_SECRET,
        { expiresIn: '1hr' }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign({
        id: user.id,
    },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (err) {
        return null;
    };
};