import { TrafficData, Route, TrafficAlert, TimeSeriesData } from '../types/traffic';

// Simulate real-time traffic data generation
export class TrafficService {
  private static instance: TrafficService;
  private subscribers: ((data: TrafficData[]) => void)[] = [];
  private alertSubscribers: ((alerts: TrafficAlert[]) => void)[] = [];
  private currentData: TrafficData[] = [];
  private alerts: TrafficAlert[] = [];
  private updateInterval: NodeJS.Timeout | null = null;

  static getInstance(): TrafficService {
    if (!TrafficService.instance) {
      TrafficService.instance = new TrafficService();
    }
    return TrafficService.instance;
  }

  private constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    // Initialize with sample traffic data for major intersections
    const locations = [
      { lat: 40.7128, lng: -74.0060, name: 'Times Square' },
      { lat: 40.7614, lng: -73.9776, name: 'Central Park South' },
      { lat: 40.7505, lng: -73.9934, name: 'Herald Square' },
      { lat: 40.7282, lng: -73.9942, name: 'Union Square' },
      { lat: 40.7178, lng: -74.0014, name: 'Financial District' },
      { lat: 40.7831, lng: -73.9712, name: 'Upper East Side' },
      { lat: 40.7489, lng: -73.9680, name: 'Midtown East' },
      { lat: 40.7549, lng: -73.9840, name: 'Theatre District' },
    ];

    this.currentData = locations.map((loc, index) => ({
      id: `traffic-${index}`,
      lat: loc.lat,
      lng: loc.lng,
      congestionLevel: Math.floor(Math.random() * 100),
      speed: 20 + Math.random() * 40,
      timestamp: new Date().toISOString(),
      roadName: loc.name,
      vehicleCount: Math.floor(Math.random() * 200) + 50,
      predictedCongestion: Math.floor(Math.random() * 100),
    }));
  }

  startRealTimeUpdates(): void {
    if (this.updateInterval) return;

    this.updateInterval = setInterval(() => {
      this.updateTrafficData();
      this.updateAlerts();
    }, 5000);
  }

  stopRealTimeUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  private updateTrafficData(): void {
    this.currentData = this.currentData.map(data => ({
      ...data,
      congestionLevel: Math.max(0, Math.min(100, data.congestionLevel + (Math.random() - 0.5) * 20)),
      speed: Math.max(5, Math.min(60, data.speed + (Math.random() - 0.5) * 10)),
      timestamp: new Date().toISOString(),
      vehicleCount: Math.max(10, Math.min(300, data.vehicleCount + Math.floor((Math.random() - 0.5) * 30))),
      predictedCongestion: Math.max(0, Math.min(100, data.predictedCongestion + (Math.random() - 0.5) * 15)),
    }));

    this.subscribers.forEach(callback => callback(this.currentData));
  }

  private updateAlerts(): void {
    // Randomly generate alerts
    if (Math.random() < 0.3) {
      const location = this.currentData[Math.floor(Math.random() * this.currentData.length)];
      const alertTypes = ['congestion', 'accident', 'construction', 'event'] as const;
      const severities = ['low', 'medium', 'high'] as const;
      
      const newAlert: TrafficAlert = {
        id: `alert-${Date.now()}`,
        type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        location: { lat: location.lat, lng: location.lng },
        message: this.generateAlertMessage(alertTypes[Math.floor(Math.random() * alertTypes.length)]),
        timestamp: new Date().toISOString(),
      };

      this.alerts.unshift(newAlert);
      this.alerts = this.alerts.slice(0, 10); // Keep only latest 10 alerts
      
      this.alertSubscribers.forEach(callback => callback(this.alerts));
    }
  }

  private generateAlertMessage(type: string): string {
    const messages = {
      congestion: 'Heavy traffic congestion detected',
      accident: 'Traffic accident reported',
      construction: 'Road construction causing delays',
      event: 'Special event affecting traffic flow',
    };
    return messages[type as keyof typeof messages] || 'Traffic alert';
  }

  subscribeToTrafficUpdates(callback: (data: TrafficData[]) => void): void {
    this.subscribers.push(callback);
    callback(this.currentData); // Send initial data
  }

  subscribeToAlerts(callback: (alerts: TrafficAlert[]) => void): void {
    this.alertSubscribers.push(callback);
    callback(this.alerts); // Send initial alerts
  }

  getCurrentTrafficData(): TrafficData[] {
    return this.currentData;
  }

  getHistoricalData(location: string): TimeSeriesData[] {
    // Generate mock historical data for the past 24 hours
    const data: TimeSeriesData[] = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const basePattern = Math.sin((time.getHours() / 24) * Math.PI * 2) * 30 + 50;
      
      data.push({
        time: time.toISOString(),
        congestion: Math.max(0, Math.min(100, basePattern + (Math.random() - 0.5) * 20)),
        speed: Math.max(10, Math.min(60, 60 - (basePattern / 100) * 40)),
        volume: Math.max(20, Math.min(200, basePattern * 2 + (Math.random() - 0.5) * 40)),
      });
    }
    
    return data;
  }

  generateOptimalRoute(start: { lat: number; lng: number }, end: { lat: number; lng: number }): Route {
    // Simulate route generation with traffic considerations
    const distance = this.calculateDistance(start, end);
    const avgCongestion = this.currentData.reduce((sum, d) => sum + d.congestionLevel, 0) / this.currentData.length;
    
    return {
      id: `route-${Date.now()}`,
      start,
      end,
      distance,
      duration: Math.round((distance / 30) * 60 * (1 + avgCongestion / 100)), // minutes
      congestionScore: avgCongestion,
      waypoints: this.generateWaypoints(start, end),
    };
  }

  private calculateDistance(start: { lat: number; lng: number }, end: { lat: number; lng: number }): number {
    const R = 6371; // Earth's radius in km
    const dLat = (end.lat - start.lat) * Math.PI / 180;
    const dLon = (end.lng - start.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(start.lat * Math.PI / 180) * Math.cos(end.lat * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private generateWaypoints(start: { lat: number; lng: number }, end: { lat: number; lng: number }): { lat: number; lng: number }[] {
    const waypoints = [];
    const steps = 5;
    
    for (let i = 1; i < steps; i++) {
      const ratio = i / steps;
      waypoints.push({
        lat: start.lat + (end.lat - start.lat) * ratio,
        lng: start.lng + (end.lng - start.lng) * ratio,
      });
    }
    
    return waypoints;
  }
}