import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation } from 'lucide-react';

export default function GPSTest() {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('🌍 GPS Test - Real Location:', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed,
          heading: position.coords.heading,
          timestamp: new Date(position.timestamp).toISOString()
        });
        
        setLocation(position);
        setLoading(false);
      },
      (error) => {
        console.error('GPS Test Error:', error);
        setError(`Error: ${error.message}`);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          GPS Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={getCurrentLocation} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Getting Location...
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4 mr-2" />
              Test GPS Location
            </>
          )}
        </Button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {location && (
          <div className="space-y-2">
            <Badge variant="default" className="bg-green-600">
              ✅ GPS Working
            </Badge>
            <div className="text-sm space-y-1">
              <p><strong>Latitude:</strong> {location.coords.latitude.toFixed(6)}</p>
              <p><strong>Longitude:</strong> {location.coords.longitude.toFixed(6)}</p>
              <p><strong>Accuracy:</strong> {location.coords.accuracy?.toFixed(1)}m</p>
              {location.coords.speed && (
                <p><strong>Speed:</strong> {location.coords.speed.toFixed(1)} m/s</p>
              )}
              <p><strong>Time:</strong> {new Date(location.timestamp).toLocaleString()}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
