const User = require('../models/User');

async function logUserActivity(userId, action, animeId) {
  try {
    await User.findByIdAndUpdate(
      userId,
      { 
        $push: { activityLogs: { action, animeId, timestamp: new Date() } }
      },
      { new: true }
    );
  } catch (error) {
    console.error("Error logging user activity:", error);
  }
}

module.exports = { logUserActivity };
