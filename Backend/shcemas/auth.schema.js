//Schemas for validating client side queries and some custome error messages
import z from 'zod';

export const loginSchema = z.object({
    username: z
    .string()
    .min(3, 
        "Username must be 3 characters or more")
    .regex(/^[a-zA-Z0-9._]+$/, 
        "Username can only contain letters, numbers, dots, and underscores"),
        
    password: z
    .string()
    .min(6, 
        "Password must be at least 6 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{}|;:'",.<>/?]).{8,}$/, 
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"),
})

export const registerSchema = z.object({
    username: z
    .string()
    .min(3, 
        "Username must be 3 characters or more")
    .regex(/^[a-zA-Z0-9._]+$/, 
        "Username can only contain letters, numbers, dots, and underscores"),

    email: z
    .email(),

    password: z
    .string()
    .min(6,
        "Password must be at least 6 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{}|;:'",.<>/?]).{8,}$/, 
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"),
})