import express from "express";
import userRoutes from "./routes/users.js";
import businessRoutes from "./routes/business.js";
import salesRoutes from "./routes/sales.js";
import authRoutes from "./routes/auth.js"
import dashboardRoutes from "./routes/dashboard.js"
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();


// Create an Express application instance
const app = express();

//Connect to frontend
app.use(cors({
  origin: "http://localhost:5173", //Server API endpoint
  credentials: true,
}));

// Middleware to parse JSON request bodies and parse cookies
app.use(express.json());
app.use(cookieParser());

// Mount routers

app.use("/business", businessRoutes);
app.use("/sales", salesRoutes);
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);

// Optional debug logs, only in development
if (process.env.NODE_ENV === "development") {
  app.use("/users", userRoutes);
  //console.log("userRoutes:", userRoutes);
  //console.log("businessRoutes:", businessRoutes);
  //console.log("salesRoutes:", salesRoutes);
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
