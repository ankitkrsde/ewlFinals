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

// ========== PRE-REQUIRE ALL MODULES FOR FASTER COLD STARTS ==========
// Load env vars immediately
dotenv.config();

// Connect to DB but don't block server start
const connectDBWithRetry = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    setTimeout(connectDBWithRetry, 5000);
  }
};

// Start DB connection in background immediately
connectDBWithRetry();

const app = express();
const server = http.createServer(app);

// Render-specific configuration
app.set("trust proxy", 1);

// ========== SIMPLE CORS FOR RENDER ==========
app.use(
  cors({
    origin: ["https://explorewithlocals.vercel.app", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  })
);

// Enable gzip compression for responses
app.use(compression());

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Socket.io configuration
const io = socketio(server, {
  cors: {
    origin: ["https://explorewithlocals.vercel.app", "http://localhost:3000"],
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
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });
  socket.on("sendMessage", (message) => {
    const { receiverId } = message;
    socket.to(receiverId).emit("newMessage", message);
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

// Import routes - DO THIS SYNCHRONOUSLY FOR FASTER STARTS
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
      message: "Server is running on Render",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: dbStatus,
      platform: "Render.com",
      coldStart: "optimized",
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
    message: "Explore with Locals Backend API - Optimized for Render",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    platform: "Render.com",
    frontend_url: "https://explorewithlocals.vercel.app",
    coldStart: "optimized",
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

// Start server
server.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
  console.log(`🌐 CORS enabled for: https://explorewithlocals.vercel.app`);
  console.log(
    `🗄️ Database status: ${
      mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    }`
  );
  console.log(`📍 Platform: Render.com`);
  console.log(`⚡ Cold Start: Optimized`);
});
