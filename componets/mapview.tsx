import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const GoogleMapsView = () => {
  // State for location coordinates and error message
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState('');
  const mapRef = useRef<google.maps.Map | null>(null);

  // Async function to fetch geolocation data for the IP address
  const fetchIPLocation = async (ip: string) => {
    try {
      // Use your actual backend URL here, or a proxy like '/ip-location?ip=...'
      const response = await fetch(`http://localhost:8000/ip-location?ip=${ip}`);

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch location');
        return;
      }

      const data = await response.json();

      if (data.latitude && data.longitude) {
        setLocation({ lat: data.latitude, lng: data.longitude });
      } else if (data.location && data.location.latitude && data.location.longitude) {
        setLocation({ lat: data.location.latitude, lng: data.location.longitude });
      } else if (data.loc) {
        // Some APIs return a "loc" string like "lat,lng"
        const [lat, lng] = data.loc.split(',').map(Number);
        setLocation({ lat, lng });
      } else {
        1
      }
    } catch (err) {
      setError('Could not fetch location');
    }
  };

  // On mount, check for ?ip= query param and fetch location if present
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const ip = queryParams.get('ip');
    if (ip) {
      fetchIPLocation(ip);
    }
  }, []);

  // On Google Maps load, save reference and pan map if location is known
  const handleLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    if (location) {
      map.panTo(location);
    }
  };

  const googleMapsApiKey = "AIzaSyC7wgYpwoTFScjSCWIleM3gSEsm9AdLkJo";
  if (!googleMapsApiKey) {
    return <div>Please set your Google Maps API key in the environment variables</div>;
  }

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location || { lat: 0, lng: 0 }}
        zoom={location ? 10 : 2}
        onLoad={handleLoad}
      >
        {location && <Marker position={location} />}
      </GoogleMap>
      {error && <div className="text-red-600 mt-4">{error}</div>}
    </LoadScript>
  );
};

export default GoogleMapsView;
