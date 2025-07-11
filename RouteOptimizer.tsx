import React, { useState } from 'react';
import { Navigation, MapPin, Clock, TrendingUp } from 'lucide-react';
import { Route } from '../types/traffic';
import { TrafficService } from '../services/trafficService';

interface RouteOptimizerProps {
  onRouteGenerated: (route: Route) => void;
}

const RouteOptimizer: React.FC<RouteOptimizerProps> = ({ onRouteGenerated }) => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(false);

  const trafficService = TrafficService.getInstance();

  const generateRoute = async () => {
    if (!startLocation || !endLocation) return;

    setLoading(true);
    
    // Simulate geocoding with sample coordinates
    const sampleLocations = [
      { name: 'Times Square', lat: 40.7128, lng: -74.0060 },
      { name: 'Central Park', lat: 40.7614, lng: -73.9776 },
      { name: 'Brooklyn Bridge', lat: 40.7061, lng: -73.9969 },
      { name: 'Empire State Building', lat: 40.7484, lng: -73.9857 },
    ];

    const start = sampleLocations.find(loc => 
      loc.name.toLowerCase().includes(startLocation.toLowerCase())
    ) || sampleLocations[0];
    
    const end = sampleLocations.find(loc => 
      loc.name.toLowerCase().includes(endLocation.toLowerCase())
    ) || sampleLocations[1];

    setTimeout(() => {
      const generatedRoute = trafficService.generateOptimalRoute(
        { lat: start.lat, lng: start.lng },
        { lat: end.lat, lng: end.lng }
      );
      setRoute(generatedRoute);
      onRouteGenerated(generatedRoute);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center space-x-2">
        <Navigation className="h-5 w-5" />
        <span>Route Optimizer</span>
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
          <input
            type="text"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            placeholder="Enter start location"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
          <input
            type="text"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
            placeholder="Enter destination"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          onClick={generateRoute}
          disabled={loading || !startLocation || !endLocation}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Generating Route...' : 'Find Optimal Route'}
        </button>
        
        {route && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Route Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{route.distance.toFixed(1)} km</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{route.duration} min</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <span>{route.congestionScore.toFixed(1)}% congestion</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteOptimizer;