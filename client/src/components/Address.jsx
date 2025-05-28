import React, { useState, useEffect, useRef } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosTostError from "../utils/AxiosTosterror";
import { FaMapMarkerAlt, FaPlus, FaTimes, FaSearch } from "react-icons/fa";
import { Menu } from "@headlessui/react";
import { EllipsisVertical } from "lucide-react";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [form, setForm] = useState({
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    mobile: "",
    lat: "",
    lng: "",
    name: "",
    addressType: "",
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  // Fetch user addresses from backend
  const fetchAddresses = async () => {
    try {
      const res = await Axios(SummaryApi.getUserAddresses);
      if (res.data.success) {
        setAddresses(res.data.data);
      }
    } catch (err) {
      AxiosTostError(err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Search address suggestions from Nominatim API
  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const fetchSearch = async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            debouncedSearchQuery
          )}&format=json&addressdetails=1&limit=5`
        );
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        toast.error("Failed to fetch search results.");
      } finally {
        setIsSearching(false);
      }
    };

    fetchSearch();
  }, [debouncedSearchQuery]);

  // Reset form and modal state
  const resetForm = () => {
    setForm({
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
      mobile: "",
      lat: "",
      lng: "",
      name: "",
      addressType: "",
    });
    setEditingAddressId(null);
    setSearchQuery("");
    setSearchResults([]);
    setIsModalOpen(false);
  };

  // Handle selecting a search suggestion
  const handleSelectSearchResult = (result) => {
    const addr = result.address || {};
    setForm({
      addressLine: result.display_name,
      city:
        addr.city ||
        addr.town ||
        addr.village ||
        addr.hamlet ||
        addr.suburb ||
        "",
      state: addr.state || "",
      pincode: addr.postcode || "",
      lat: result.lat,
      lng: result.lon,
      name: form.name,
      mobile: form.mobile,
      addressType: form.addressType,
    });
    setSearchQuery(result.display_name);
    setSearchResults([]);
  };

  // Add or update address API call
  const handleAddOrEditAddress = async () => {
    if (
      !form.addressLine ||
      !form.city ||
      !form.mobile ||
      !form.lat ||
      !form.lng
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      const dataToSend = {
        ...form,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        coordinates: {
          lat: parseFloat(form.lat),
          lng: parseFloat(form.lng),
        },
      };

      const res = editingAddressId
        ? await Axios({
            ...SummaryApi.updateUserAddress(editingAddressId),
            data: dataToSend,
          })
        : await Axios({ ...SummaryApi.addUserAddress, data: dataToSend });

      if (res.data.success) {
        toast.success(res.data.message);
        fetchAddresses();
        resetForm();
      }
    } catch (err) {
      console.error("Error adding address: ", err);
      AxiosTostError(err);
    }
  };

  // Open modal and fill form for editing
  const handleEditClick = (address) => {
    setForm({
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      mobile: address.mobile,
      lat: address.coordinates?.lat || "",
      lng: address.coordinates?.lng || "",
      name: address.name || "",
      addressType: address.addressType || "",
    });
    setEditingAddressId(address._id);
    setSearchQuery(address.addressLine || "");
    setIsModalOpen(true);
  };

  // Delete address
  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await Axios(SummaryApi.deleteUserAddress(id));
      if (res.data.success) {
        toast.success("Address deleted");
        fetchAddresses();
      }
    } catch (err) {
      AxiosTostError(err);
    }
  };

  // Detect current user location using Geolocation API and reverse geocode
  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await res.json();
            const displayAddress = data?.address || {};
            const locality =
              displayAddress?.suburb ||
              displayAddress?.village ||
              displayAddress?.town ||
              displayAddress?.city ||
              "";

            setForm((prev) => ({
              ...prev,
              lat: latitude,
              lng: longitude,
              city: locality,
              addressLine: data.display_name || "",
              state: displayAddress.state || "",
              pincode: displayAddress.postcode || "",
            }));

            setSearchQuery(data.display_name || "");
            toast.success("Location detected!");
          } catch (error) {
            console.error("Reverse geocoding failed", error);
            toast.error("Failed to detect location details.");
          }
        },
        () => {
          toast.error("Location access denied or unavailable.");
        }
      );
    } else {
      toast.error("Geolocation not supported in your browser.");
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-[80vh]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Addresses</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow hover:bg-green-700 transition"
        >
          <FaPlus /> Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <p className="text-gray-500">No addresses found. Add one!</p>
      ) : (
        <div className="w-full space-y-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              className="bg-white p-5 rounded-xl shadow border border-gray-200 relative"
            >
              <div className="absolute top-4 right-4">
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="p-1 hover:bg-gray-100 rounded-full focus:outline-none">
                    <EllipsisVertical className="w-5 h-5 text-gray-600" />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-28 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => handleEditClick(address)}
                            className={`${
                              active ? "bg-gray-100" : ""
                            } w-full text-left px-4 py-2 text-sm text-gray-700`}
                          >
                            Edit
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => handleDeleteAddress(address._id)}
                            className={`${
                              active ? "bg-gray-100" : ""
                            } w-full text-left px-4 py-2 text-sm text-red-600`}
                          >
                            Delete
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Menu>
              </div>

              <div className="flex gap-3 items-start">
                <FaMapMarkerAlt className="text-red-600 mt-1" />
                <div>
                  <p className="text-lg font-semibold">{address.name || "No Name"}</p>
                  <p className="text-gray-700">{address.addressLine}</p>
                  <p className="text-gray-500 text-sm">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p className="text-gray-500 text-sm">Mobile: {address.mobile}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Lat: {address.coordinates?.lat?.toFixed(5)}, Lng:{" "}
                    {address.coordinates?.lng?.toFixed(5)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add/Edit */}
      {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-4 relative border border-gray-200">
      {/* Close Button */}
      <button
        onClick={resetForm}
        className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        title="Close"
      >
        <FaTimes size={20} />
      </button>

      <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
        {editingAddressId ? "Edit Address" : "Add New Address"}
      </h3>

      <div className="space-y-2">
        {/* Search Address */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Search Address</label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your address"
              className="w-full border border-gray-300 rounded-lg p-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              ref={searchRef}
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
            {isSearching && (
              <div className="absolute right-10 top-3 animate-spin border-2 border-green-500 border-t-transparent rounded-full w-4 h-4"></div>
            )}
          </div>
          {searchResults.length > 0 && (
            <ul className="max-h-48 overflow-auto mt-2 border border-gray-200 rounded-lg bg-white z-30 absolute w-full shadow-xl">
              {searchResults.map((result) => (
                <li
                  key={result.place_id}
                  onClick={() => handleSelectSearchResult(result)}
                  className="cursor-pointer hover:bg-green-100 px-4 py-2 text-sm"
                >
                  {result.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Detect Current Location */}
        <button
          onClick={handleDetectLocation}
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold transition"
        >
          <FaMapMarkerAlt /> Use Current Location
        </button>

        {/* Input Fields */}
        {[
          { placeholder: "Address Type (Home / Work / Other)", key: "addressType" },
          { placeholder: "Address Line", key: "addressLine" },
          { placeholder: "City", key: "city" },
          { placeholder: "State", key: "state" },
          { placeholder: "Pincode", key: "pincode" },
          
          { placeholder: "Name (optional)", key: "name" },
          { placeholder: "Mobile Number", key: "mobile" },
        ].map((field) => (
          <input
            key={field.key}
            type="text"
            placeholder={field.placeholder}
            value={form[field.key]}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />
        ))}

        {/* Hidden Lat & Lng */}
        <input type="hidden" value={form.lat} />
        <input type="hidden" value={form.lng} />

        {/* Submit Button */}
        <button
          onClick={handleAddOrEditAddress}
          className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          {editingAddressId ? "Update Address" : "Add Address"}
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default Address;
