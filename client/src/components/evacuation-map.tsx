import { Button } from "@/components/ui/button";
import type { EvacuationCenter } from "@shared/schema";

interface EvacuationMapProps {
  evacuationCenters: EvacuationCenter[];
  isLoading: boolean;
}

export default function EvacuationMap({ evacuationCenters, isLoading }: EvacuationMapProps) {
  const getDirections = (center: EvacuationCenter) => {
    const query = encodeURIComponent(center.address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}`, '_blank');
  };

  const findNearest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const query = encodeURIComponent("evacuation center");
        window.open(`https://www.google.com/maps/search/${query}/@${latitude},${longitude},15z`, '_blank');
      });
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <i className="fas fa-map-marked-alt text-blue-500"></i>
          <span>Evacuation Centers & Routes</span>
        </h2>
        <Button 
          onClick={findNearest}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <i className="fas fa-location-arrow mr-2"></i>
          Find Nearest
        </Button>
      </div>

      {/* Map Placeholder */}
      <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center mb-6 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=600" 
          alt="Aerial city map view" 
          className="w-full h-full object-cover rounded-lg" 
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="bg-white bg-opacity-90 p-4 rounded-lg text-center">
            <i className="fas fa-map text-blue-500 text-3xl mb-2"></i>
            <p className="text-gray-900 font-semibold">Interactive Map</p>
            <p className="text-sm text-gray-600">Google Maps integration for real-time routing</p>
          </div>
        </div>
        
        {/* Map markers overlay */}
        <div className="absolute top-4 left-4 bg-red-500 text-white p-2 rounded-full shadow-lg">
          <i className="fas fa-exclamation text-sm"></i>
        </div>
        <div className="absolute top-1/2 right-1/3 bg-green-500 text-white p-2 rounded-full shadow-lg">
          <i className="fas fa-home text-sm"></i>
        </div>
        <div className="absolute bottom-1/4 left-1/2 bg-green-500 text-white p-2 rounded-full shadow-lg">
          <i className="fas fa-home text-sm"></i>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <i className="fas fa-home text-green-500"></i>
            <span>Nearest Evacuation Centers</span>
          </h3>
          
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {evacuationCenters.map((center) => (
                <div key={center.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{center.name}</h4>
                    <span className={`text-sm font-medium ${center.isOpen ? "text-green-600" : "text-red-600"}`}>
                      {center.isOpen ? "Open" : "Closed"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {center.address} • {center.distance ? `${center.distance}km away` : "Distance unknown"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Capacity: {center.capacity} people</span>
                    <Button 
                      onClick={() => getDirections(center)}
                      variant="ghost"
                      size="sm"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <i className="fas fa-directions mr-1"></i>Get Directions
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <i className="fas fa-route text-blue-500"></i>
            <span>Recommended Routes</span>
          </h3>
          <div className="space-y-3">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Route A - Main Street</h4>
                <span className="text-green-600 text-sm font-medium">Clear</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Via Oak Ave → Main St → School District</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Est. time: 12 minutes</span>
                <i className="fas fa-check-circle text-green-500"></i>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Route B - Highway 101</h4>
                <span className="text-orange-600 text-sm font-medium">Caution</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Via Pine St → Hwy 101 → North District</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Est. time: 18 minutes</span>
                <i className="fas fa-exclamation-triangle text-orange-500"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
