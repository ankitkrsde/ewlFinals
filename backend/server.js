const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/error");
const compression = require("compression");

// Load env vars
dotenv.config();

// Enhanced database connection with better error handling
const connectDBWithRetry = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.log("🔄 Retrying connection in 5 seconds...");
    setTimeout(connectDBWithRetry, 5000);
  }
};

connectDBWithRetry();

const app = express();
const server = http.createServer(app);

// Enable gzip compression for responses
app.use(compression());

// Enhanced CORS configuration for production
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000",
  "https://*.vercel.app",
  "https://explore-with-locals.vercel.app", // Your actual frontend
  "https://explore-with-locals-frontend.vercel.app", // Common naming pattern
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("🚫 Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-auth-token",
    "X-Requested-With",
  ],
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options("*", cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Socket.io configuration
const io = socketio(server, {
  cors: corsOptions,
  transports: ["websocket", "polling"],
});

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Socket.io for real-time messaging
io.on("connection", (socket) => {
  console.log("New WebSocket connection");
  // ... your existing socket code
});

// Make io accessible to our router
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const guideRoutes = require("./routes/guides");
const bookingRoutes = require("./routes/bookings");
const reviewRoutes = require("./routes/reviews");
const messageRoutes = require("./routes/messages");
const adminRoutes = require("./routes/admin");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/guides", guideRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);

// Enhanced health check with DB status
app.get("/api/health", async (req, res) => {
  try {
    const dbStatus =
      mongoose.connection.readyState === 1 ? "connected" : "disconnected";

    res.status(200).json({
      success: true,
      message: "Server is running",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: dbStatus,
      clientUrl: process.env.CLIENT_URL,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Health check failed",
      error: error.message,
    });
  }
});

// Debug endpoint to check environment variables (remove in production if needed)
app.get("/api/debug", (req, res) => {
  res.json({
    node_env: process.env.NODE_ENV,
    client_url: process.env.CLIENT_URL,
    db_connected: mongoose.connection.readyState === 1,
    has_jwt_secret: !!process.env.JWT_SECRET,
    has_mongodb_uri: !!process.env.MONGODB_URI,
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Explore with Locals Backend API",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Error handler middleware
app.use(errorHandler);

// Handle 404 routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

// For Vercel, we need to export the app
if (process.env.NODE_ENV === "production") {
  module.exports = app;
} else {
  server.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
    console.log(
      `CORS enabled for: ${process.env.CLIENT_URL || "http://localhost:3000"}`
    );
    console.log(
      `Database status: ${
        mongoose.connection.readyState === 1 ? "connected" : "disconnected"
      }`
    );
  });
}

process.on("unhandledRejection", (err, promise) => {
  console.log(`Unhandled Rejection: ${err.message}`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
