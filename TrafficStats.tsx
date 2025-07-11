import React from 'react';
import { Activity, Clock, TrendingUp, MapPin } from 'lucide-react';
import { TrafficData } from '../types/traffic';

interface TrafficStatsProps {
  trafficData: TrafficData[];
}

const TrafficStats: React.FC<TrafficStatsProps> = ({ trafficData }) => {
  const avgCongestion = trafficData.reduce((sum, d) => sum + d.congestionLevel, 0) / trafficData.length;
  const avgSpeed = trafficData.reduce((sum, d) => sum + d.speed, 0) / trafficData.length;
  const totalVehicles = trafficData.reduce((sum, d) => sum + d.vehicleCount, 0);
  const highCongestionAreas = trafficData.filter(d => d.congestionLevel > 70).length;

  const stats = [
    {
      title: 'Average Congestion',
      value: `${avgCongestion.toFixed(1)}%`,
      icon: Activity,
      color: avgCongestion > 70 ? 'text-red-500' : avgCongestion > 40 ? 'text-yellow-500' : 'text-green-500',
      bgColor: avgCongestion > 70 ? 'bg-red-50' : avgCongestion > 40 ? 'bg-yellow-50' : 'bg-green-50',
    },
    {
      title: 'Average Speed',
      value: `${avgSpeed.toFixed(1)} km/h`,
      icon: Clock,
      color: avgSpeed < 20 ? 'text-red-500' : avgSpeed < 35 ? 'text-yellow-500' : 'text-green-500',
      bgColor: avgSpeed < 20 ? 'bg-red-50' : avgSpeed < 35 ? 'bg-yellow-50' : 'bg-green-50',
    },
    {
      title: 'Total Vehicles',
      value: totalVehicles.toLocaleString(),
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'High Congestion Areas',
      value: highCongestionAreas.toString(),
      icon: MapPin,
      color: highCongestionAreas > 3 ? 'text-red-500' : 'text-orange-500',
      bgColor: highCongestionAreas > 3 ? 'bg-red-50' : 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className={`p-6 rounded-lg shadow-lg ${stat.bgColor} border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrafficStats;