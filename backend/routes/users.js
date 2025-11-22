const express = require("express");
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");
const { getMe } = require("../controllers/authController");

const router = express.Router();

router.use(protect);

router.get("/", authorize("admin"), getUsers);
router.get("/stats", authorize("admin"), getUserStats);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", authorize("admin"), deleteUser);
router.get("/me", protect, getMe);

module.exports = router;
