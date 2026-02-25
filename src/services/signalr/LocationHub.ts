/**
 * SignalR Location Hub Service
 * Handles real-time location updates between driver and backend
 */

import * as signalR from '@microsoft/signalr';
import { getLocalStorage } from '../../utils/helper';
import { API_CONFIG } from '../config/api.config';

export interface LocationUpdate {
  driverId: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  speed?: number;
  heading?: number;
}

export interface DriverLocationUpdate {
  driverId: string;
  latitude: number;
  longitude: number;
  isOnline: boolean;
  timestamp: string;
}

class LocationHubService {
  private connection: signalR.HubConnection | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000; // 3 seconds

  /**
   * Initialize SignalR connection
   */
  async connect(): Promise<void> {
    try {
      const token = await getLocalStorage('token');

      if (!token) {
        console.warn('No token found, cannot connect to LocationHub');
        return;
      }

      // Create connection
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`${API_CONFIG.BASE_URL}/hubs/location`, {
          accessTokenFactory: () => token,
          transport:
            signalR.HttpTransportType.WebSockets |
            signalR.HttpTransportType.LongPolling,
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: () => {
            return this.reconnectDelay;
          },
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Set up event handlers
      this.setupEventHandlers();

      // Start connection
      await this.connection.start();
      console.log('✅ SignalR LocationHub connected');
      this.reconnectAttempts = 0;
    } catch (error) {
      console.error('❌ SignalR connection error:', error);
      this.handleReconnect();
    }
  }

  /**
   * Setup SignalR event handlers
   */
  private setupEventHandlers(): void {
    if (!this.connection) return;

    // Connection events
    this.connection.onreconnecting(error => {
      console.warn('⚠️ SignalR reconnecting...', error);
    });

    this.connection.onreconnected(connectionId => {
      console.log('✅ SignalR reconnected:', connectionId);
      this.reconnectAttempts = 0;
    });

    this.connection.onclose(error => {
      console.warn('❌ SignalR connection closed', error);
      this.handleReconnect();
    });

    // Location update events (if backend sends driver location updates)
    this.connection.on(
      'ReceiveDriverLocation',
      (update: DriverLocationUpdate) => {
        console.log('📍 Received driver location:', update);
        // Handle incoming location updates (e.g., for nearby drivers)
      },
    );

    // Ride assignment event
    this.connection.on('RideAssigned', (rideData: any) => {
      console.log('🚗 Ride assigned:', rideData);
      // Handle ride assignment notification
    });

    // Other events as needed
    this.connection.on('RideCancelled', (rideId: string) => {
      console.log('❌ Ride cancelled:', rideId);
    });
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`,
      );

      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnect attempts reached. Please restart the app.');
    }
  }

  /**
   * Send driver location update to backend
   */
  async updateLocation(location: LocationUpdate): Promise<void> {
    if (
      !this.connection ||
      this.connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.warn('SignalR not connected, cannot send location');
      return;
    }

    try {
      await this.connection.invoke('UpdateDriverLocation', {
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: new Date().toISOString(),
        speed: location.speed || 0,
        heading: location.heading || 0,
      });
    } catch (error) {
      console.error('Error sending location update:', error);
    }
  }

  /**
   * Start sending location updates periodically
   */
  startLocationTracking(
    getCurrentLocation: () => LocationUpdate,
    interval: number = 5000,
  ): NodeJS.Timeout {
    return setInterval(async () => {
      const location = getCurrentLocation();
      await this.updateLocation(location);
    }, interval);
  }

  /**
   * Stop sending location updates
   */
  stopLocationTracking(intervalId: NodeJS.Timeout): void {
    clearInterval(intervalId);
  }

  /**
   * Subscribe to location updates for specific driver
   */
  async subscribeToDriver(driverId: string): Promise<void> {
    if (
      !this.connection ||
      this.connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.warn('SignalR not connected');
      return;
    }

    try {
      await this.connection.invoke('SubscribeToDriverLocation', driverId);
      console.log(`✅ Subscribed to driver: ${driverId}`);
    } catch (error) {
      console.error('Error subscribing to driver:', error);
    }
  }

  /**
   * Unsubscribe from driver location updates
   */
  async unsubscribeFromDriver(driverId: string): Promise<void> {
    if (
      !this.connection ||
      this.connection.state !== signalR.HubConnectionState.Connected
    ) {
      return;
    }

    try {
      await this.connection.invoke('UnsubscribeFromDriverLocation', driverId);
      console.log(`Unsubscribed from driver: ${driverId}`);
    } catch (error) {
      console.error('Error unsubscribing from driver:', error);
    }
  }

  /**
   * Register callback for receiving location updates
   */
  onLocationUpdate(callback: (update: DriverLocationUpdate) => void): void {
    if (!this.connection) return;
    this.connection.on('ReceiveDriverLocation', callback);
  }

  /**
   * Register callback for ride assignments
   */
  onRideAssigned(callback: (rideData: any) => void): void {
    if (!this.connection) return;
    this.connection.on('RideAssigned', callback);
  }

  /**
   * Register callback for ride cancellations
   */
  onRideCancelled(callback: (rideId: string) => void): void {
    if (!this.connection) return;
    this.connection.on('RideCancelled', callback);
  }

  /**
   * Disconnect from SignalR hub
   */
  async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log('SignalR disconnected');
      } catch (error) {
        console.error('Error disconnecting SignalR:', error);
      }
      this.connection = null;
    }
  }

  /**
   * Get connection state
   */
  getConnectionState(): signalR.HubConnectionState | null {
    return this.connection?.state || null;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

// Export singleton instance
export const locationHubService = new LocationHubService();
