const express = require("express");
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/", authorize("admin"), getUsers);
router.get("/stats", authorize("admin"), getUserStats);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", authorize("admin"), deleteUser);

module.exports = router;
