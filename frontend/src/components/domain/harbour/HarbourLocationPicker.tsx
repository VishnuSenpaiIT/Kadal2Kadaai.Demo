'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader2, AlertCircle, Search, Navigation, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface AddressDetails {
  address_line_1: string;
  address_line_2?: string;
  area_locality: string;
  landmark?: string;
  city: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
  google_place_id: string;
  google_plus_code?: string;
}

interface HarbourLocationPickerProps {
  apiKey: string | null;
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number, addressDetails: AddressDetails) => void;
}

export default function HarbourLocationPicker({
  apiKey,
  latitude,
  longitude,
  onChange,
}: HarbourLocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  // Live location coordinates display
  const [liveCoords, setLiveCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const googleMap = useRef<any>(null);
  const marker = useRef<any>(null);

  useEffect(() => {
    if (latitude && longitude) {
      setLiveCoords({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (!apiKey) {
      setError('Google Maps API key is not configured. Please save your API Key in Settings first.');
      return;
    }

    setError(null);
    setLoading(true);

    const loadScript = () => {
      if ((window as any).google && (window as any).google.maps && (window as any).google.maps.places) {
        initMap();
        return;
      }

      const existingScript = document.getElementById('google-maps-sdk');
      if (existingScript) {
        existingScript.addEventListener('load', initMap);
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-maps-sdk';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => initMap();
      script.onerror = () => {
        setError('Failed to load Google Maps script. Check your API key or network connection.');
        setLoading(false);
      };
      document.head.appendChild(script);
    };

    const initMap = () => {
      setLoading(false);
      if (!mapRef.current) return;

      const defaultLat = latitude || 13.0827; // Chennai
      const defaultLng = longitude || 80.2707;

      const mapOptions = {
        center: { lat: defaultLat, lng: defaultLng },
        zoom: 13,
        mapTypeControl: true, // Satellite and Map view toggle enabled
        mapTypeControlOptions: {
          style: (window as any).google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: (window as any).google.maps.ControlPosition.TOP_RIGHT,
        },
        zoomControl: true, // Zoom controls enabled
        fullscreenControl: true,
        streetViewControl: true,
      };

      const maps = (window as any).google.maps;
      const mapInstance = new maps.Map(mapRef.current, mapOptions);
      googleMap.current = mapInstance;

      const markerInstance = new maps.Marker({
        position: { lat: defaultLat, lng: defaultLng },
        map: mapInstance,
        draggable: true,
        title: 'Drag to Pinpoint Location',
        animation: maps.Animation.DROP,
      });
      marker.current = markerInstance;

      // Autocomplete Search Box
      if (searchInputRef.current) {
        const searchBox = new maps.places.SearchBox(searchInputRef.current);
        
        mapInstance.addListener('bounds_changed', () => {
          searchBox.setBounds(mapInstance.getBounds());
        });

        searchBox.addListener('places_changed', () => {
          const places = searchBox.getPlaces();
          if (places.length === 0) return;

          const place = places[0];
          if (!place.geometry || !place.geometry.location) return;

          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const placeId = place.place_id || '';

          markerInstance.setPosition(place.geometry.location);
          mapInstance.setCenter(place.geometry.location);
          mapInstance.setZoom(16);

          setLiveCoords({ lat, lng });
          setHasConfirmed(false); // require confirmation check or trigger geocode
          geocodeCoordinates(lat, lng, placeId);
        });
      }

      // Click on map to place marker
      mapInstance.addListener('click', (e: any) => {
        const clickedLat = e.latLng.lat();
        const clickedLng = e.latLng.lng();
        markerInstance.setPosition(e.latLng);
        setLiveCoords({ lat: clickedLat, lng: clickedLng });
        setHasConfirmed(false);
        geocodeCoordinates(clickedLat, clickedLng);
      });

      // Dragging marker shows live coordinates
      markerInstance.addListener('drag', (e: any) => {
        setLiveCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        setHasConfirmed(false);
      });

      // Dragend triggers address reverse geocode
      markerInstance.addListener('dragend', (e: any) => {
        const draggedLat = e.latLng.lat();
        const draggedLng = e.latLng.lng();
        setLiveCoords({ lat: draggedLat, lng: draggedLng });
        geocodeCoordinates(draggedLat, draggedLng);
      });
    };

    loadScript();

    return () => {
      if (googleMap.current) {
        (window as any).google?.maps?.event?.clearInstanceListeners(googleMap.current);
      }
      if (marker.current) {
        (window as any).google?.maps?.event?.clearInstanceListeners(marker.current);
      }
    };
  }, [apiKey]);

  const geocodeCoordinates = (lat: number, lng: number, placeId: string = '') => {
    const maps = (window as any).google.maps;
    const geocoder = new maps.Geocoder();

    geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        const result = results[0];
        const details = parseAddressComponents(result.address_components) as any;
        details.google_place_id = placeId || result.place_id || '';
        
        if (result.plus_code) {
          details.google_plus_code = result.plus_code.global_code || result.plus_code.compound_code || '';
        }

        // Notify parent of coordinates and address details
        onChange(lat, lng, details as AddressDetails);
        setHasConfirmed(true);
      } else {
        console.warn('Geocoding failed: ' + status);
      }
    });
  };

  const parseAddressComponents = (components: any[]) => {
    const getComponent = (types: string[], nameType: 'long_name' | 'short_name' = 'long_name') => {
      const comp = components.find(c => types.some(t => c.types.includes(t)));
      return comp ? comp[nameType] : '';
    };

    const streetNumber = getComponent(['street_number']);
    const route = getComponent(['route']);
    const sublocality = getComponent(['sublocality_level_1']) || getComponent(['sublocality']);
    const locality = getComponent(['locality']);
    const district = getComponent(['administrative_area_level_2']);
    const state = getComponent(['administrative_area_level_1']);
    const countryName = getComponent(['country']);
    const pincode = getComponent(['postal_code']);

    // Build line 1 & 2
    let line1 = [streetNumber, route].filter(Boolean).join(' ');
    if (!line1) {
      line1 = sublocality || locality || getComponent(['political']);
    }

    return {
      address_line_1: line1 || 'Unnamed Road',
      address_line_2: '',
      area_locality: sublocality || locality || 'Local Area',
      landmark: '',
      city: locality || district || 'Unknown City',
      district: district || locality || 'Unknown District',
      state: state || 'Unknown State',
      country: countryName || 'India',
      pincode: pincode || '',
    };
  };

  // Set maps position to customer current location if supported
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLiveCoords({ lat, lng });
        setHasConfirmed(false);

        if (googleMap.current && marker.current) {
          const maps = (window as any).google.maps;
          const pos = new maps.LatLng(lat, lng);
          marker.current.setPosition(pos);
          googleMap.current.setCenter(pos);
          googleMap.current.setZoom(16);
          geocodeCoordinates(lat, lng);
        }
      },
      (error) => {
        setIsLocating(false);
        alert('Could not retrieve your location: ' + error.message);
      },
      { enableHighAccuracy: true }
    );
  };

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 text-sm flex items-start gap-2.5">
        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <div className="space-y-2 flex-1 w-full">
          <Label htmlFor="map-search-box" className="text-sm font-semibold flex items-center gap-1.5">
            <Search className="w-4 h-4 text-muted-foreground" />
            Search Address or Harbour Name
          </Label>
          <Input
            id="map-search-box"
            ref={searchInputRef}
            type="text"
            placeholder="Type harbour name, town or beach to search..."
            className="w-full bg-background"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="w-full sm:w-auto flex items-center gap-2 border-primary/20 hover:bg-primary/5 text-primary-700 font-semibold"
        >
          {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
          Use Current Location
        </Button>
      </div>

      <div className="relative border rounded-2xl overflow-hidden bg-muted/20 h-80 shadow-md">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <span className="font-semibold text-muted-foreground">Loading Interactive Map...</span>
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" />

        {/* Live Coordinates and Status Overlay */}
        {liveCoords && (
          <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm border rounded-xl p-3 shadow-lg z-10 max-w-xs space-y-1.5">
            <div className="text-2xs font-extrabold text-muted-foreground uppercase tracking-widest">Pinpointed Location</div>
            <div className="font-mono text-xs text-foreground font-semibold flex flex-col">
              <span>Lat: {liveCoords.lat.toFixed(6)}</span>
              <span>Lng: {liveCoords.lng.toFixed(6)}</span>
            </div>
            {hasConfirmed ? (
              <div className="flex items-center gap-1 text-2xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 w-fit">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Coordinates Checked
              </div>
            ) : (
              <div className="text-2xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 w-fit animate-pulse">
                Drag to Confirm Pinpoint
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
