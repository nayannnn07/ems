const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// Fetch Admin Notifications (Unread Only)
router.get("/admin", async (req, res) => {
    try {
        const notifications = await Notification.find({ recipientRole: "admin", isRead: false });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark a Notification as Read
router.put("/read/:id", async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
