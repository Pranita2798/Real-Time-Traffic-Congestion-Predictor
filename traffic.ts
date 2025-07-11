export interface TrafficData {
  id: string;
  lat: number;
  lng: number;
  congestionLevel: number; // 0-100
  speed: number; // km/h
  timestamp: string;
  roadName: string;
  vehicleCount: number;
  predictedCongestion: number;
}

export interface Route {
  id: string;
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  distance: number;
  duration: number;
  congestionScore: number;
  waypoints: { lat: number; lng: number }[];
}

export interface TrafficAlert {
  id: string;
  type: 'congestion' | 'accident' | 'construction' | 'event';
  severity: 'low' | 'medium' | 'high';
  location: { lat: number; lng: number };
  message: string;
  timestamp: string;
}

export interface TimeSeriesData {
  time: string;
  congestion: number;
  speed: number;
  volume: number;
}