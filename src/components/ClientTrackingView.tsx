import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Clock, Speed, Truck } from 'lucide-react';

interface TrackingData {
  id: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  timestamp: string;
}

interface ClientTrackingViewProps {
  shipmentId: string;
}

export default function ClientTrackingView({ shipmentId }: ClientTrackingViewProps) {
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

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

  const truckIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Load tracking data
  const loadTrackingData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get shipment tracking status
      const { data: shipment, error: shipmentError } = await supabase
        .from('shipments')
        .select('tracking_enabled, current_latitude, current_longitude, last_location_update')
        .eq('id', shipmentId)
        .single();

      if (shipmentError) throw shipmentError;

      console.log('🔍 ClientTrackingView - Shipment tracking status:', shipment);
      console.log('🔍 ClientTrackingView - tracking_enabled:', shipment.tracking_enabled);
      setIsTracking(shipment.tracking_enabled || false);

      // Get tracking history
      const { data, error } = await supabase
        .from('shipment_tracking')
        .select('*')
        .eq('shipment_id', shipmentId)
        .order('timestamp', { ascending: true });

      if (error) throw error;

      console.log('🔍 ClientTrackingView - Tracking data loaded:', data?.length || 0, 'points');
      setTrackingData(data || []);
      
      // If we have tracking data but tracking_enabled is false, assume tracking is active
      if ((data && data.length > 0) && !shipment.tracking_enabled) {
        console.log('🔍 ClientTrackingView - Found tracking data but tracking_enabled is false, assuming tracking is active');
        setIsTracking(true);
      }
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

    // Load initial data
    loadTrackingData();

    // Set up real-time subscription for tracking updates
    const channel = supabase
      .channel(`client_tracking_${shipmentId}`)
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
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'shipments',
          filter: `id=eq.${shipmentId}`,
        },
        (payload) => {
          const updatedShipment = payload.new as any;
          console.log('🔄 ClientTrackingView - Real-time shipment update:', updatedShipment);
          console.log('🔄 ClientTrackingView - tracking_enabled from update:', updatedShipment.tracking_enabled);
          setIsTracking(updatedShipment.tracking_enabled || false);
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
            <p className="text-neutral-500">Cargando seguimiento...</p>
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
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isTracking) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Truck className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Seguimiento no iniciado
            </h3>
            <p className="text-neutral-500">
              El transportista aún no ha iniciado el seguimiento GPS
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tracking Status */}
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
              <Badge variant="default" className="bg-green-600">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                En Ruta
              </Badge>
              {trackingData.length > 0 && (
                <div className="text-sm text-neutral-600">
                  {trackingData.length} puntos registrados
                </div>
              )}
            </div>
            <div className="text-sm text-neutral-600">
              Última actualización: {currentLocation ? new Date(currentLocation.timestamp).toLocaleString() : 'N/A'}
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
                    icon={truckIcon}
                  >
                    <Popup>
                      <div>
                        <h3 className="font-semibold">🚛 Transportista</h3>
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
              Progreso del Envío
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
                  {currentLocation?.speed ? `${currentLocation.speed.toFixed(1)} km/h` : 'N/A'}
                </div>
                <div className="text-sm text-neutral-600">Velocidad Actual</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {trackingData.length}
                </div>
                <div className="text-sm text-neutral-600">Puntos Registrados</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
