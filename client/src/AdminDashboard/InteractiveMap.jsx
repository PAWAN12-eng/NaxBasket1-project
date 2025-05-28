import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ onSelect, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition || null);
  const map = useMapEvents({
    click(e) {
      const newPosition = [e.latlng.lat, e.latlng.lng];
      setPosition(newPosition);
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
      map.flyTo(initialPosition, 15);
    }
  }, [initialPosition, map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Selected Location</Popup>
    </Marker>
  );
};

const InteractiveMap = ({ onSelect, initialLocation }) => {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  if (!mapReady) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <MapContainer
      center={initialLocation || [20.5937, 78.9629]} // Default to India coordinates
      zoom={initialLocation ? 15 : 5}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker onSelect={onSelect} initialPosition={initialLocation} />
    </MapContainer>
  );
};

export default InteractiveMap;