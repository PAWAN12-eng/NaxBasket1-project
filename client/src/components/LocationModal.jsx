import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";

const LocationModal = ({ isOpen, onClose, onSave }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          setCurrentLocation({
            address: data.display_name,
            lat: latitude,
            lng: longitude,
          });
        } catch (error) {
          alert("Failed to get address from coordinates");
        }
      },
      () => {
        alert("Unable to retrieve your location");
      }
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchTerm
        )}&format=json&addressdetails=1&limit=5`
      );
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      alert("Search failed");
    }
  };

  const handleSaveLocation = () => {
    if (currentLocation) {
      onSave(currentLocation);
      onClose();
    } else {
      alert("Please select or detect a location first.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
      />

      <div className="fixed z-50 top-1/2 left-1/2 w-[90%] sm:w-[500px] max-h-[90vh] overflow-y-auto bg-white transform -translate-x-1/2 -translate-y-1/2 rounded-2xl p-5 shadow-2xl transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Choose Your Location</h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-xl"
            onClick={onClose}
            aria-label="Close modal"
          >
            <RxCross1 />
          </button>
        </div>

        {/* Detect Location Button */}
        <button
          onClick={handleDetectLocation}
          className="w-full mb-4 py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition"
        >
          📍 Use My Current Location
        </button>

        {/* Search Location */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by area or city name"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            🔍
          </button>
        </form>

        {/* Current Location Display */}
        {currentLocation && (
          <div className="mb-4 p-3 bg-gray-100 border rounded-lg text-sm">
            <strong>Selected:</strong>
            <p className="text-gray-700 mt-1">{currentLocation.address}</p>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <ul className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-2">
            {searchResults.map((loc) => (
              <li
                key={loc.place_id}
                className="p-2 rounded hover:bg-gray-200 cursor-pointer text-sm transition"
                onClick={() => {
                  setCurrentLocation({
                    address: loc.display_name,
                    lat: parseFloat(loc.lat),
                    lng: parseFloat(loc.lon),
                  });
                  setSearchResults([]);
                  setSearchTerm("");
                }}
              >
                {loc.display_name}
              </li>
            ))}
          </ul>
        )}

        {/* Save Button */}
        <button
          onClick={handleSaveLocation}
          className="mt-6 w-full py-2 px-4 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-semibold transition"
        >
          ✅ Save Location
        </button>
      </div>
    </>
  );
};

export default LocationModal;
