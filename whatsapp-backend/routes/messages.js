const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// ✅ Fetch all chats grouped by user
router.get("/chats", async (req, res) => {
  try {
    const chats = await Message.aggregate([
      {
        $group: {
          _id: "$wa_id",
          messages: { $push: "$$ROOT" },
        },
      },
    ]);
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Send a message and auto-update status
router.post("/send", async (req, res) => {
  try {
    const { wa_id, name, message } = req.body;

    const newMessage = await Message.create({
      wa_id,
      name,
      message,
      timestamp: new Date(),
      status: "sent",
    });

    res.status(200).json(newMessage);

    // Auto-update status to delivered after 1s
    setTimeout(async () => {
      await Message.findByIdAndUpdate(newMessage._id, { status: "delivered" });
      console.log(`📦 Message ${newMessage._id} marked as delivered`);

      // Then mark as read after 2 more seconds
      setTimeout(async () => {
        await Message.findByIdAndUpdate(newMessage._id, { status: "read" });
        console.log(`📬 Message ${newMessage._id} marked as read`);
      }, 2000);
    }, 1000);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Update a message's status manually if needed
router.put("/status", async (req, res) => {
  try {
    const { meta_msg_id, status } = req.body;

    if (!["sent", "delivered", "read"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const message = await Message.findOneAndUpdate(
      { meta_msg_id },
      { status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
