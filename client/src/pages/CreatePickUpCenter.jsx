import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiMapPin, FiPlus } from "react-icons/fi";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
// import ConfirmBox from "../components/ConfirmBox";
import InteractiveMap from "../AdminDashboard/InteractiveMap";
import StatusBadge from "../AdminDashboard/StatusBadge";
import SearchInput from "../AdminDashboard/SearchInput";

const CreatePickUpCenter = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    coordinates: {
      lat: "",
      lng: "",
    },
  });
  const [editId, setEditId] = useState(null);
  const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const res = await Axios(SummaryApi.fetchWarehouses);
      if (res.data.success) {
        setWarehouses(res.data.data);
        setFilteredWarehouses(res.data.data);
      } else {
        toast.error("Failed to fetch warehouses");
      }
    } catch (err) {
      toast.error("Error fetching warehouses");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "lat" || name === "lng") {
      setFormData((prev) => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMapSelect = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      coordinates: { lat, lng }
    }));
    setIsMapVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const apiCall = editId
      ? Axios({ ...SummaryApi.editWarehouse(editId), data: formData })
      : Axios({ ...SummaryApi.createWarehouse, data: formData });

    try {
      const res = await apiCall;
      if (res.data.success) {
        toast.success(res.data.message || "Success");
        resetForm();
        fetchWarehouses();
      }
    } catch {
      toast.error("Error submitting warehouse data");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (warehouse) => {
    setFormData({
      name: warehouse.name || "",
      location: warehouse.location || "",
      coordinates: {
        lat: warehouse.coordinates?.lat || "",
        lng: warehouse.coordinates?.lng || "",
      },
    });
    setEditId(warehouse._id);
    setShowFormPopup(true);
  };

  const toggleStatus = async (id) => {
    try {
      const res = await Axios(SummaryApi.toggleWarehouseStatus(id));
      if (res.data.success) {
        toast.success(res.data.message);
        fetchWarehouses();
      }
    } catch {
      toast.error("Error toggling status");
    }
  };

  const deleteWarehouse = async () => {
    try {
      const res = await Axios(SummaryApi.deleteWarehouse(selectedDeleteId));
      if (res.data.success) {
        toast.success(res.data.message);
        fetchWarehouses();
        setOpenConfirmBoxDelete(false);
        setSelectedDeleteId(null);
      }
    } catch {
      toast.error("Error deleting warehouse");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      coordinates: { lat: "", lng: "" },
    });
    setEditId(null);
    setShowFormPopup(false);
    setIsMapVisible(false);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term === "") {
      setFilteredWarehouses(warehouses);
    } else {
      const filtered = warehouses.filter(warehouse =>
        warehouse.name.toLowerCase().includes(term.toLowerCase()) ||
        warehouse.location.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredWarehouses(filtered);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Pickup Centers Management</h1>
          <p className="text-gray-600">Manage all your pickup center locations</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            resetForm();
            setShowFormPopup(true);
          }}
          className="mt-4 md:mt-0 flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <FiPlus className="text-lg" />
          <span>Add New Center</span>
        </motion.button>
      </motion.div>

      {/* Search and Filter */}
      <div className="mb-6">
        <SearchInput 
          placeholder="Search centers by name or location..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading && !warehouses.length ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coordinates</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredWarehouses.map((warehouse) => (
                  <motion.tr 
                    key={warehouse._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{warehouse.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {warehouse.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge isActive={warehouse.active} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {warehouse.coordinates?.lat && warehouse.coordinates?.lng ? (
                        <span className="inline-flex items-center">
                          <FiMapPin className="mr-1" />
                          {warehouse.coordinates.lat}, {warehouse.coordinates.lng}
                        </span>
                      ) : 'Not set'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleStatus(warehouse._id)}
                          className={`p-2 rounded-full ${warehouse.isActive ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-700'}`}
                          title={warehouse.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {warehouse.isActive ? <FiToggleLeft size={18} /> : <FiToggleRight size={18} />}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(warehouse)}
                          className="p-2 rounded-full bg-blue-100 text-blue-700"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setSelectedDeleteId(warehouse._id);
                            setOpenConfirmBoxDelete(true);
                          }}
                          className="p-2 rounded-full bg-red-100 text-red-700"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filteredWarehouses.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No pickup centers found. Create your first one!
          </div>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showFormPopup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editId ? "Edit Pickup Center" : "Create New Pickup Center"}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Center Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter center name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location Address</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Enter full address"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coordinates</label>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      name="lat"
                      placeholder="Latitude"
                      value={formData.coordinates.lat}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      required
                    />
                    <input
                      type="text"
                      name="lng"
                      placeholder="Longitude"
                      value={formData.coordinates.lng}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setIsMapVisible(!isMapVisible)}
                      className="px-4 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition flex items-center"
                    >
                      <FiMapPin className="mr-2" />
                      Map
                    </button>
                  </div>
                </div>
                {isMapVisible && (
                  <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
                    <InteractiveMap 
                      onSelect={handleMapSelect}
                      initialLocation={
                        formData.coordinates.lat && formData.coordinates.lng 
                          ? [parseFloat(formData.coordinates.lat), parseFloat(formData.coordinates.lng)] 
                          : null
                      }
                    />
                  </div>
                )}
                <div className="flex justify-end space-x-3 pt-4">
                  <motion.button
                    type="button"
                    onClick={resetForm}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={loading}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 transition shadow-md disabled:opacity-70 flex items-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : editId ? (
                      "Update Center"
                    ) : (
                      "Create Center"
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Dialog */}
      {/* <ConfirmBox
        open={openConfirmBoxDelete}
        title="Delete Pickup Center"
        message="Are you sure you want to delete this pickup center? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={deleteWarehouse}
        onCancel={() => setOpenConfirmBoxDelete(false)}
        variant="danger"
      /> */}
    </div>
  );
};

export default CreatePickUpCenter;