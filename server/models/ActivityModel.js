// models/ActivityModel.js
import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['product_added', 'category_added', 'subcategory_added', 'user_registered'],
    required: true,
  },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ActivityModel = mongoose.model('Activity', activitySchema);
export default ActivityModel;
