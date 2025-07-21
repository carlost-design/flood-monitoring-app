import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertWaterLevelStation } from "@shared/schema";

interface FacebookUpdate {
  post: {
    id: string;
    message?: string;
    created_time: string;
    full_picture?: string;
  };
  station: InsertWaterLevelStation;
}

export default function FacebookData() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: facebookStations, isLoading: stationsLoading } = useQuery<InsertWaterLevelStation[]>({
    queryKey: ["/api/facebook/water-levels"],
    retry: 1,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const { data: latestUpdate, isLoading: updateLoading } = useQuery<FacebookUpdate>({
    queryKey: ["/api/facebook/latest-update"],
    retry: 1,
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/sync-facebook-data", {});
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/water-stations"] });
      toast({
        title: "Facebook Data Synced",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync Facebook data",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "bg-red-500";
      case "warning": return "bg-orange-500";
      default: return "bg-green-500";
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffMs = now.getTime() - postDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <i className="fab fa-facebook text-blue-600"></i>
            <span>Facebook Live Updates</span>
            <Badge variant="secondary" className="text-xs">San Mateo DPOS</Badge>
          </CardTitle>
          <Button 
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending}
            size="sm"
            variant="outline"
            className="border-blue-300 text-blue-600 hover:bg-blue-100"
          >
            <i className="fas fa-sync mr-1"></i>
            {syncMutation.isPending ? "Syncing..." : "Sync Now"}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Latest Update */}
        {updateLoading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-blue-200 rounded mb-2"></div>
            <div className="h-6 bg-blue-200 rounded mb-2"></div>
            <div className="h-3 bg-blue-200 rounded w-1/2"></div>
          </div>
        ) : latestUpdate ? (
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(latestUpdate.station.status)}`}></div>
                <h3 className="font-semibold text-gray-900">{latestUpdate.station.name}</h3>
                <Badge variant={latestUpdate.station.status === "critical" ? "destructive" : 
                              latestUpdate.station.status === "warning" ? "default" : "secondary"}>
                  {latestUpdate.station.status.toUpperCase()}
                </Badge>
              </div>
              <span className="text-xs text-gray-500">
                {getTimeAgo(latestUpdate.post.created_time)}
              </span>
            </div>
            
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {latestUpdate.station.currentLevel}m
            </div>
            
            {latestUpdate.post.message && (
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded italic">
                "{latestUpdate.post.message.substring(0, 150)}..."
              </p>
            )}
            
            <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
              <span>
                <i className="fas fa-map-marker-alt mr-1"></i>
                {latestUpdate.station.location}
              </span>
              <span>
                Trend: {latestUpdate.station.trend} ({latestUpdate.station.trendValue > 0 ? '+' : ''}{latestUpdate.station.trendValue}m/hr)
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <i className="fas fa-info-circle mb-2"></i>
            <p className="text-sm">No recent water level updates found on Facebook</p>
          </div>
        )}

        {/* All Facebook Stations */}
        {stationsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-lg p-3 border border-blue-200 animate-pulse">
                <div className="h-4 bg-blue-200 rounded mb-2"></div>
                <div className="h-6 bg-blue-200 rounded mb-1"></div>
                <div className="h-3 bg-blue-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : facebookStations && facebookStations.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center space-x-1">
              <i className="fas fa-chart-line text-blue-500"></i>
              <span>All Facebook Water Level Data ({facebookStations.length})</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {facebookStations.map((station, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{station.name}</span>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(station.status)}`}></div>
                  </div>
                  <div className="text-lg font-bold text-blue-600">{station.currentLevel}m</div>
                  <div className="text-xs text-gray-600">{station.location}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <i className="fas fa-database mb-2"></i>
            <p className="text-sm">No Facebook water level data available</p>
            <p className="text-xs">Try clicking "Sync Now" to fetch latest posts</p>
          </div>
        )}

        {/* Facebook Link */}
        <div className="flex items-center justify-center pt-2 border-t border-blue-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open('https://facebook.com/sanmateo.dpos', '_blank')}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
          >
            <i className="fab fa-facebook mr-2"></i>
            View San Mateo DPOS Page
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}