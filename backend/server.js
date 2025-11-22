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

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Enable gzip compression
app.use(compression());

// ✅ PRODUCTION CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "https://*.vercel.app", // Allow all Vercel deployments
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if origin is in allowed list or is a subdomain of allowed
    const isAllowed = allowedOrigins.some((allowed) => {
      if (allowed.includes("*")) {
        const domain = allowed.replace("*.", "");
        return origin.endsWith(domain);
      }
      return origin === allowed;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log("🚫 CORS blocked for origin:", origin);
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
  exposedHeaders: ["Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Socket.io with production CORS
const io = socketio(server, {
  cors: corsOptions,
  transports: ["websocket", "polling"],
});

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

console.log("🚀 Production server starting...");
console.log("✅ CORS enabled for:", allowedOrigins);

// Socket.io setup (keep your existing code)
io.on("connection", (socket) => {
  console.log("New WebSocket connection");
  // ... your existing socket code
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Import and use routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const guideRoutes = require("./routes/guides");
const bookingRoutes = require("./routes/bookings");
const reviewRoutes = require("./routes/reviews");
const messageRoutes = require("./routes/messages");
const adminRoutes = require("./routes/admin");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/guides", guideRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Explore with Locals Backend is running in production",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Explore with Locals Backend API",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      guides: "/api/guides",
      bookings: "/api/bookings",
      reviews: "/api/reviews",
      health: "/api/health",
    },
  });
});

// Error handler
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🎉 Production server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`✅ CORS enabled for: ${allowedOrigins.join(", ")}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
