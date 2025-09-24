const express = require("express");
const {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
  deleteMessage,
} = require("../controllers/messageController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/conversations", getConversations);
router.get("/:userId", getMessages);
router.post("/", sendMessage);
router.put("/read", markAsRead);
router.delete("/:id", deleteMessage);

module.exports = router;
