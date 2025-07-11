import React, { useState, useEffect } from 'react';
import { Activity, Map, BarChart3, Route, Bell } from 'lucide-react';
import TrafficMap from './components/TrafficMap';
import TrafficChart from './components/TrafficChart';
import TrafficAlerts from './components/TrafficAlerts';
import TrafficStats from './components/TrafficStats';
import RouteOptimizer from './components/RouteOptimizer';
import { TrafficService } from './services/trafficService';
import { TrafficData, Route as RouteType, TrafficAlert, TimeSeriesData } from './types/traffic';

function App() {
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [alerts, setAlerts] = useState<TrafficAlert[]>([]);
  const [historicalData, setHistoricalData] = useState<TimeSeriesData[]>([]);
  const [currentRoute, setCurrentRoute] = useState<RouteType | undefined>();
  const [activeTab, setActiveTab] = useState<'map' | 'charts' | 'route'>('map');
  const [selectedLocation, setSelectedLocation] = useState<string>('Times Square');

  const trafficService = TrafficService.getInstance();

  useEffect(() => {
    // Subscribe to real-time traffic updates
    trafficService.subscribeToTrafficUpdates(setTrafficData);
    trafficService.subscribeToAlerts(setAlerts);
    
    // Start real-time updates
    trafficService.startRealTimeUpdates();
    
    // Load historical data
    loadHistoricalData();

    return () => {
      trafficService.stopRealTimeUpdates();
    };
  }, []);

  const loadHistoricalData = () => {
    const data = trafficService.getHistoricalData(selectedLocation);
    setHistoricalData(data);
  };

  const handleRouteGenerated = (route: RouteType) => {
    setCurrentRoute(route);
    setActiveTab('map');
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    console.log('Selected location:', lat, lng);
    // You can add logic here to handle location selection
  };

  const tabs = [
    { id: 'map', label: 'Traffic Map', icon: Map },
    { id: 'charts', label: 'Analytics', icon: BarChart3 },
    { id: 'route', label: 'Route Optimizer', icon: Route },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Traffic Predictor</h1>
                <p className="text-sm text-gray-500">Real-time traffic analysis & prediction</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-700">Live</span>
              </div>
              <div className="relative">
                <Bell className="h-5 w-5 text-gray-500" />
                {alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {alerts.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="mb-8">
          <TrafficStats trafficData={trafficData} />
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {activeTab === 'map' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Real-time Traffic Map</h2>
                <div className="h-96">
                  <TrafficMap 
                    trafficData={trafficData} 
                    route={currentRoute}
                    onLocationSelect={handleLocationSelect}
                  />
                </div>
              </div>
            )}

            {activeTab === 'charts' && (
              <div className="space-y-6">
                <TrafficChart 
                  data={historicalData} 
                  title="24-Hour Traffic Patterns"
                />
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Location Analytics</h3>
                  <select
                    value={selectedLocation}
                    onChange={(e) => {
                      setSelectedLocation(e.target.value);
                      setTimeout(loadHistoricalData, 100);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Times Square">Times Square</option>
                    <option value="Central Park">Central Park</option>
                    <option value="Brooklyn Bridge">Brooklyn Bridge</option>
                    <option value="Empire State Building">Empire State Building</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'route' && (
              <RouteOptimizer onRouteGenerated={handleRouteGenerated} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TrafficAlerts alerts={alerts} />
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Data Sources</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Prediction Model</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Update</span>
                  <span className="text-xs text-gray-500">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;