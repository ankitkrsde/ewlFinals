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

// ========== NUCLEAR CORS FIX ==========
// Apply CORS to EVERY request manually

app.use((req, res, next) => {
  console.log(
    `🌐 CORS Middleware - ${req.method} ${req.url} - Origin: ${req.headers.origin}`
  );

  // ALLOW ALL ORIGINS TEMPORARILY
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-auth-token, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Expose-Headers", "x-auth-token");
  res.header("Access-Control-Max-Age", "86400"); // 24 hours

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    console.log("🛫 Preflight request handled successfully");
    return res.status(200).end();
  }

  next();
});

// Also use cors package as backup
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow ALL origins for now
      callback(null, true);
    },
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

// Enable gzip compression for responses
app.use(compression());

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Socket.io configuration
const io = socketio(server, {
  cors: {
    origin: "*",
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

// Test CORS endpoint
app.get("/api/cors-test", (req, res) => {
  res.json({
    success: true,
    message: "CORS IS WORKING!",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
    headers: req.headers,
  });
});

app.post("/api/cors-test", (req, res) => {
  res.json({
    success: true,
    message: "POST CORS IS WORKING!",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
    body: req.body,
  });
});

app.options("/api/cors-test", (req, res) => {
  console.log("CORS test preflight");
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
      cors: "ENABLED - NUCLEAR MODE",
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
    message: "Explore with Locals Backend API - CORS NUCLEAR MODE",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    cors: "ENABLED - ALL ORIGINS ALLOWED",
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
  console.log(`🌐 CORS: NUCLEAR MODE - ALL ORIGINS ALLOWED`);
  console.log(
    `🗄️ Database status: ${
      mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    }`
  );
  console.log(`📍 Listening on: 0.0.0.0:${PORT}`);
  console.log(
    `🔧 Test CORS: https://ewlfinals-production.up.railway.app/api/cors-test`
  );
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});
