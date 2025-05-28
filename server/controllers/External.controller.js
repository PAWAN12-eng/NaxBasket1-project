// utils/activityLogger.js
import ActivityModel from '../models/ActivityModel.js';

export async function logActivity(type, message) {
  try {
    const activity = new ActivityModel({ type, message });
    await activity.save();
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}


// router.get('/recent-activities', async (req, res) => {

export async function recentActivites(req, res) {
    try {
      // Last 10 activities sorted by newest first
      const activities = await ActivityModel.find()
        .sort({ createdAt: -1 })
        .limit(10);
        // console.log("Recent Activities:", activities);

      res.json({ success: true, activities });
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };