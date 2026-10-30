import { LocationData } from '../types';

export class LocationService {
  private static instance: LocationService;
  private currentLocation: LocationData = {
    latitude: 26.8467,
    longitude: 80.9462,
    accuracyMeters: 12,
    address: 'House #42, Ward 3, Rampur Kalan, Sadar Block, Lucknow, Uttar Pradesh',
    timestamp: 'Just now',
    isSimulated: true,
    permissionState: 'prompt',
  };

  private constructor() {
    this.checkPermissionStatus();
  }

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  public async checkPermissionStatus(): Promise<LocationData['permissionState']> {
    if (typeof navigator !== 'undefined' && (navigator as any).permissions) {
      try {
        const result = await (navigator as any).permissions.query({ name: 'geolocation' });
        this.currentLocation.permissionState = result.state as any;
        return result.state as any;
      } catch (e) {
        // Fallback
      }
    }
    return this.currentLocation.permissionState;
  }

  public async requestLiveLocation(): Promise<LocationData> {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return this.getSimulatedLocation();
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.currentLocation = {
            latitude: Number(pos.coords.latitude.toFixed(5)),
            longitude: Number(pos.coords.longitude.toFixed(5)),
            accuracyMeters: Math.round(pos.coords.accuracy),
            address: `Live GPS: Lat ${pos.coords.latitude.toFixed(4)}, Long ${pos.coords.longitude.toFixed(4)} (Device Geolocation)`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSimulated: false,
            permissionState: 'granted',
          };
          resolve(this.currentLocation);
        },
        (err) => {
          console.warn('Geolocation failed or permission denied:', err.message);
          // Fall back gracefully to verified simulated address
          const sim = this.getSimulatedLocation();
          sim.permissionState = 'denied';
          resolve(sim);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    });
  }

  public getSimulatedLocation(): LocationData {
    return {
      latitude: 26.8467,
      longitude: 80.9462,
      accuracyMeters: 8,
      address: 'Rampur Kalan Sub-Centre Ward 3, Sadar Block, Lucknow, UP (Simulated Home Geolocation)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSimulated: true,
      permissionState: this.currentLocation.permissionState,
    };
  }

  public getCurrentLocation(): LocationData {
    return { ...this.currentLocation };
  }
}

export const locationService = LocationService.getInstance();

