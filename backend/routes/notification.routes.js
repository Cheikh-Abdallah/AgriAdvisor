const express = require('express');
const router = express.Router();

const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth.middleware');

// =======================================
// GET NOTIFICATIONS UTILISATEUR
// =======================================
router.get('/', auth, async (req, res) => {
  try {

    console.log("==================================");
    console.log("🔔 DEMANDE NOTIFICATIONS");
    console.log("👤 Utilisateur connecté :", req.user.id);

   const notifications = await Notification.find({
      userId: req.user.id
    })
    .populate('data.technicienId')
    .sort({ createdAt: -1 });

    console.log("📨 Notifications trouvées :", notifications.length);

    console.log(
      JSON.stringify(
        notifications,
        null,
        2
      )
    );

    const unreadCount = await Notification.countDocuments({
      userId: req.user.id,
      isRead: false
    });

    console.log("📌 Non lues :", unreadCount);
    console.log("==================================");

    res.json({
      success: true,
      data: notifications,
      unreadCount
    });

  } catch (error) {

    console.error("❌ Erreur notifications :", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;