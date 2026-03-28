# SiteGuard - Website Monitoring App

## Overview
SiteGuard is a full-stack website monitoring and status tracking application. It monitors uptime, response times, and SSL certificate status for multiple websites, with automated alerts via email and Slack. It has both a **web app** and a **React Native mobile app**.

## Architecture

### Frontend Web (`/client`)
- **React 19** with TypeScript
- **Vite** build tool and dev server (port **5000**)
- **Tailwind CSS 4** for styling
- **React Router 7** for client-side routing
- **Recharts** for performance/uptime charts
- **Zustand** for state management
- **Axios** for API calls (proxied to backend via `/api`)

### Mobile App (`/mobile`)
- **React Native** with **Expo** (SDK 55)
- **Expo Router** for file-based navigation
- **React Query** for data fetching and caching
- **Expo SecureStore** for JWT token storage
- **Inter font** from Google Fonts
- Dark theme design with green accent (#22c55e)
- Runs on port **8080** (web preview), or scan QR code for Expo Go on real device
- API URL configured via `EXPO_PUBLIC_API_URL` in `mobile/.env`

**Mobile Screens:**
- `app/(tabs)/index` - Dashboard overview (stats cards, recent activity)
- `app/(tabs)/clients` - Sites list with add/delete
- `app/(tabs)/alerts` - Active and resolved alerts
- `app/(tabs)/settings` - Account info and logout
- `app/client/[id]` - Client detail with metrics, logs, SSL tabs
- `app/login` - Login screen
- `app/signup` - Sign up screen

### Backend (`/server`)
- **Node.js + Express** REST API (port **3001**)
- **MongoDB** via Mongoose (local instance, port 27017)
- **JWT + bcryptjs** for authentication
- **node-cron** for automated monitoring every 30 seconds
- **Nodemailer** for email alerts
- **ssl-checker** for SSL certificate validation
- **CORS** configured to accept both web (`localhost:5000`) and mobile (`localhost:8081`) origins; native app requests have no origin header and pass through automatically

## Running the App

### Workflow: "Start application"
Runs `bash start.sh` which starts:
1. **MongoDB** daemon
2. **Backend server** (`cd server && npm run dev`, port 3001)
3. **Web frontend** (`cd client && npm run dev`, port 5000)

### Workflow: "Start Mobile"
Runs `bash start-mobile.sh` which starts:
- **Expo Metro bundler** on port 8080
- Shows QR code for scanning with Expo Go app on your phone

## Key Configuration

### Mobile API URL
Set in `mobile/.env`:
```
EXPO_PUBLIC_API_URL=https://<replit-domain>:3001
```

### Frontend Proxy
Vite proxies `/api` requests from web app to `http://localhost:3001`.

### Environment Variables (`server/.env`)
- `PORT=3001` - Backend port
- `MONGO_URI=mongodb://localhost:27017/siteguard` - MongoDB connection
- `JWT_SECRET` - Auth token secret
- `EMAIL_USER` / `EMAIL_PASS` - Nodemailer credentials
- `SLACK_WEBHOOK_URL` - Slack integration
- `CLIENT_URL=http://localhost:5000` - Primary CORS allowed origin

### MongoDB Data Directory
MongoDB data is stored at `/home/runner/data/mongodb`

## Features
- **Automated Monitoring**: Cron job runs every 30 seconds checking registered URLs
- **Uptime Tracking**: 90-day uptime percentage calculations
- **Performance Logging**: Response time tracking and charting
- **Alerting**: Email/Slack notifications when sites go down or become slow (>3000ms)
- **SSL Monitoring**: Warns when SSL certificates expire within 30 days
- **User Auth**: JWT-based authentication with bcrypt password hashing
- **Mobile App**: Full-featured React Native companion app
