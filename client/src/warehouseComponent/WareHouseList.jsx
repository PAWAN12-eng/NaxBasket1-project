import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { Warehouse, Home, Plus, ArrowRight, MapPin, Package, Activity, Search, Filter, X } from "lucide-react";

// StatusPill Component
const StatusPill = ({ isActive, className = "" }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive ? 'bg-green-900/50 text-green-400 border border-green-800/50' : 'bg-red-900/50 text-red-400 border border-red-800/50'} ${className}`}
    >
      <motion.span
        animate={{
          backgroundColor: isActive ? '#10B981' : '#EF4444',
        }}
        className="w-2 h-2 rounded-full mr-1.5"
      />
      {isActive ? 'Active' : 'Inactive'}
    </motion.span>
  );
};

// LoadingSkeleton Component
const LoadingSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/30"
    >
      <div className="animate-pulse space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 bg-gray-700 rounded-lg"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="h-3 bg-gray-700 rounded w-1/3"></div>
          <div className="h-3 bg-gray-700 rounded w-1/3"></div>
        </div>
        <div className="h-8 bg-gray-700 rounded-md w-full"></div>
      </div>
    </motion.div>
  );
};

// SearchFilterBar Component
const SearchFilterBar = ({ searchTerm, onSearch, activeFilter, onFilter }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row gap-3"
    >
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-400 h-4 w-4" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-10 py-2.5 bg-gray-800/50 border border-gray-700/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Search warehouses..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => onSearch('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="text-gray-400 h-4 w-4 hover:text-white" />
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onFilter('all')}
          className={`px-3 py-2 text-sm rounded-lg border ${activeFilter === 'all' ? 'bg-indigo-600/50 border-indigo-500/50 text-white' : 'bg-gray-800/50 border-gray-700/30 text-gray-400 hover:bg-gray-700/50'}`}
        >
          All
        </button>
        <button
          onClick={() => onFilter('active')}
          className={`px-3 py-2 text-sm rounded-lg border ${activeFilter === 'active' ? 'bg-green-900/30 border-green-800/50 text-green-400' : 'bg-gray-800/50 border-gray-700/30 text-gray-400 hover:bg-gray-700/50'}`}
        >
          Active
        </button>
        <button
          onClick={() => onFilter('inactive')}
          className={`px-3 py-2 text-sm rounded-lg border ${activeFilter === 'inactive' ? 'bg-red-900/30 border-red-800/50 text-red-400' : 'bg-gray-800/50 border-gray-700/30 text-gray-400 hover:bg-gray-700/50'}`}
        >
          Inactive
        </button>
      </div>
    </motion.div>
  );
};

// Simplified InteractiveGlobe Component (using simple SVG as placeholder)
const InteractiveGlobe = ({ warehouses }) => {
  return (
    <div className="h-96 w-full relative flex items-center justify-center bg-gray-900/50 rounded-xl">
      <svg
        width="300"
        height="300"
        viewBox="0 0 300 300"
        className="w-full h-full"
      >
        <circle cx="150" cy="150" r="140" fill="#1E293B" stroke="#334155" strokeWidth="2" />
        <circle cx="150" cy="150" r="120" fill="#0F172A" stroke="#1E293B" strokeWidth="1" />
        
        {/* Sample "markers" for warehouses */}
        {warehouses.slice(0, 8).map((w, i) => {
          const angle = (i / warehouses.length) * Math.PI * 2;
          const x = 150 + Math.cos(angle) * 120;
          const y = 150 + Math.sin(angle) * 120;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="6" fill="#3B82F6" className="animate-pulse" />
              <circle cx={x} cy={y} r="12" fill="#3B82F6" opacity="0.2" />
            </g>
          );
        })}
        
        <text x="150" y="160" textAnchor="middle" fill="#64748B" fontSize="14" fontFamily="Arial">
          Interactive Globe View
        </text>
      </svg>
      
      <div className="absolute bottom-4 left-0 right-0 text-center text-gray-500 text-sm">
        {warehouses.length} warehouses displayed
      </div>
    </div>
  );
};

// Main WarehouseListPage Component
const WarehouseListPage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showGlobeView, setShowGlobeView] = useState(false);

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const res = await Axios(SummaryApi.fetchWarehouses);
      if (res.data.success) {
        setWarehouses(res.data.data);
        setFilteredWarehouses(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch warehouses");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term === "") {
      applyFilter(activeFilter, warehouses);
    } else {
      const filtered = warehouses.filter(warehouse =>
        warehouse.name.toLowerCase().includes(term.toLowerCase()) ||
        warehouse.location.toLowerCase().includes(term.toLowerCase())
      );
      applyFilter(activeFilter, filtered);
    }
  };

  const applyFilter = (filter, list) => {
    setActiveFilter(filter);
    if (filter === "all") {
      setFilteredWarehouses(list || warehouses);
    } else {
      const filtered = (list || warehouses).filter(warehouse => 
        filter === "active" ? warehouse.active : !warehouse.active
      );
      setFilteredWarehouses(filtered);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Header with Glass Morphism Effect */}
      <div className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/30 px-6 py-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 10 }}
              className="p-2 bg-indigo-600/20 rounded-lg border border-indigo-400/30"
            >
              <Warehouse size={28} className="text-indigo-400" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-300 to-blue-400 bg-clip-text text-transparent"
            >
               Warehouses Network
            </motion.h1>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowGlobeView(!showGlobeView)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-600/30 transition-all"
            >
              <MapPin size={18} />
              {showGlobeView ? "List View" : "Globe View"}
            </motion.button>
            
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all"
            >
              <Home size={18} />
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <SearchFilterBar 
            searchTerm={searchTerm}
            onSearch={handleSearch}
            activeFilter={activeFilter}
            onFilter={(filter) => applyFilter(filter)}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Globe View */}
        <AnimatePresence>
          {showGlobeView && !loading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-10 rounded-xl overflow-hidden border border-gray-700/50 shadow-2xl"
            >
              <InteractiveGlobe warehouses={filteredWarehouses} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Warehouse Cards */}
        <AnimatePresence>
          {!loading && !showGlobeView && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredWarehouses.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-12"
                >
                  <Package size={48} className="mx-auto text-gray-500 mb-4" />
                  <h3 className="text-xl text-gray-400">No warehouses found</h3>
                  <p className="text-gray-500 mt-2">
                    {searchTerm ? "Try a different search term" : "Create your first warehouse"}
                  </p>
                </motion.div>
              ) : (
                filteredWarehouses.map((w) => (
                  <motion.div
                    key={w._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    className="bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-700/30 hover:border-indigo-500/30 relative overflow-hidden"
                  >
                    {/* Status Indicator */}
                    <StatusPill isActive={w.active} className="absolute top-3 right-3" />
                    
                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity rounded-xl" />
                    
                    {/* Warehouse Content */}
                    <div className="relative z-10">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                          <Warehouse size={20} className="text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white min-h-16 line-clamp-2">{w.name}</h3>
                          <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                            <MapPin size={14} />
                            {w.location}
                          </p>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="flex justify-between text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          {/* <Activity size={14} /> */}
                          {/* <span>24 Orders</span> */}
                        </div>
                        {w.coordinates?.lat && w.coordinates?.lng && (
                          <div>
                            {w.coordinates.lat.toFixed(4)}, {w.coordinates.lng.toFixed(4)}
                          </div>
                        )}
                      </div>
                      
                      {/* Action Button */}
                      <Link
                        to={`/warehouse/${w._id}/warehouse-Dashboard`}
                        className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-md text-sm transition-all border border-indigo-500/30"
                      >
                        View Analytics
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      {/* <Link
        to="/warehouses/new"
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <Plus size={24} className="text-white" />
        </motion.div>
      </Link> */}
    </div>
  );
};

export default WarehouseListPage;