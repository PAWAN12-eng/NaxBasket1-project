import React, { useEffect, useState } from "react";
import { FaBox, FaUser, FaTags, FaTrash } from "react-icons/fa";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

const iconMap = {
  product_added: <FaBox className="text-white text-sm sm:text-base" />,
  category_added: <FaTags className="text-white text-sm sm:text-base" />,
  subcategory_added: <FaTags className="text-white text-sm sm:text-base" />,
  user_registered: <FaUser className="text-white text-sm sm:text-base" />,
  product_delete: <FaTrash className="text-white text-sm sm:text-base" />,
};

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await Axios({
          ...SummaryApi.recentActivity
        })
        const data = response.data;
        
        if (data.success) {
          setActivities(data.activities);
        }
      } catch (error) {
        console.error("Failed to fetch activities", error);
      }
      setLoading(false);
    };
    fetchActivities();
  }, []);

  if (loading) return <p>Loading activities...</p>;
  if (activities.length === 0)
    return <p className="text-gray-400">No recent activities.</p>;

  return (
    <div className="bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
        Recent Activity
      </h3>
      <div className="max-h-80 overflow-y-auto space-y-3 sm:space-y-4 pr-2 hide-scrollbar">
        {activities.map((activity) => (
          <div
            key={activity._id}
            className="flex items-start pb-3 sm:pb-4 border-b border-gray-700 last:border-0"
          >
            <div className="bg-indigo-500 p-2 rounded-lg mr-3">
              {iconMap[activity.type] || (
                <FaBox className="text-white text-sm sm:text-base" />
              )}
            </div>
            <div>
              <p className="font-medium text-sm sm:text-base">
                {activity.message}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm">
                {timeAgo(activity.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
};

// Helper function to show relative time like '2 hours ago'
function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return count + " " + interval.label + (count > 1 ? "s" : "") + " ago";
    }
  }
  return "Just now";
}

export default RecentActivity;
