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

// ========== AGGRESSIVE CORS FIX ==========
// Handle CORS at the very top - before any other middleware

// Option 1: Simple CORS for all origins (temporary fix)
app.use(
  cors({
    origin: true, // Allow all origins temporarily
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-auth-token",
      "X-Requested-With",
      "Accept",
    ],
  })
);

// Option 2: Manual CORS headers (more control)
app.use((req, res, next) => {
  // Allow specific origins
  const allowedOrigins = [
    "https://explorewithlocals.vercel.app",
    "https://ewlfinals-production.up.railway.app",
    "http://localhost:3000",
    "http://localhost:5000",
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    // Allow any origin for debugging (remove in production)
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-auth-token, X-Requested-With, Accept, Origin"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Expose-Headers", "x-auth-token");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    console.log("🛫 Handling preflight request for:", req.url);
    return res.status(200).end();
  }

  next();
});

// Handle preflight for all routes
app.options("*", (req, res) => {
  console.log("🛫 Preflight request for:", req.url);
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-auth-token, X-Requested-With, Accept, Origin"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(200).end();
});

// Enable gzip compression for responses
app.use(compression());

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Socket.io configuration
const io = socketio(server, {
  cors: {
    origin: true, // Allow all origins
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

// Railway health check endpoint
app.get("/railway-health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.options("/railway-health", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.status(200).end();
});

// Test endpoints for CORS verification
app.get("/api/test-cors", (req, res) => {
  res.json({
    success: true,
    message: "CORS is working!",
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
    method: req.method,
  });
});

app.options("/api/test-cors", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(200).end();
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

app.options("/api/health", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.status(200).end();
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

app.options("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.status(200).end();
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

// Start server listening on all interfaces (CRITICAL FOR RAILWAY)
server.listen(PORT, "0.0.0.0", () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
  console.log(`🌐 CORS enabled for all origins`);
  console.log(
    `🗄️ Database status: ${
      mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    }`
  );
  console.log(`📱 Frontend URL: https://explorewithlocals.vercel.app`);
  console.log(`🔧 Backend URL: https://ewlfinals-production.up.railway.app`);
  console.log(`📍 Listening on: 0.0.0.0:${PORT}`);
  console.log(
    `⚡ Railway Health: https://ewlfinals-production.up.railway.app/railway-health`
  );
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
