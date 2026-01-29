import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Clock, Speed } from 'lucide-react';
import { useGPSTracking } from '@/hooks/useGPSTracking';
import { useAuth } from '@/contexts/AuthContext';

interface TrackingData {
  id: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  timestamp: string;
}

interface TrackingMapProps {
  shipmentId: string;
  isTracking: boolean;
  onStartTracking: () => void;
  onStopTracking: () => void;
}

export default function TrackingMap({ 
  shipmentId, 
  isTracking, 
  onStartTracking, 
  onStopTracking 
}: TrackingMapProps) {
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTracking, setCurrentTracking] = useState(false);
  const [shipmentTrackingStatus, setShipmentTrackingStatus] = useState(false);

  // Get user ID for GPS tracking
  const { user } = useAuth();
  const transporterUserId = user?.id;

  // Use GPS tracking hook
  const {
    currentLocation: gpsLocation,
    isGettingLocation,
    error: gpsError,
    startTracking,
    stopTracking,
  } = useGPSTracking({
    shipmentId,
    transporterUserId: transporterUserId || '',
    isTracking: currentTracking,
    onLocationUpdate: (data) => {
      console.log('📍 GPS Location Update:', data);
      console.log('📍 Real coordinates:', {
        lat: data.latitude,
        lng: data.longitude,
        accuracy: data.accuracy,
        speed: data.speed
      });
    }
  });

  // Debug: Log GPS location when it changes
  useEffect(() => {
    if (gpsLocation) {
      console.log('🎯 Current GPS Location:', gpsLocation);
      console.log('🎯 Is this real location?', {
        latitude: gpsLocation.latitude,
        longitude: gpsLocation.longitude,
        accuracy: gpsLocation.accuracy,
        speed: gpsLocation.speed
      });
    }
  }, [gpsLocation]);

  // Custom icons
  const startIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const currentIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Check tracking status from database
  const checkTrackingStatus = async () => {
    try {
      const { data: shipment, error } = await supabase
        .from('shipments')
        .select('tracking_enabled, tracking_started_at')
        .eq('id', shipmentId)
        .single();

      if (error) throw error;

      console.log('📊 Shipment tracking status:', shipment);
      console.log('📊 tracking_enabled value:', shipment.tracking_enabled);
      console.log('📊 Boolean conversion:', !!shipment.tracking_enabled);
      console.log('📊 Setting shipmentTrackingStatus to:', shipment.tracking_enabled || false);
      setShipmentTrackingStatus(shipment.tracking_enabled || false);
      setCurrentTracking(shipment.tracking_enabled || false);
    } catch (err) {
      console.error('Error checking tracking status:', err);
    }
  };

  // Load tracking data
  const loadTrackingData = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('shipment_tracking')
        .select('*')
        .eq('shipment_id', shipmentId)
        .order('timestamp', { ascending: true });

      if (error) throw error;

      setTrackingData(data || []);
    } catch (err) {
      console.error('Error loading tracking data:', err);
      setError(err instanceof Error ? err.message : 'Error loading tracking data');
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!shipmentId) return;

    console.log('🔄 TrackingMap useEffect - Checking tracking status for shipment:', shipmentId);
    
    // Check tracking status first
    checkTrackingStatus();
    
    // Load initial data
    loadTrackingData();

    // Set up real-time subscription
    const channel = supabase
      .channel(`tracking_${shipmentId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'shipment_tracking',
          filter: `shipment_id=eq.${shipmentId}`,
        },
        (payload) => {
          const newData = payload.new as TrackingData;
          setTrackingData(prev => [...prev, newData]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [shipmentId]);

  // Get route coordinates for polyline
  const routeCoordinates = trackingData.map(point => [point.latitude, point.longitude] as [number, number]);

  // Get current location (last tracking point)
  const currentLocation = trackingData.length > 0 ? trackingData[trackingData.length - 1] : null;

  // Get start location (first tracking point)
  const startLocation = trackingData.length > 0 ? trackingData[0] : null;

  // Calculate total distance
  const calculateDistance = (coords: [number, number][]) => {
    if (coords.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < coords.length; i++) {
      const [lat1, lon1] = coords[i - 1];
      const [lat2, lon2] = coords[i];
      
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      totalDistance += R * c;
    }
    
    return totalDistance;
  };

  const totalDistance = calculateDistance(routeCoordinates);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-neutral-500">Cargando datos de seguimiento...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Error: {error}</p>
            <Button variant="outline" onClick={loadTrackingData} className="mt-2">
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* GPS Error Display */}
      {gpsError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="text-red-600">
              <p className="font-medium">Error de GPS:</p>
              <p className="text-sm">{gpsError}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tracking Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Seguimiento en Tiempo Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant={shipmentTrackingStatus ? "default" : "secondary"}>
                {shipmentTrackingStatus ? "Activo" : "Inactivo"}
              </Badge>
              {trackingData.length > 0 && (
                <div className="text-sm text-neutral-600">
                  {trackingData.length} puntos registrados
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {!shipmentTrackingStatus ? (
                <Button 
                  onClick={async () => {
                    try {
                      console.log('🚀 Starting GPS tracking...');
                      await startTracking();
                      setCurrentTracking(true);
                      setShipmentTrackingStatus(true);
                      onStartTracking();
                    } catch (error) {
                      console.error('Error starting tracking:', error);
                    }
                  }}
                  disabled={isGettingLocation}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isGettingLocation ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Iniciando...
                    </>
                  ) : (
                    <>
                      <Navigation className="h-4 w-4 mr-2" />
                      Iniciar Ruta
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={async () => {
                    try {
                      console.log('🛑 Stopping GPS tracking...');
                      await stopTracking();
                      setCurrentTracking(false);
                      setShipmentTrackingStatus(false);
                      onStopTracking();
                    } catch (error) {
                      console.error('Error stopping tracking:', error);
                    }
                  }}
                  variant="destructive"
                >
                  Detener Seguimiento
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      {trackingData.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="h-96 w-full">
              <MapContainer
                center={currentLocation ? [currentLocation.latitude, currentLocation.longitude] : [14.6349, -90.5069]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                className="rounded-lg"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* Start marker */}
                {startLocation && (
                  <Marker
                    position={[startLocation.latitude, startLocation.longitude]}
                    icon={startIcon}
                  >
                    <Popup>
                      <div>
                        <h3 className="font-semibold">Punto de Inicio</h3>
                        <p className="text-sm text-neutral-600">
                          {new Date(startLocation.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* Current location marker */}
                {currentLocation && (
                  <Marker
                    position={[currentLocation.latitude, currentLocation.longitude]}
                    icon={currentIcon}
                  >
                    <Popup>
                      <div>
                        <h3 className="font-semibold">Ubicación Actual</h3>
                        <p className="text-sm text-neutral-600">
                          {new Date(currentLocation.timestamp).toLocaleString()}
                        </p>
                        {currentLocation.speed && (
                          <p className="text-sm text-neutral-600">
                            Velocidad: {currentLocation.speed.toFixed(1)} km/h
                          </p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* Route polyline */}
                {routeCoordinates.length > 1 && (
                  <Polyline
                    positions={routeCoordinates}
                    color="blue"
                    weight={3}
                    opacity={0.7}
                  />
                )}
              </MapContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tracking Stats */}
      {trackingData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Estadísticas de Seguimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {totalDistance.toFixed(1)} km
                </div>
                <div className="text-sm text-neutral-600">Distancia Recorrida</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {trackingData.length}
                </div>
                <div className="text-sm text-neutral-600">Puntos Registrados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {currentLocation?.speed ? `${currentLocation.speed.toFixed(1)} km/h` : 'N/A'}
                </div>
                <div className="text-sm text-neutral-600">Velocidad Actual</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
