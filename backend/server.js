const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/error");
const compression = require("compression");
const mongoose = require("mongoose");

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
  "https://explorewithlocals.vercel.app", // ✅ YOUR ACTUAL FRONTEND DOMAIN
  "https://ewlfinals-production.up.railway.app", // ✅ YOUR BACKEND DOMAIN
  "http://localhost:3000",
  "http://localhost:5000",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // More flexible matching for Vercel domains
    if (
      allowedOrigins.some((allowedOrigin) => {
        return (
          origin === allowedOrigin ||
          origin.includes(".vercel.app") || // Allow all Vercel subdomains
          origin.includes("localhost")
        ); // Allow local development
      })
    ) {
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
    "Accept",
  ],
  exposedHeaders: ["x-auth-token"],
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly - IMPORTANT FIX
app.options("*", cors(corsOptions));

// Add manual CORS middleware as backup
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Allow all Vercel domains and your specific domains
  if (
    origin &&
    (origin.includes("vercel.app") ||
      origin.includes("localhost") ||
      origin === "https://explorewithlocals.vercel.app" ||
      origin === "https://ewlfinals-production.up.railway.app")
  ) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-auth-token, X-Requested-With, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Expose-Headers", "x-auth-token");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

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

  // Join user's room
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Handle sending messages
  socket.on("sendMessage", (message) => {
    const { receiverId } = message;
    socket.to(receiverId).emit("newMessage", message);
  });

  // Handle typing indicators
  socket.on("typing", (data) => {
    socket.to(data.receiverId).emit("userTyping", {
      senderId: data.senderId,
      isTyping: data.isTyping,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Make io accessible to our router
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Test endpoints for CORS verification
app.get("/api/test-cors", (req, res) => {
  res.json({
    success: true,
    message: "CORS is working!",
    timestamp: new Date().toISOString(),
    allowedOrigins: allowedOrigins,
  });
});

app.get("/api/test-registration", (req, res) => {
  res.json({
    success: true,
    message: "Registration endpoint is accessible",
    method: "POST",
    requiredFields: ["name", "email", "password", "role"],
  });
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
      corsEnabled: true,
      allowedOrigins: allowedOrigins,
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
    cors_info: {
      allowedOrigins: allowedOrigins,
      frontend_domain: "https://explorewithlocals.vercel.app",
      backend_domain: "https://ewlfinals-production.up.railway.app",
    },
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
    cors: "enabled",
    frontend_url: "https://explorewithlocals.vercel.app",
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

// For Railway deployment (remove Vercel-specific export)
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(
    `CORS enabled for: ${process.env.CLIENT_URL || "http://localhost:3000"}`
  );
  console.log(
    `Database status: ${
      mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    }`
  );
  console.log(`Frontend URL: https://explorewithlocals.vercel.app`);
  console.log(`Backend URL: https://ewlfinals-production.up.railway.app`);
});

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
