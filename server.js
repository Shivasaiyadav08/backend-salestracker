import express from "express";
import salesRouter from "./routes/salesRoute.js"; // renamed import
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import authRouter from "./routes/authRoute.js"
import connectDB from "./config/configdb.js";


connectDB()
const app = express();

// ===== Middleware =====
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // include PUT
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ===== Routes =====
app.use("/api/auth",authRouter);
app.use("/api/sales", salesRouter); // attach all routes from salesRoute

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
