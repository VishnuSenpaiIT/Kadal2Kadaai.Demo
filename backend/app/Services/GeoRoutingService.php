<?php

namespace App\Services;

use App\Models\Harbour;
use App\Models\PincodeDistance;
use App\Models\ShippingSetting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeoRoutingService
{
    /**
     * Get the Google Maps API Key from Shipping Settings or environment.
     *
     * @return string|null
     */
    private function getApiKey(): ?string
    {
        $settings = ShippingSetting::first();
        if ($settings && $settings->google_maps_api_key) {
            return $settings->google_maps_api_key;
        }
        return env('GOOGLE_MAPS_API_KEY');
    }

    /**
     * Calculate straight-line (Haversine) distance in kilometers between two coordinates.
     */
    public function haversineDistance(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $earthRadius = 6371.0; // Earth's radius in kilometers

        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLng / 2) * sin($dLng / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    /**
     * Get the transit time in hours from a Harbour to a Pincode.
     * Caches the result in the database to avoid hitting Google Maps API.
     *
     * @param Harbour $harbour
     * @param string $destinationPincode
     * @return int|null Transit time in hours, or null if unroutable.
     */
    public function getTransitTimeInHours(Harbour $harbour, string $destinationPincode): ?int
    {
        // 1. Check cache
        $cached = PincodeDistance::where('harbor_id', $harbour->id)
            ->where('destination_pincode', $destinationPincode)
            ->first();

        if ($cached) {
            if ($cached->status !== 'OK') {
                return null;
            }
            // Round up to nearest hour
            return (int) ceil($cached->duration_minutes / 60);
        }

        // 2. Fallback to API call if not cached
        $origin = "{$harbour->latitude},{$harbour->longitude}";
        $destination = "{$destinationPincode}, India";

        $apiKey = $this->getApiKey();
        if (!$apiKey) {
            Log::error('Google Maps API key is missing.');
            return null;
        }

        try {
            $response = Http::get('https://maps.googleapis.com/maps/api/distancematrix/json', [
                'origins' => $origin,
                'destinations' => $destination,
                'key' => $apiKey,
            ]);

            $data = $response->json();

            if (isset($data['status']) && $data['status'] === 'OK') {
                $element = $data['rows'][0]['elements'][0];
                
                if ($element['status'] === 'OK') {
                    $distanceKm = $element['distance']['value'] / 1000;
                    $durationMins = $element['duration']['value'] / 60;

                    PincodeDistance::create([
                        'harbor_id' => $harbour->id,
                        'destination_pincode' => $destinationPincode,
                        'distance_km' => $distanceKm,
                        'duration_minutes' => $durationMins,
                        'status' => 'OK',
                    ]);

                    return (int) ceil($durationMins / 60);
                } else {
                    PincodeDistance::create([
                        'harbor_id' => $harbour->id,
                        'destination_pincode' => $destinationPincode,
                        'status' => $element['status'],
                    ]);
                    return null;
                }
            } else {
                Log::error('Google Maps Distance Matrix API error', ['response' => $data]);
                return null;
            }

        } catch (\Exception $e) {
            Log::error('GeoRoutingService Error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Calculate the distance in kilometers between a Harbour and a set of coordinates (latitude, longitude).
     *
     * @param Harbour $harbour
     * @param float $latitude
     * @param float $longitude
     * @return float|null Distance in kilometers, or null if unroutable.
     */
    public function calculateDistance(Harbour $harbour, float $latitude, float $longitude): ?float
    {
        if (!$harbour->latitude || !$harbour->longitude) {
            Log::warning('Harbour coordinates are missing. Cannot calculate distance.');
            return null;
        }

        $origin = "{$harbour->latitude},{$harbour->longitude}";
        $destination = "{$latitude},{$longitude}";

        $apiKey = $this->getApiKey();
        if (!$apiKey) {
            Log::warning('Google Maps API key is missing for calculateDistance. Using Haversine distance fallback.');
            return $this->haversineDistance((float)$harbour->latitude, (float)$harbour->longitude, $latitude, $longitude);
        }

        try {
            $response = Http::get('https://maps.googleapis.com/maps/api/distancematrix/json', [
                'origins' => $origin,
                'destinations' => $destination,
                'key' => $apiKey,
            ]);

            $data = $response->json();

            if (isset($data['status']) && $data['status'] === 'OK') {
                $element = $data['rows'][0]['elements'][0];
                
                if (isset($element['status']) && $element['status'] === 'OK') {
                    // Distance is returned in meters, convert to kilometers
                    $distanceKm = $element['distance']['value'] / 1000;
                    return (float) $distanceKm;
                } else {
                    Log::warning('Distance Matrix elements returned status: ' . ($element['status'] ?? 'unknown') . '. Using Haversine distance fallback.');
                    return $this->haversineDistance((float)$harbour->latitude, (float)$harbour->longitude, $latitude, $longitude);
                }
            } else {
                Log::error('Google Maps Distance Matrix API error in calculateDistance. Using Haversine distance fallback.', ['response' => $data]);
                return $this->haversineDistance((float)$harbour->latitude, (float)$harbour->longitude, $latitude, $longitude);
            }

        } catch (\Exception $e) {
            Log::error('GeoRoutingService calculateDistance Error: ' . $e->getMessage() . '. Using Haversine distance fallback.');
            return $this->haversineDistance((float)$harbour->latitude, (float)$harbour->longitude, $latitude, $longitude);
        }
    }
}
