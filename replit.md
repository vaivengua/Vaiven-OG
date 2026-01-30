# Vaiven - Cargo Transport Platform

## Overview
Vaiven is a web application that connects cargo shippers with reliable transporters in Guatemala. The platform features verified transporters, real-time tracking, and secure payments.

## Tech Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **Maps**: Leaflet / React-Leaflet
- **Backend**: Supabase (external hosted service)
- **State Management**: TanStack React Query

## Project Structure
```
├── src/
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and Supabase client
│   └── ...              # React components and pages
├── public/              # Static assets
├── index.html           # Entry HTML file
├── vite.config.ts       # Vite configuration
└── tailwind.config.ts   # Tailwind CSS configuration
```

## Development
- **Port**: 5000 (configured for Replit environment)
- **Host**: 0.0.0.0 (allows external access through Replit proxy)
- Run with: `npm run dev`
- Build with: `npm run build`

## Environment Variables
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key

## Recent Changes
- 2026-01-30: Configured for Replit environment (port 5000, allowed hosts)
