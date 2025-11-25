const express = require("express");
const path = require("path");
const {
  register,
  login,
  getMe,
  logout,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  uploadAvatar,
  deleteAvatar,
  verifyToken,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const multer = require("multer");

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads/avatars");
    // Create directory if it doesn't exist
    const fs = require("fs");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Create unique filename with user ID
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      "avatar_" +
        (req.user ? req.user.id : "unknown") +
        "_" +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: fileFilter,
});

const router = express.Router();

router.options("/*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-auth-token, X-Requested-With, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(200).end();
});

router.post("/register", register);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);

router.post(
  "/upload-avatar",
  protect,
  upload.single("avatar"),
  (req, res, next) => {
    // If multer didn't process the file, send specific error
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Multer did not process the file. Check file field name and size.",
        debug: {
          hasFiles: !!req.files,
          contentType: req.headers["content-type"],
          bodyKeys: Object.keys(req.body),
        },
      });
    }

    // If file was processed, continue to the controller
    next();
  },
  uploadAvatar
);

router.put("/resetpassword", resetPassword);
router.get("/me", protect, getMe);
router.get("/verify-token", verifyToken);
router.get("/logout", logout);
router.put("/updatedetails", protect, updateDetails);
router.put("/updatepassword", protect, updatePassword);
router.delete("/deleteAvatar", protect, deleteAvatar);

router.all("/register", (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed. Use POST.`,
    });
  }
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

router.all("/login", (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed. Use POST.`,
    });
  }
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = router;
