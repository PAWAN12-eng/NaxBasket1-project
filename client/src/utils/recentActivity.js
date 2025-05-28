// utils/recentActivity.js

export const saveRecentlyViewed = (product) => {
    if (!product || !product._id) return;
  
    const existing = JSON.parse(localStorage.getItem("recentActivity")) || [];
  
    // Remove if already exists
    const filtered = existing.filter((item) => item._id !== product._id);
  
    // Add to start and limit to 10
    const updated = [product, ...filtered].slice(0, 10);
  
    localStorage.setItem("recentActivity", JSON.stringify(updated));
  };
  
  export const getRecentlyViewed = () => {
    return JSON.parse(localStorage.getItem("recentActivity")) || [];
  };
  