import {
  waterLevelStations,
  evacuationCenters,
  communityReports,
  weatherForecast,
  emergencyContacts,
  type WaterLevelStation,
  type InsertWaterLevelStation,
  type EvacuationCenter,
  type InsertEvacuationCenter,
  type CommunityReport,
  type InsertCommunityReport,
  type WeatherForecast,
  type InsertWeatherForecast,
  type EmergencyContact,
  type InsertEmergencyContact,
} from "@shared/schema";

export interface IStorage {
  // Water Level Stations
  getWaterLevelStations(): Promise<WaterLevelStation[]>;
  getWaterLevelStation(id: number): Promise<WaterLevelStation | undefined>;
  createWaterLevelStation(station: InsertWaterLevelStation): Promise<WaterLevelStation>;
  updateWaterLevelStation(id: number, station: Partial<InsertWaterLevelStation>): Promise<WaterLevelStation | undefined>;
  
  // Evacuation Centers
  getEvacuationCenters(): Promise<EvacuationCenter[]>;
  getEvacuationCenter(id: number): Promise<EvacuationCenter | undefined>;
  createEvacuationCenter(center: InsertEvacuationCenter): Promise<EvacuationCenter>;
  
  // Community Reports
  getCommunityReports(): Promise<CommunityReport[]>;
  createCommunityReport(report: InsertCommunityReport): Promise<CommunityReport>;
  
  // Weather Forecast
  getWeatherForecast(): Promise<WeatherForecast[]>;
  createWeatherForecast(forecast: InsertWeatherForecast): Promise<WeatherForecast>;
  
  // Emergency Contacts
  getEmergencyContacts(): Promise<EmergencyContact[]>;
  createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact>;
}

export class MemStorage implements IStorage {
  private waterStations: Map<number, WaterLevelStation>;
  private evacCenters: Map<number, EvacuationCenter>;
  private reports: Map<number, CommunityReport>;
  private weather: Map<number, WeatherForecast>;
  private contacts: Map<number, EmergencyContact>;
  private currentId: number;

