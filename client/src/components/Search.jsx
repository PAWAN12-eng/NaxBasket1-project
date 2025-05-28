import React, { useState, useEffect } from 'react';
import { IoSearch } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const navigate = useNavigate();
  const suggestions = ['milk', 'curd', 'rice', 'paneer', 'bread', 'sugar', 'egg', 'food'];
  const [currentSuggestion, setCurrentSuggestion] = useState('');
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCharIndex((prev) => {
        if (prev < suggestions[index].length - 1) {
          return prev + 1;
        } else {
          setIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
          return 0;
        }
      });
    }, 200);

    return () => clearInterval(interval);
  }, [index]);

  useEffect(() => {
    setCurrentSuggestion(suggestions[index].slice(0, charIndex + 1));
  }, [charIndex, index]);

  const handleSearch = () => {
    const searchQuery = query.trim() || currentSuggestion;
    if (searchQuery) {
      navigate(`/search?q=${searchQuery}`);
    }
  };
  const handelOnChange = (e) => {
    const value = e.target.value;
    setQuery(value);  
    const url =`/search?q=${value}`
    navigate(url)
  };
  
  return (
    <div className="flex items-center border rounded-lg px-4 py-2 w-full sm:w-[650px] bg-white shadow-md group focus-within:border-primary-200">
      <button 
        type="button" 
        className="bg-transparent border-none cursor-pointer group-focus-within:text-primary-200"
             >
        <IoSearch size={22} />
      </button>
      <input
        type="text"
        placeholder={`Search "${currentSuggestion}"`}
        value={query}
        onClick={() => navigate('/search')} 
        onChange={handelOnChange}
        className="ml-2 border-none outline-none flex-1 text-sm sm:text-lg bg-transparent"
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Navigate on Enter key
      />
    </div>
  );
};

export default Search;
