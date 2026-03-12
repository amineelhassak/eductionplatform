import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { config } from "./config";
import routes from "./routes";
import { errorHandler } from "./middlewares";

const app = express();

// ---------------------
// Security Middleware
// ---------------------

// Helmet: sets various HTTP security headers
app.use(helmet());

// CORS: allow requests from the frontend
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true, // allow cookies
  }),
);

// Rate limiting on auth endpoints to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.nodeEnv === "development" ? 100 : 20, // generous in dev, strict in prod
  message: {
    message: "Too many authentication attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ---------------------
// Body Parsing
// ---------------------
app.use(express.json({ limit: "10kb" })); // limit body size
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ---------------------
// Routes
// ---------------------
app.use("/api/auth", authLimiter); // rate-limit auth routes
app.use("/api", routes);

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// ---------------------
// Error Handling
// ---------------------
app.use(errorHandler);

// ---------------------
// Start Server
// ---------------------
app.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`);
  console.log(`   Environment: ${config.nodeEnv}`);
});

export default app;
