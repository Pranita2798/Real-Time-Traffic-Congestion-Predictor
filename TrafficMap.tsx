import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from 'react-leaflet';
import { TrafficData, Route } from '../types/traffic';
import 'leaflet/dist/leaflet.css';

interface TrafficMapProps {
  trafficData: TrafficData[];
  route?: Route;
  onLocationSelect?: (lat: number, lng: number) => void;
}

const TrafficMap: React.FC<TrafficMapProps> = ({ trafficData, route, onLocationSelect }) => {
  const mapRef = useRef<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const getCongestionColor = (level: number): string => {
    if (level < 30) return '#22c55e'; // Green
    if (level < 60) return '#eab308'; // Yellow
    if (level < 80) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getMarkerSize = (congestionLevel: number): number => {
    return Math.max(8, Math.min(20, congestionLevel / 5));
  };

  const handleMapClick = (event: any) => {
    const { lat, lng } = event.latlng;
    setSelectedLocation({ lat, lng });
    if (onLocationSelect) {
      onLocationSelect(lat, lng);
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.on('click', handleMapClick);
      return () => {
        mapRef.current.off('click', handleMapClick);
      };
    }
  }, []);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[40.7128, -74.0060]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {trafficData.map((traffic) => (
          <CircleMarker
            key={traffic.id}
            center={[traffic.lat, traffic.lng]}
            radius={getMarkerSize(traffic.congestionLevel)}
            fillColor={getCongestionColor(traffic.congestionLevel)}
            color="white"
            weight={2}
            opacity={0.8}
            fillOpacity={0.7}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{traffic.roadName}</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-semibold">Congestion:</span> {traffic.congestionLevel}%</p>
                  <p><span className="font-semibold">Speed:</span> {traffic.speed.toFixed(1)} km/h</p>
                  <p><span className="font-semibold">Vehicles:</span> {traffic.vehicleCount}</p>
                  <p><span className="font-semibold">Predicted:</span> {traffic.predictedCongestion}%</p>
                  <p className="text-xs text-gray-500">
                    Updated: {new Date(traffic.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {route && (
          <Polyline
            positions={[
              [route.start.lat, route.start.lng],
              ...route.waypoints.map(wp => [wp.lat, wp.lng] as [number, number]),
              [route.end.lat, route.end.lng]
            ]}
            color="#3b82f6"
            weight={4}
            opacity={0.7}
          />
        )}

        {selectedLocation && (
          <CircleMarker
            center={[selectedLocation.lat, selectedLocation.lng]}
            radius={8}
            fillColor="#8b5cf6"
            color="white"
            weight={2}
            opacity={1}
            fillOpacity={0.8}
          >
            <Popup>
              <div className="p-2">
                <p className="font-semibold">Selected Location</p>
                <p className="text-sm">
                  {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
};

export default TrafficMap;