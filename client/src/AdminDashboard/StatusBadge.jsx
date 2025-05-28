import React from 'react';
import { motion } from 'framer-motion';

const StatusBadge = ({ isActive }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        isActive
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}
    >
      <motion.span
        animate={{
          backgroundColor: isActive ? '#10B981' : '#EF4444',
        }}
        className={`w-2 h-2 rounded-full mr-2`}
      />
      {isActive ? 'Active' : 'Inactive'}
    </motion.span>
  );
};

export default StatusBadge;