import React, { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

const SearchInput = ({ placeholder, value, onChange, debounceTime = 300 }) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(inputValue);
    }, debounceTime);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, debounceTime, onChange]);

  const handleClear = () => {
    setInputValue('');
    onChange('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        placeholder={placeholder || "Search..."}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {inputValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <FiX className="text-gray-400 hover:text-gray-600 transition" />
        </button>
      )}
    </motion.div>
  );
};

export default SearchInput;