import { pgTable, text, serial, integer, timestamp, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const waterLevelStations = pgTable("water_level_stations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  currentLevel: real("current_level").notNull(),
  criticalLevel: real("critical_level").notNull(),
  warningLevel: real("warning_level").notNull(),
  status: text("status").notNull(), // "normal", "warning", "critical"
  trend: text("trend").notNull(), // "rising", "falling", "stable"
  trendValue: real("trend_value").notNull(), // m/hr
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const evacuationCenters = pgTable("evacuation_centers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  capacity: integer("capacity").notNull(),
  isOpen: boolean("is_open").notNull().default(true),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  distance: real("distance"), // calculated distance from user
});

export const communityReports = pgTable("community_reports", {
  id: serial("id").primaryKey(),
  location: text("location").notNull(),
  waterLevel: text("water_level").notNull(), // "normal", "rising", "flooded"
  details: text("details"),
  reporterName: text("reporter_name"),
  shareLocation: boolean("share_location").notNull().default(false),
  latitude: real("latitude"),
  longitude: real("longitude"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const weatherForecast = pgTable("weather_forecast", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  condition: text("condition").notNull(),
  temperature: integer("temperature").notNull(),
  precipitationChance: integer("precipitation_chance").notNull(),
  icon: text("icon").notNull(),
});

export const emergencyContacts = pgTable("emergency_contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  phoneNumber: text("phone_number").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
});

// Insert schemas
export const insertWaterLevelStationSchema = createInsertSchema(waterLevelStations).omit({ id: true, lastUpdated: true });
export const insertEvacuationCenterSchema = createInsertSchema(evacuationCenters).omit({ id: true, distance: true });
export const insertCommunityReportSchema = createInsertSchema(communityReports).omit({ id: true, createdAt: true });
export const insertWeatherForecastSchema = createInsertSchema(weatherForecast).omit({ id: true });
export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).omit({ id: true });

// Types
export type WaterLevelStation = typeof waterLevelStations.$inferSelect;
export type InsertWaterLevelStation = z.infer<typeof insertWaterLevelStationSchema>;
export type EvacuationCenter = typeof evacuationCenters.$inferSelect;
export type InsertEvacuationCenter = z.infer<typeof insertEvacuationCenterSchema>;
export type CommunityReport = typeof communityReports.$inferSelect;
export type InsertCommunityReport = z.infer<typeof insertCommunityReportSchema>;
export type WeatherForecast = typeof weatherForecast.$inferSelect;
export type InsertWeatherForecast = z.infer<typeof insertWeatherForecastSchema>;
export type EmergencyContact = typeof emergencyContacts.$inferSelect;
export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;
