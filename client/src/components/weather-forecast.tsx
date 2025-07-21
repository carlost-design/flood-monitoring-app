import type { WeatherForecast } from "@shared/schema";

interface WeatherForecastProps {
  weather: WeatherForecast[];
  isLoading: boolean;
}

export default function WeatherForecast({ weather, isLoading }: WeatherForecastProps) {
  const getIconColor = (condition: string) => {
    if (condition.toLowerCase().includes("rain") || condition.toLowerCase().includes("storm")) {
      return "text-blue-500";
    }
    if (condition.toLowerCase().includes("cloud")) {
      return "text-gray-400";
    }
    return "text-yellow-500";
  };

  const hasWeatherAlert = weather.some(w => w.precipitationChance > 80);

  return (
    <section className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
        <i className="fas fa-cloud-rain text-blue-500"></i>
        <span>Weather Forecast</span>
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="text-center p-4 border border-gray-200 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {weather.map((day) => (
            <div key={day.id} className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-sm font-medium text-gray-600 mb-2">{day.date}</div>
              <i className={`${day.icon} text-2xl mb-2 ${getIconColor(day.condition)}`}></i>
              <div className="text-sm text-gray-900 mb-1">{day.condition}</div>
              <div className="text-xs text-gray-600">{day.precipitationChance}% chance</div>
              <div className="text-sm font-semibold text-gray-900 mt-2">{day.temperature}°C</div>
            </div>
          ))}
        </div>
      )}

      {hasWeatherAlert && (
        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <i className="fas fa-exclamation-triangle text-orange-600 text-xl mt-1"></i>
            <div>
              <h3 className="font-semibold text-orange-800 mb-1">Weather Alert</h3>
              <p className="text-sm text-orange-700">
                Heavy rainfall expected for the next 48 hours. Monitor water levels closely and be prepared for potential evacuation.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
