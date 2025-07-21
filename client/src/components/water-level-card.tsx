import type { WaterLevelStation } from "@shared/schema";

interface WaterLevelCardProps {
  station: WaterLevelStation;
}

export default function WaterLevelCard({ station }: WaterLevelCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-700";
      case "warning":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "critical":
        return "HIGH RISK";
      case "warning":
        return "CAUTION";
      default:
        return "NORMAL";
    }
  };

  const getLevelColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-500";
      case "warning":
        return "text-orange-500";
      default:
        return "text-green-500";
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-500";
      case "warning":
        return "bg-orange-500";
      default:
        return "bg-green-500";
    }
  };

  const getProgressWidth = () => {
    const percentage = (station.currentLevel / station.criticalLevel) * 100;
    return Math.min(percentage, 100);
  };

  const getTrendIcon = () => {
    switch (station.trend) {
      case "rising":
        return "↑";
      case "falling":
        return "↓";
      default:
        return "→";
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">{station.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(station.status)}`}>
          {getStatusText(station.status)}
        </span>
      </div>
      
      <div className={`text-3xl font-bold mb-2 ${getLevelColor(station.status)}`}>
        {station.currentLevel}m
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
        <div 
          className={`h-3 rounded-full ${getProgressColor(station.status)}`}
          style={{ width: `${getProgressWidth()}%` }}
        ></div>
      </div>
      
      <p className="text-sm text-gray-600">
        Critical Level: {station.criticalLevel}m
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Trend: {station.trend.charAt(0).toUpperCase() + station.trend.slice(1)} ({getTrendIcon()}{Math.abs(station.trendValue)}m/hr)
      </p>
    </div>
  );
}
