import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const manualWaterStationSchema = z.object({
  name: z.string().min(1, "Station name is required"),
  location: z.string().min(1, "Location is required"),
  currentLevel: z.number().min(0, "Water level must be positive"),
  criticalLevel: z.number().min(0, "Critical level must be positive"),
  warningLevel: z.number().min(0, "Warning level must be positive"),
  status: z.enum(["normal", "warning", "critical"]),
  trend: z.enum(["rising", "falling", "stable"]),
  trendValue: z.number(),
});

type ManualWaterStationForm = z.infer<typeof manualWaterStationSchema>;

export default function AdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ManualWaterStationForm>({
    resolver: zodResolver(manualWaterStationSchema),
    defaultValues: {
      name: "",
      location: "",
      currentLevel: 0,
      criticalLevel: 8,
      warningLevel: 6,
      status: "normal",
      trend: "stable",
      trendValue: 0,
    },
  });

  const createStationMutation = useMutation({
    mutationFn: async (data: ManualWaterStationForm) => {
      const response = await fetch("/api/water-stations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create station");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/water-stations"] });
      toast({
        title: "Success",
        description: "Water level station added successfully",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add water level station",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ManualWaterStationForm) => {
    createStationMutation.mutate(data);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Panel
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
          Manually add water level data from Facebook posts
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add Water Level Station</CardTitle>
          <CardDescription>
            Enter water level data manually based on Facebook posts or other sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Station Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., San Mateo Bridge" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., San Mateo - Bridge Area" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="currentLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Level (m)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="7.8"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : "")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="warningLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warning Level (m)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="6.0"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : "")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="criticalLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Critical Level (m)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="8.0"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : "")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="trend"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trend</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select trend" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="rising">Rising</SelectItem>
                          <SelectItem value="falling">Falling</SelectItem>
                          <SelectItem value="stable">Stable</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="trendValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trend Value (m/hr)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="0.2 (positive for rising, negative for falling)"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={createStationMutation.isPending}
              >
                {createStationMutation.isPending ? "Adding..." : "Add Water Level Station"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            1. Visit the Facebook page and look for water level updates
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            2. Extract the water level information from the posts
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            3. Fill in the form above with the extracted data
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            4. The data will appear on the main dashboard immediately
          </p>
        </CardContent>
      </Card>
    </div>
  );
}