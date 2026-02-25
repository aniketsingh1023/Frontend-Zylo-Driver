/**
 * useLocationTracking Hook
 * Easy-to-use React hook for driver location tracking with SignalR
 */

import { useEffect, useRef, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';
import {
  locationHubService,
  LocationUpdate,
  DriverLocationUpdate,
} from '../signalr/LocationHub';

interface UseLocationTrackingOptions {
  enabled?: boolean;
  updateInterval?: number; // milliseconds
  distanceFilter?: number; // meters
}

interface UseLocationTrackingReturn {
  isConnected: boolean;
  currentLocation: { latitude: number; longitude: number } | null;
  error: string | null;
  startTracking: () => void;
  stopTracking: () => void;
}

export const useLocationTracking = (
  options: UseLocationTrackingOptions = {},
): UseLocationTrackingReturn => {
  const {
    enabled = false,
    updateInterval = 5000,
    distanceFilter = 10,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const watchIdRef = useRef<number | null>(null);
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const driverIdRef = useRef<string | null>(null);

  // Connect to SignalR hub
  useEffect(() => {
    const connectHub = async () => {
      try {
        await locationHubService.connect();
        setIsConnected(true);
        setError(null);
      } catch (err) {
        setError('Failed to connect to location service');
        console.error(err);
      }
    };

    if (enabled) {
      connectHub();
    }

    return () => {
      if (locationHubService.isConnected()) {
        locationHubService.disconnect();
      }
    };
  }, [enabled]);

  // Start location tracking
  const startTracking = () => {
    if (watchIdRef.current) {
      console.warn('Location tracking already started');
      return;
    }

    // Start watching device location
    watchIdRef.current = Geolocation.watchPosition(
      position => {
        const { latitude, longitude, speed, heading } = position.coords;
        setCurrentLocation({ latitude, longitude });

        // Send location to backend via SignalR
        if (locationHubService.isConnected()) {
          const locationUpdate: LocationUpdate = {
            driverId: driverIdRef.current || '',
            latitude,
            longitude,
            timestamp: new Date(),
            speed: speed || undefined,
            heading: heading || undefined,
          };

          locationHubService.updateLocation(locationUpdate);
        }
      },
      err => {
        setError(`Location error: ${err.message}`);
        console.error('Location error:', err);
      },
      {
        enableHighAccuracy: true,
        distanceFilter,
        interval: updateInterval,
        fastestInterval: updateInterval / 2,
      },
    );

    console.log('✅ Location tracking started');
  };

  // Stop location tracking
  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      Geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      console.log('Location tracking stopped');
    }

    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = null;
    }
  };

  // Auto start/stop based on enabled flag
  useEffect(() => {
    if (enabled && isConnected) {
      startTracking();
    } else {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  }, [enabled, isConnected]);

  return {
    isConnected,
    currentLocation,
    error,
    startTracking,
    stopTracking,
  };
};

/**
 * Hook for receiving location updates from other drivers
 */
export const useDriverLocationUpdates = (
  onLocationUpdate?: (update: DriverLocationUpdate) => void,
) => {
  useEffect(() => {
    if (onLocationUpdate) {
      locationHubService.onLocationUpdate(onLocationUpdate);
    }
  }, [onLocationUpdate]);
};

/**
 * Hook for listening to ride events
 */
export const useRideEvents = (
  onRideAssigned?: (rideData: any) => void,
  onRideCancelled?: (rideId: string) => void,
) => {
  useEffect(() => {
    if (onRideAssigned) {
      locationHubService.onRideAssigned(onRideAssigned);
    }
    if (onRideCancelled) {
      locationHubService.onRideCancelled(onRideCancelled);
    }
  }, [onRideAssigned, onRideCancelled]);
};
