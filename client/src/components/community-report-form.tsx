import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { CommunityReport, InsertCommunityReport } from "@shared/schema";

const reportSchema = z.object({
  location: z.string().min(1, "Location is required"),
  waterLevel: z.enum(["normal", "rising", "flooded"]),
  details: z.string().optional(),
  reporterName: z.string().optional(),
  shareLocation: z.boolean().default(false),
});

type ReportForm = z.infer<typeof reportSchema>;

interface CommunityReportFormProps {
  communityReports: CommunityReport[];
  isLoading: boolean;
}

export default function CommunityReportForm({ communityReports, isLoading }: CommunityReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ReportForm>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      location: "",
      waterLevel: "normal",
      details: "",
      reporterName: "",
      shareLocation: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertCommunityReport) => {
      const response = await apiRequest("POST", "/api/community-reports", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community-reports"] });
      form.reset();
      toast({
        title: "Report Submitted",
        description: "Thank you for your report. Emergency services have been notified.",
      });
      setIsSubmitting(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: ReportForm) => {
    setIsSubmitting(true);
    
    let reportData: InsertCommunityReport = {
      location: data.location,
      waterLevel: data.waterLevel,
      details: data.details || undefined,
      reporterName: data.reporterName || undefined,
      shareLocation: data.shareLocation,
    };

    if (data.shareLocation && navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        reportData.latitude = position.coords.latitude;
        reportData.longitude = position.coords.longitude;
      } catch (error) {
        console.warn("Could not get location:", error);
      }
    }

    mutation.mutate(reportData);
  };

  const getReportStatusColor = (waterLevel: string) => {
    switch (waterLevel) {
      case "flooded":
        return "border-red-500 bg-red-50";
      case "rising":
        return "border-orange-500 bg-orange-50";
      default:
        return "border-green-500 bg-green-50";
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hr ago`;
    return `${Math.floor(diffMins / 1440)} day ago`;
  };

  return (
    <section className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
        <i className="fas fa-users text-blue-500"></i>
        <span>Community Water Level Report</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Your Location</Label>
              <div className="relative">
                <Input
                  {...form.register("location")}
                  placeholder="Enter street address or landmark"
                  className="pr-10"
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-3 text-gray-400 hover:text-blue-500"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition((position) => {
                        form.setValue("location", `${position.coords.latitude}, ${position.coords.longitude}`);
                      });
                    }
                  }}
                >
                  <i className="fas fa-location-arrow"></i>
                </button>
              </div>
              {form.formState.errors.location && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.location.message}</p>
              )}
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Water Level Status</Label>
              <RadioGroup
                value={form.watch("waterLevel")}
                onValueChange={(value) => form.setValue("waterLevel", value as "normal" | "rising" | "flooded")}
                className="space-y-3"
              >
                <div className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="normal" id="normal" />
                  <Label htmlFor="normal" className="ml-3 flex items-center space-x-2 cursor-pointer">
                    <i className="fas fa-check-circle text-green-500"></i>
                    <span className="text-gray-900 font-medium">Normal - Roads clear, no flooding</span>
                  </Label>
                </div>
                
                <div className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="rising" id="rising" />
                  <Label htmlFor="rising" className="ml-3 flex items-center space-x-2 cursor-pointer">
                    <i className="fas fa-exclamation-triangle text-orange-500"></i>
                    <span className="text-gray-900 font-medium">Rising - Water levels increasing</span>
                  </Label>
                </div>
                
                <div className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="flooded" id="flooded" />
                  <Label htmlFor="flooded" className="ml-3 flex items-center space-x-2 cursor-pointer">
                    <i className="fas fa-water text-red-500"></i>
                    <span className="text-gray-900 font-medium">Flooded - Road impassable</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Reporter Name (Optional)</Label>
              <Input
                {...form.register("reporterName")}
                placeholder="Your name (leave blank for anonymous)"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Additional Details</Label>
              <Textarea
                {...form.register("details")}
                rows={4}
                placeholder="Describe what you're seeing... (optional)"
              />
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox 
                id="shareLocation"
                checked={form.watch("shareLocation")}
                onCheckedChange={(checked) => form.setValue("shareLocation", checked as boolean)}
              />
              <Label htmlFor="shareLocation" className="text-sm text-gray-700">
                Share my exact location with emergency services
              </Label>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <i className="fas fa-paper-plane"></i>
              <span>{isSubmitting ? "Submitting..." : "Submit Report"}</span>
            </Button>
          </form>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Recent Community Reports</h3>
          {isLoading ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-l-4 border-gray-200 bg-gray-50 p-4 rounded-r-lg animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {communityReports.map((report) => (
                <div key={report.id} className={`border-l-4 p-4 rounded-r-lg ${getReportStatusColor(report.waterLevel)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">
                      {report.waterLevel === "flooded" ? "Flooding" : 
                       report.waterLevel === "rising" ? "Water Rising" : "All Clear"} - {report.location}
                    </h4>
                    <span className="text-xs text-gray-500">{getTimeAgo(report.createdAt)}</span>
                  </div>
                  {report.details && (
                    <p className="text-sm text-gray-700 mb-2">"{report.details}"</p>
                  )}
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span><i className="fas fa-map-marker-alt mr-1"></i>{report.location}</span>
                    <span><i className="fas fa-user mr-1"></i>{report.reporterName || "Anonymous"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
