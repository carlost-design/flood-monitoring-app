// Google Maps API integration utilities

export interface LatLng {
  lat: number;
  lng: number;
}

export interface DirectionsRequest {
  origin: LatLng;
  destination: LatLng;
  travelMode?: 'DRIVING' | 'WALKING' | 'TRANSIT';
}

export interface DistanceMatrixRequest {
  origins: LatLng[];
  destinations: LatLng[];
}

export class GoogleMapsService {
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';
  }

  // Calculate directions between two points
  async getDirections(request: DirectionsRequest): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Google Maps API key is required');
    }

    const { origin, destination, travelMode = 'DRIVING' } = request;
    
    const url = `https://maps.googleapis.com/maps/api/directions/json?` +
      `origin=${origin.lat},${origin.lng}&` +
      `destination=${destination.lat},${destination.lng}&` +
      `mode=${travelMode.toLowerCase()}&` +
      `key=${this.apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(`Directions API error: ${data.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching directions:', error);
      throw error;
    }
  }

  // Calculate distances to multiple destinations
  async getDistanceMatrix(request: DistanceMatrixRequest): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Google Maps API key is required');
    }

    const { origins, destinations } = request;
    
    const originsStr = origins.map(o => `${o.lat},${o.lng}`).join('|');
    const destinationsStr = destinations.map(d => `${d.lat},${d.lng}`).join('|');
    
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?` +
      `origins=${originsStr}&` +
      `destinations=${destinationsStr}&` +
      `units=metric&` +
      `key=${this.apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(`Distance Matrix API error: ${data.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching distance matrix:', error);
      throw error;
    }
  }

  // Get user's current location
  async getCurrentLocation(): Promise<LatLng> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  }

  // Open Google Maps with directions
  openMapsWithDirections(destination: string): void {
    const query = encodeURIComponent(destination);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
    window.open(url, '_blank');
  }

  // Open Google Maps search
  openMapsSearch(query: string, location?: LatLng): void {
    const searchQuery = encodeURIComponent(query);
    let url = `https://www.google.com/maps/search/${searchQuery}`;
    
    if (location) {
      url += `/@${location.lat},${location.lng},15z`;
    }
    
    window.open(url, '_blank');
  }
}

export const googleMapsService = new GoogleMapsService();
