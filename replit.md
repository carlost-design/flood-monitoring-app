# FloodWatch - Water Level Monitoring System

## Overview

FloodWatch is a community-powered flood monitoring and emergency response system built as a full-stack web application. The system provides real-time water level monitoring, evacuation center mapping, weather forecasting, and emergency assistance for flood-prone areas. It's designed to help communities stay safe during flood events through centralized monitoring and emergency coordination.

**Latest Update**: Integrated Facebook Graph API to fetch real-time water level data from San Mateo Rizal PIO Facebook page (sanmateorizalPIO), providing authentic social media monitoring capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18 with TypeScript**: Modern React application using functional components and hooks
- **Vite**: Fast development build tool with hot module replacement
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: High-quality, accessible UI component library built on Radix UI primitives
- **TanStack Query**: Server state management for data fetching, caching, and synchronization
- **Wouter**: Lightweight client-side routing library
- **React Hook Form**: Form handling with Zod validation

### Backend Architecture
- **Express.js**: Node.js web framework for API endpoints
- **TypeScript**: Type-safe server-side development
- **In-memory storage**: Simple storage implementation with interface for future database integration
- **RESTful API design**: Clean API endpoints for all data operations

### Database & ORM
- **Drizzle ORM**: Type-safe SQL ORM with PostgreSQL dialect
- **PostgreSQL**: Production database (configured but using memory storage for development)
- **Neon Database**: Serverless PostgreSQL provider integration
- **Schema-first approach**: Shared type definitions between client and server

## Key Components

### Data Models
1. **Water Level Stations**: Monitor current water levels with critical/warning thresholds
2. **Evacuation Centers**: Emergency shelter locations with capacity and availability status
3. **Community Reports**: User-submitted flood condition reports with location data
4. **Weather Forecast**: 7-day weather predictions with precipitation chances
5. **Emergency Contacts**: Critical contact information for emergency services

### UI Components
- **Dashboard**: Main interface showing all monitoring data
- **Water Level Cards**: Visual representation of station status with color-coded alerts
- **Evacuation Map**: Interactive map showing nearest evacuation centers
- **Community Report Form**: User input form for reporting local conditions
- **Weather Forecast**: 7-day weather outlook with precipitation alerts
- **Emergency Contacts**: Quick access to emergency services
- **Mobile Navigation**: Touch-optimized navigation for mobile devices

### Features
- **Real-time monitoring**: Live water level data with trend analysis
- **Emergency alerts**: Critical flood warnings with emergency contact integration
- **Geolocation services**: GPS-based location services for evacuation routing
- **Responsive design**: Mobile-first design optimized for emergency situations
- **Accessibility**: WCAG-compliant components for universal access

## Data Flow

1. **Data Fetching**: TanStack Query manages API calls with automatic caching and refetching
2. **State Management**: React state for UI interactions, Query for server state
3. **Form Handling**: React Hook Form with Zod validation for data integrity
4. **API Layer**: RESTful endpoints serving JSON data from memory storage
5. **Type Safety**: Shared TypeScript types between client and server via shared schema

### API Endpoints
- `GET /api/water-stations` - Fetch all water level monitoring stations
- `GET /api/water-stations/:id` - Get specific station details
- `GET /api/evacuation-centers` - List all evacuation centers
- `GET /api/community-reports` - Fetch community-submitted reports
- `POST /api/community-reports` - Submit new community report
- `GET /api/weather` - Get weather forecast data
- `GET /api/emergency-contacts` - Fetch emergency contact information

## External Dependencies

### UI & Styling
- **Radix UI**: Accessible, unstyled UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Consistent icon library
- **Font Awesome**: Additional icon support via CDN

### Development Tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer
- **TSX**: TypeScript execution for development server

### External Services
- **Google Maps API**: Integrated for directions and location services (configured)
- **Replit**: Development environment integration with cartographer plugin

## Deployment Strategy

### Development
- **Vite dev server**: Hot module replacement for rapid development
- **Memory storage**: Simple in-memory data storage for development
- **TSX**: Direct TypeScript execution without compilation step

### Production Build
- **Client**: Vite builds optimized React bundle to `dist/public`
- **Server**: ESBuild bundles Express server to `dist/index.js`
- **Static serving**: Express serves built client files in production
- **Database**: Ready for PostgreSQL connection via environment variables

### Environment Configuration
- **NODE_ENV**: Development/production mode switching
- **DATABASE_URL**: PostgreSQL connection string for production
- **GOOGLE_MAPS_API_KEY**: Optional Google Maps integration
- **Replit integration**: Automatic cartographer and error overlay in development

The application follows a monorepo structure with shared TypeScript definitions, enabling type safety across the full stack while maintaining clear separation between client and server concerns.