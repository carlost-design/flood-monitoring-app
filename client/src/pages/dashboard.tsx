import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import EmergencyAlert from "@/components/emergency-alert";
import WaterLevelCard from "@/components/water-level-card";
import EvacuationMap from "@/components/evacuation-map";
import CommunityReportForm from "@/components/community-report-form";
import WeatherForecast from "@/components/weather-forecast";
import EmergencyContacts from "@/components/emergency-contacts";
import MobileNavigation from "@/components/mobile-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import type { WaterLevelStation, EvacuationCenter, CommunityReport, WeatherForecast as WeatherType, EmergencyContact } from "@shared/schema";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showAlert, setShowAlert] = useState(true);
  const isMobile = useIsMobile();

  const { data: waterStations, isLoading: waterLoading } = useQuery<WaterLevelStation[]>({
    queryKey: ["/api/water-stations"],
  });

  const { data: evacuationCenters, isLoading: evacLoading } = useQuery<EvacuationCenter[]>({
    queryKey: ["/api/evacuation-centers"],
  });

  const { data: communityReports, isLoading: reportsLoading } = useQuery<CommunityReport[]>({
    queryKey: ["/api/community-reports"],
  });

  const { data: weather, isLoading: weatherLoading } = useQuery<WeatherType[]>({
    queryKey: ["/api/weather"],
  });

  const { data: emergencyContacts, isLoading: contactsLoading } = useQuery<EmergencyContact[]>({
    queryKey: ["/api/emergency-contacts"],
  });

  const hasHighRiskStation = waterStations?.some(station => station.status === "critical");

  const callEmergency = () => {
    window.location.href = 'tel:911';
  };

  const findNearestEvacuation = () => {
    setActiveSection("map");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log('User location:', position.coords.latitude, position.coords.longitude);
      });
    }
  };

  const reportWaterLevel = () => {
    setActiveSection("report");
  };

  const showShelters = () => {
    setActiveSection("map");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Emergency Alert */}
      {showAlert && hasHighRiskStation && (
        <EmergencyAlert 
          message="FLOOD WARNING - High water levels detected in downtown area"
          onClose={() => setShowAlert(false)}
        />
      )}

      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <i className="fas fa-water text-blue-500 text-3xl"></i>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">FloodWatch</h1>
                <p className="text-sm text-gray-600">Community Water Monitoring</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <button 
                onClick={() => setActiveSection("dashboard")}
                className={`${activeSection === "dashboard" ? "text-blue-500 font-semibold border-b-2 border-blue-500 pb-1" : "text-gray-600 hover:text-blue-500"} transition-colors`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveSection("map")}
                className={`${activeSection === "map" ? "text-blue-500 font-semibold border-b-2 border-blue-500 pb-1" : "text-gray-600 hover:text-blue-500"} transition-colors`}
              >
                Evacuation Map
              </button>
              <button 
                onClick={() => setActiveSection("report")}
                className={`${activeSection === "report" ? "text-blue-500 font-semibold border-b-2 border-blue-500 pb-1" : "text-gray-600 hover:text-blue-500"} transition-colors`}
              >
                Report
              </button>
              <button 
                onClick={() => setActiveSection("contacts")}
                className={`${activeSection === "contacts" ? "text-blue-500 font-semibold border-b-2 border-blue-500 pb-1" : "text-gray-600 hover:text-blue-500"} transition-colors`}
              >
                Emergency Contacts
              </button>
            </nav>
            <button className="md:hidden text-gray-600">
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-8 pb-24 md:pb-6">
        {/* Quick Actions */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            onClick={callEmergency}
            className="bg-red-500 hover:bg-red-600 text-white p-4 h-auto rounded-xl shadow-lg transition-colors flex flex-col items-center space-y-2"
          >
            <i className="fas fa-phone text-2xl"></i>
            <span className="font-semibold">Emergency</span>
            <span className="text-sm opacity-90">Call 911</span>
          </Button>
          
          <Button 
            onClick={findNearestEvacuation}
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 h-auto rounded-xl shadow-lg transition-colors flex flex-col items-center space-y-2"
          >
            <i className="fas fa-route text-2xl"></i>
            <span className="font-semibold">Evacuate</span>
            <span className="text-sm opacity-90">Find Route</span>
          </Button>
          
          <Button 
            onClick={reportWaterLevel}
            className="bg-orange-500 hover:bg-orange-600 text-white p-4 h-auto rounded-xl shadow-lg transition-colors flex flex-col items-center space-y-2"
          >
            <i className="fas fa-exclamation text-2xl"></i>
            <span className="font-semibold">Report</span>
            <span className="text-sm opacity-90">Water Level</span>
          </Button>
          
          <Button 
            onClick={showShelters}
            className="bg-green-500 hover:bg-green-600 text-white p-4 h-auto rounded-xl shadow-lg transition-colors flex flex-col items-center space-y-2"
          >
            <i className="fas fa-shield-alt text-2xl"></i>
            <span className="font-semibold">Shelters</span>
            <span className="text-sm opacity-90">Safe Zones</span>
          </Button>
        </section>

        {/* Dashboard Section */}
        {activeSection === "dashboard" && (
          <section className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <i className="fas fa-chart-line text-blue-500"></i>
                <span>Live Water Levels</span>
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <i className="fas fa-clock"></i>
                <span>Last updated: 2 minutes ago</span>
              </div>
            </div>

            {waterLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {waterStations?.map((station) => (
                  <WaterLevelCard key={station.id} station={station} />
                ))}
              </div>
            )}

            {/* Community Reports */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <i className="fas fa-users text-blue-600"></i>
                <span>Recent Community Reports</span>
              </h3>
              {reportsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start space-x-3 animate-pulse">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {communityReports?.slice(0, 3).map((report) => (
                    <div key={report.id} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                        report.waterLevel === "flooded" ? "bg-red-500" : 
                        report.waterLevel === "rising" ? "bg-orange-500" : "bg-green-500"
                      }`}>
                        {report.reporterName?.charAt(0).toUpperCase() || "A"}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <strong>{report.reporterName || "Anonymous"}</strong> reported {report.waterLevel} water levels near {report.location}.
                          <span className="text-xs text-gray-500 ml-2">
                            {new Date(report.createdAt).toLocaleString()}
                          </span>
                        </p>
                        {report.details && (
                          <p className="text-xs text-gray-600">"{report.details}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Evacuation Map Section */}
        {activeSection === "map" && (
          <EvacuationMap 
            evacuationCenters={evacuationCenters || []} 
            isLoading={evacLoading}
          />
        )}

        {/* Community Report Section */}
        {activeSection === "report" && (
          <CommunityReportForm 
            communityReports={communityReports || []} 
            isLoading={reportsLoading}
          />
        )}

        {/* Weather Forecast */}
        <WeatherForecast weather={weather || []} isLoading={weatherLoading} />

        {/* Emergency Contacts Section */}
        {activeSection === "contacts" && (
          <EmergencyContacts 
            contacts={emergencyContacts || []} 
            isLoading={contactsLoading}
          />
        )}
      </main>

      {/* Mobile Navigation */}
      {isMobile && (
        <MobileNavigation 
          onEmergency={callEmergency}
          onEvacuate={findNearestEvacuation}
          onReport={reportWaterLevel}
          onShelters={showShelters}
        />
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <i className="fas fa-water text-blue-400 text-2xl"></i>
                <span className="text-xl font-bold">FloodWatch</span>
              </div>
              <p className="text-gray-400 text-sm">Community-powered flood monitoring and emergency response system.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setActiveSection("dashboard")} className="hover:text-white transition-colors">Water Levels</button></li>
                <li><button onClick={() => setActiveSection("map")} className="hover:text-white transition-colors">Evacuation Map</button></li>
                <li><button onClick={() => setActiveSection("report")} className="hover:text-white transition-colors">Report Flooding</button></li>
                <li><button onClick={() => setActiveSection("contacts")} className="hover:text-white transition-colors">Emergency Contacts</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Emergency</h3>
              <p className="text-red-400 font-bold text-lg">Call 911</p>
              <p className="text-sm text-gray-400 mt-2">For immediate assistance during flooding emergencies</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 FloodWatch Emergency Monitoring System. Built for community safety.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