  constructor() {
    this.waterStations = new Map();
    this.evacCenters = new Map();
    this.reports = new Map();
    this.weather = new Map();
    this.contacts = new Map();
    this.currentId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Seed water level stations
    this.createWaterLevelStation({
      name: "Downtown Bridge",
      location: "Downtown Bridge Area",
      currentLevel: 8.7,
      criticalLevel: 9.0,
      warningLevel: 7.0,
      status: "critical",
      trend: "rising",
      trendValue: 0.3,
    });

    this.createWaterLevelStation({
      name: "Riverside Park",
      location: "Riverside Park Area",
      currentLevel: 5.4,
      criticalLevel: 8.0,
      warningLevel: 7.0,
      status: "warning",
      trend: "stable",
      trendValue: 0.1,
    });

    this.createWaterLevelStation({
      name: "Industrial District",
      location: "Industrial District",
      currentLevel: 3.2,
      criticalLevel: 8.5,
      warningLevel: 6.5,
      status: "normal",
      trend: "falling",
      trendValue: -0.1,
    });

    // Seed evacuation centers
    this.createEvacuationCenter({
      name: "Central High School",
      address: "1234 Education Ave",
      capacity: 500,
      isOpen: true,
      latitude: 40.7128,
      longitude: -74.0060,
    });

    this.createEvacuationCenter({
      name: "Community Center",
      address: "5678 Community Dr",
      capacity: 300,
      isOpen: true,
      latitude: 40.7589,
      longitude: -73.9851,
    });

    // Seed emergency contacts
    this.createEmergencyContact({
      name: "Emergency Services",
      description: "Fire, Police, Medical",
      phoneNumber: "911",
      category: "emergency",
      icon: "fas fa-ambulance",
      color: "danger",
    });

    this.createEmergencyContact({
      name: "Flood Control",
      description: "Water Management Dept",
      phoneNumber: "(555) 123-4567",
      category: "flood",
      icon: "fas fa-water",
      color: "water",
    });

    this.createEmergencyContact({
      name: "Emergency Management",
      description: "Disaster Response",
      phoneNumber: "(555) 987-6543",
      category: "disaster",
      icon: "fas fa-shield-alt",
      color: "success",
    });

    // Seed weather forecast
    const days = ["Today", "Tomorrow", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const conditions = ["Heavy Rain", "Thunderstorm", "Cloudy", "Sunny", "Partly Cloudy", "Light Rain", "Clear"];
    const icons = ["fas fa-cloud-rain", "fas fa-cloud-showers-heavy", "fas fa-cloud", "fas fa-sun", "fas fa-cloud-sun", "fas fa-cloud-rain", "fas fa-sun"];
    
    days.forEach((day, index) => {
      this.createWeatherForecast({
        date: day,
        condition: conditions[index] || "Partly Cloudy",
        temperature: 18 + Math.floor(Math.random() * 10),
        precipitationChance: index < 2 ? 85 + Math.floor(Math.random() * 10) : Math.floor(Math.random() * 50),
        icon: icons[index] || "fas fa-cloud",
      });
    });
  }

  async getWaterLevelStations(): Promise<WaterLevelStation[]> {
    return Array.from(this.waterStations.values());
  }

  async getWaterLevelStation(id: number): Promise<WaterLevelStation | undefined> {
    return this.waterStations.get(id);
  }

  async createWaterLevelStation(station: InsertWaterLevelStation): Promise<WaterLevelStation> {
    const id = this.currentId++;
    const newStation: WaterLevelStation = {
      ...station,
      id,
      lastUpdated: new Date(),
    };
    this.waterStations.set(id, newStation);
    return newStation;
  }

  async updateWaterLevelStation(id: number, station: Partial<InsertWaterLevelStation>): Promise<WaterLevelStation | undefined> {
    const existing = this.waterStations.get(id);
    if (!existing) return undefined;
    
    const updated: WaterLevelStation = {
      ...existing,
      ...station,
      lastUpdated: new Date(),
    };
    this.waterStations.set(id, updated);
    return updated;
  }

  async getEvacuationCenters(): Promise<EvacuationCenter[]> {
    return Array.from(this.evacCenters.values());
  }

  async getEvacuationCenter(id: number): Promise<EvacuationCenter | undefined> {
    return this.evacCenters.get(id);
  }

  async createEvacuationCenter(center: InsertEvacuationCenter): Promise<EvacuationCenter> {
    const id = this.currentId++;
    const newCenter: EvacuationCenter = {
      ...center,
      id,
      distance: null,
    };
    this.evacCenters.set(id, newCenter);
    return newCenter;
  }

  async getCommunityReports(): Promise<CommunityReport[]> {
    return Array.from(this.reports.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createCommunityReport(report: InsertCommunityReport): Promise<CommunityReport> {
    const id = this.currentId++;
    const newReport: CommunityReport = {
      location: report.location,
      waterLevel: report.waterLevel,
      details: report.details || null,
      reporterName: report.reporterName || null,
      shareLocation: report.shareLocation,
      latitude: report.latitude || null,
      longitude: report.longitude || null,
      id,
      createdAt: new Date(),
    };
    this.reports.set(id, newReport);
    return newReport;
  }

  async getWeatherForecast(): Promise<WeatherForecast[]> {
    return Array.from(this.weather.values());
  }

  async createWeatherForecast(forecast: InsertWeatherForecast): Promise<WeatherForecast> {
    const id = this.currentId++;
    const newForecast: WeatherForecast = {
      ...forecast,
      id,
    };
    this.weather.set(id, newForecast);
    return newForecast;
  }

  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    return Array.from(this.contacts.values());
  }

  async createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact> {
    const id = this.currentId++;
    const newContact: EmergencyContact = {
      ...contact,
      id,
    };
    this.contacts.set(id, newContact);
    return newContact;
  }
}

export const storage = new MemStorage();
