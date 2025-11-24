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

// Railway-specific configuration
app.set("trust proxy", 1);
app.enable("trust proxy");

// ========== GUARANTEED CORS FIX ==========
// Apply CORS to ALL requests at the very top

// 1. First, handle OPTIONS (preflight) for ALL routes
app.options("*", cors());

// 2. Apply CORS middleware to ALL routes
app.use(
  cors({
    origin: [
      "https://explorewithlocals.vercel.app",
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-auth-token",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// 3. Manual CORS headers as backup (remove if not needed after testing)
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://explorewithlocals.vercel.app",
    "http://localhost:3000",
    "http://localhost:5000",
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-auth-token, X-Requested-With, Accept, Origin"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  // Handle preflight
  if (req.method === "OPTIONS") {
    console.log("🛫 Preflight request handled for:", req.url);
    return res.status(200).end();
  }

  next();
});

// Enable gzip compression for responses
app.use(compression());

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Socket.io configuration
const io = socketio(server, {
  cors: {
    origin: [
      "https://explorewithlocals.vercel.app",
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    credentials: true,
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${
      req.headers.origin
    }`
  );
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

// Test CORS endpoint
app.get("/api/cors-test", (req, res) => {
  res.json({
    success: true,
    message: "CORS is working!",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/cors-test", (req, res) => {
  res.json({
    success: true,
    message: "POST CORS is working!",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
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
      cors: "enabled",
      origin: req.headers.origin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Health check failed",
      error: error.message,
    });
  }
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
    origin: req.headers.origin,
  });
});

// Error handler middleware
app.use(errorHandler);

// Handle 404 routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

const PORT = process.env.PORT || 5000;

// Start server listening on all interfaces (CRITICAL FOR RAILWAY)
server.listen(PORT, "0.0.0.0", () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
  console.log(`🌐 CORS enabled for: https://explorewithlocals.vercel.app`);
  console.log(
    `🗄️ Database status: ${
      mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    }`
  );
  console.log(`📍 Listening on: 0.0.0.0:${PORT}`);
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
