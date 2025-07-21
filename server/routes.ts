import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCommunityReportSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Water Level Stations
  app.get("/api/water-stations", async (req, res) => {
    try {
      const stations = await storage.getWaterLevelStations();
      res.json(stations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch water level stations" });
    }
  });

  app.get("/api/water-stations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const station = await storage.getWaterLevelStation(id);
      if (!station) {
        return res.status(404).json({ message: "Water level station not found" });
      }
      res.json(station);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch water level station" });
    }
  });

  // Evacuation Centers
  app.get("/api/evacuation-centers", async (req, res) => {
    try {
      const centers = await storage.getEvacuationCenters();
      res.json(centers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch evacuation centers" });
    }
  });

  // Community Reports
  app.get("/api/community-reports", async (req, res) => {
    try {
      const reports = await storage.getCommunityReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch community reports" });
    }
  });

  app.post("/api/community-reports", async (req, res) => {
    try {
      const validatedData = insertCommunityReportSchema.parse(req.body);
      const report = await storage.createCommunityReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid report data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create community report" });
    }
  });

  // Weather Forecast
  app.get("/api/weather", async (req, res) => {
    try {
      const forecast = await storage.getWeatherForecast();
      res.json(forecast);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weather forecast" });
    }
  });

  // Emergency Contacts
  app.get("/api/emergency-contacts", async (req, res) => {
    try {
      const contacts = await storage.getEmergencyContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch emergency contacts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
