'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LocationData {
  pincode: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
}

interface LocationContextType {
  location: LocationData;
  setLocation: (loc: LocationData) => void;
  isLocationModalOpen: boolean;
  setLocationModalOpen: (open: boolean) => void;
  clearLocation: () => void;
}

const defaultLocation: LocationData = {
  pincode: null,
  city: null,
  latitude: null,
  longitude: null,
  address: null,
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] = useState<LocationData>(defaultLocation);
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load from local storage
    const saved = localStorage.getItem('k2k_user_location');
    if (saved) {
      try {
        setLocationState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved location");
      }
    }
    setIsInitialized(true);
  }, []);

  const setLocation = (loc: LocationData) => {
    setLocationState(loc);
    localStorage.setItem('k2k_user_location', JSON.stringify(loc));
  };

  const clearLocation = () => {
    setLocationState(defaultLocation);
    localStorage.removeItem('k2k_user_location');
  };

  return (
    <LocationContext.Provider value={{ location, setLocation, isLocationModalOpen, setLocationModalOpen, clearLocation }}>
      {isInitialized ? children : null}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
