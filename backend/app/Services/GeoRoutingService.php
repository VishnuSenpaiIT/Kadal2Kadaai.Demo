<?php

namespace App\Services;

use App\Models\Harbor;
use App\Models\PincodeDistance;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeoRoutingService
{
    /**
     * Get the transit time in hours from a Harbor to a Pincode.
     * Caches the result in the database to avoid hitting Google Maps API.
     *
     * @param Harbor $harbor
     * @param string $destinationPincode
     * @return int|null Transit time in hours, or null if unroutable.
     */
    public function getTransitTimeInHours(Harbor $harbor, string $destinationPincode): ?int
    {
        // 1. Check cache
        $cached = PincodeDistance::where('harbor_id', $harbor->id)
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
        $origin = "{$harbor->latitude},{$harbor->longitude}";
        if (!$harbor->latitude || !$harbor->longitude) {
            $origin = "{$harbor->city}, {$harbor->pincode}, India";
        }
        $destination = "{$destinationPincode}, India";

        $apiKey = env('GOOGLE_MAPS_API_KEY');
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

            if ($data['status'] === 'OK') {
                $element = $data['rows'][0]['elements'][0];
                
                if ($element['status'] === 'OK') {
                    $distanceKm = $element['distance']['value'] / 1000;
                    $durationMins = $element['duration']['value'] / 60;

                    PincodeDistance::create([
                        'harbor_id' => $harbor->id,
                        'destination_pincode' => $destinationPincode,
                        'distance_km' => $distanceKm,
                        'duration_minutes' => $durationMins,
                        'status' => 'OK',
                    ]);

                    return (int) ceil($durationMins / 60);
                } else {
                    PincodeDistance::create([
                        'harbor_id' => $harbor->id,
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
}
