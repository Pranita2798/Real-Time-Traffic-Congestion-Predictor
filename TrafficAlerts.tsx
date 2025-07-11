import React from 'react';
import { AlertTriangle, Clock, MapPin, Car } from 'lucide-react';
import { TrafficAlert } from '../types/traffic';

interface TrafficAlertsProps {
  alerts: TrafficAlert[];
}

const TrafficAlerts: React.FC<TrafficAlertsProps> = ({ alerts }) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'accident':
        return <AlertTriangle className="h-5 w-5" />;
      case 'construction':
        return <Clock className="h-5 w-5" />;
      case 'event':
        return <MapPin className="h-5 w-5" />;
      default:
        return <Car className="h-5 w-5" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 border-red-200 text-red-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-100 border-blue-200 text-blue-800';
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Traffic Alerts</h3>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {alerts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No current alerts</p>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 ${getAlertColor(alert.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium capitalize">{alert.type}</h4>
                      <span className={`inline-block w-2 h-2 rounded-full ${getSeverityBadgeColor(alert.severity)}`} />
                    </div>
                    <p className="text-sm mt-1">{alert.message}</p>
                    <p className="text-xs mt-2 opacity-75">
                      {new Date(alert.timestamp).toLocaleTimeString()} • 
                      {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TrafficAlerts;