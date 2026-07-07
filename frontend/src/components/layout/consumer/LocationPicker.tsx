'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation } from '@/providers/LocationProvider';
import { MapPin, Loader2, Navigation } from 'lucide-react';
import { toast } from 'sonner';

export function LocationPicker() {
  const { isLocationModalOpen, setLocationModalOpen, setLocation } = useLocation();
  const [pincode, setPincode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resolvePincode = async () => {
    if (!pincode || pincode.length < 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }

    setIsLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const url = `${baseUrl}/v1/marketplace/shipping/geocode?address=${encodeURIComponent(pincode + ', India')}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        
        let city = '';
        for (const component of result.address_components) {
          if (component.types.includes('locality')) {
            city = component.long_name;
          }
          if (!city && component.types.includes('administrative_area_level_2')) {
            city = component.long_name;
          }
        }

        setLocation({
          pincode: pincode,
          city: city || 'Unknown City',
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
          address: result.formatted_address,
        });

        toast.success(`Location set to ${city || result.formatted_address}`);
        setLocationModalOpen(false);
      } else {
        if (data.error_message) {
          toast.error(`Maps API Error: ${data.error_message}`);
        } else {
          toast.error('Could not find location for this pincode.');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to resolve pincode. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
          const url = `${baseUrl}/v1/marketplace/shipping/geocode?latlng=${latitude},${longitude}`;
          const res = await fetch(url);
          const data = await res.json();

          if (data.status === 'OK' && data.results.length > 0) {
            const result = data.results[0];
            
            let city = '';
            let resolvedPincode = '';

            for (const component of result.address_components) {
              if (component.types.includes('locality')) {
                city = component.long_name;
              }
              if (!city && component.types.includes('administrative_area_level_2')) {
                city = component.long_name;
              }
              if (component.types.includes('postal_code')) {
                resolvedPincode = component.long_name;
              }
            }

            setLocation({
              pincode: resolvedPincode,
              city: city || 'Unknown City',
              latitude,
              longitude,
              address: result.formatted_address,
            });

            toast.success(`Location set to ${city || 'Current Location'}`);
            setLocationModalOpen(false);
          } else {
            if (data.error_message) {
              toast.error(`Maps API Error: ${data.error_message}`);
            } else {
              toast.error('Could not resolve your location address.');
            }
          }
        } catch (error) {
           toast.error('Failed to fetch location details.');
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        toast.error('Unable to retrieve your location');
        setIsLoading(false);
      }
    );
  };

  return (
    <Dialog open={isLocationModalOpen} onOpenChange={setLocationModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Where should we deliver?
          </DialogTitle>
          <DialogDescription>
            Enter your pincode to see fresh catch available in your area. Seafood availability varies based on transit time.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter 6-digit Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') resolvePincode();
              }}
              maxLength={6}
            />
            <Button onClick={resolvePincode} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2"
              onClick={useCurrentLocation}
              disabled={isLoading}
            >
              <Navigation className="h-4 w-4" />
              Use my current location
            </Button>
            <p className="text-[10px] text-center text-muted-foreground font-semibold">
              We need a precise location, this is for delivery.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
