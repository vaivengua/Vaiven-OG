import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// Global tracking state to persist across component unmounts
const globalTrackingState = new Map<string, {
  watchId: number | null;
  isTracking: boolean;
  shipmentId: string;
}>();

interface TrackingData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
}

interface UseGPSTrackingProps {
  shipmentId: string;
  transporterUserId: string;
  isTracking: boolean;
  onLocationUpdate?: (data: TrackingData) => void;
}

export function useGPSTracking({ 
  shipmentId, 
  transporterUserId, 
  isTracking, 
  onLocationUpdate 
}: UseGPSTrackingProps) {
  const [currentLocation, setCurrentLocation] = useState<TrackingData | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use global state to persist tracking across component unmounts
  const globalState = globalTrackingState.get(shipmentId) || { watchId: null, isTracking: false, shipmentId };
  const [watchId, setWatchId] = useState<number | null>(globalState.watchId);

  // Get current location
  const getCurrentLocation = useCallback((): Promise<TrackingData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      setIsGettingLocation(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: TrackingData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            speed: position.coords.speed,
            heading: position.coords.heading,
          };
          
          console.log('🌍 REAL GPS Location Retrieved:', {
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy: location.accuracy,
            speed: location.speed,
            timestamp: new Date().toISOString()
          });
          
          setCurrentLocation(location);
          setIsGettingLocation(false);
          resolve(location);
        },
        (error) => {
          const errorMessage = `Error getting location: ${error.message}`;
          setError(errorMessage);
          setIsGettingLocation(false);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }, []);

  // Start tracking
  const startTracking = useCallback(async () => {
    try {
      // Get initial location
      const location = await getCurrentLocation();
      
      // Save to database
      const { error: trackingError } = await supabase
        .from('shipment_tracking')
        .insert({
          shipment_id: shipmentId,
          transporter_user_id: transporterUserId,
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
          speed: location.speed,
          heading: location.heading,
        });

      if (trackingError) {
        console.error('Error saving tracking data:', trackingError);
        return;
      }

      // Update shipment with current location
      console.log('🔄 Updating shipment tracking status in database...');
      const { data: updateData, error: shipmentError } = await supabase
        .from('shipments')
        .update({
          tracking_enabled: true,
          tracking_started_at: new Date().toISOString(),
          current_latitude: location.latitude,
          current_longitude: location.longitude,
          last_location_update: new Date().toISOString(),
        })
        .eq('id', shipmentId)
        .select();

      if (shipmentError) {
        console.error('❌ Error updating shipment tracking:', shipmentError);
        return;
      }

      console.log('✅ Shipment tracking status updated successfully:', updateData);

      // Create tracking session
      const { error: sessionError } = await supabase
        .from('tracking_sessions')
        .insert({
          shipment_id: shipmentId,
          transporter_user_id: transporterUserId,
          is_active: true,
        });

      if (sessionError) {
        console.error('Error creating tracking session:', sessionError);
        return;
      }

      // Start watching position
      const id = navigator.geolocation.watchPosition(
        async (position) => {
          const newLocation: TrackingData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            speed: position.coords.speed,
            heading: position.coords.heading,
          };

          console.log('🔄 GPS Watch Update:', {
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
            accuracy: newLocation.accuracy,
            speed: newLocation.speed,
            timestamp: new Date().toISOString()
          });

          setCurrentLocation(newLocation);
          onLocationUpdate?.(newLocation);

          // Save to database
          const { error } = await supabase
            .from('shipment_tracking')
            .insert({
              shipment_id: shipmentId,
              transporter_user_id: transporterUserId,
              latitude: newLocation.latitude,
              longitude: newLocation.longitude,
              accuracy: newLocation.accuracy,
              speed: newLocation.speed,
              heading: newLocation.heading,
            });

          if (error) {
            console.error('Error saving tracking update:', error);
          }

          // Update shipment current location
          await supabase
            .from('shipments')
            .update({
              current_latitude: newLocation.latitude,
              current_longitude: newLocation.longitude,
              last_location_update: new Date().toISOString(),
            })
            .eq('id', shipmentId);
        },
        (error) => {
          console.error('Error watching position:', error);
          setError(`Tracking error: ${error.message}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 30000 // Update every 30 seconds
        }
      );

      setWatchId(id);
      
      // Save to global state to persist across component unmounts
      globalTrackingState.set(shipmentId, {
        watchId: id,
        isTracking: true,
        shipmentId
      });
    } catch (err) {
      console.error('Error starting tracking:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [shipmentId, transporterUserId, getCurrentLocation, onLocationUpdate]);

  // Stop tracking
  const stopTracking = useCallback(async () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    
    // Clear global state
    globalTrackingState.delete(shipmentId);

    try {
      // End tracking session
      const { error: sessionError } = await supabase
        .from('tracking_sessions')
        .update({
          is_active: false,
          ended_at: new Date().toISOString(),
        })
        .eq('shipment_id', shipmentId)
        .eq('transporter_user_id', transporterUserId)
        .eq('is_active', true);

      if (sessionError) {
        console.error('Error ending tracking session:', sessionError);
      }

      // Update shipment
      const { error: shipmentError } = await supabase
        .from('shipments')
        .update({
          tracking_enabled: false,
        })
        .eq('id', shipmentId);

      if (shipmentError) {
        console.error('Error updating shipment tracking:', shipmentError);
      }
    } catch (err) {
      console.error('Error stopping tracking:', err);
    }
  }, [watchId, shipmentId, transporterUserId]);

  // Cleanup on unmount - BUT ONLY if tracking is stopped
  useEffect(() => {
    return () => {
      // Only clear watch if tracking is explicitly stopped
      // This allows tracking to continue in background when dialog closes
      const globalState = globalTrackingState.get(shipmentId);
      if (watchId && (!isTracking || !globalState?.isTracking)) {
        navigator.geolocation.clearWatch(watchId);
        globalTrackingState.delete(shipmentId);
      }
    };
  }, [watchId, isTracking, shipmentId]);

  return {
    currentLocation,
    isGettingLocation,
    error,
    startTracking,
    stopTracking,
    getCurrentLocation,
  };
}
