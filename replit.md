# SiteGuard - Website Monitoring App

## Overview
SiteGuard is a full-stack website monitoring and status tracking application. It monitors uptime, response times, and SSL certificate status for multiple websites, with automated alerts via email and Slack.

## Architecture

### Frontend (`/client`)
- **React 19** with TypeScript
- **Vite** build tool and dev server (port **5000**)
- **Tailwind CSS 4** for styling
- **React Router 7** for client-side routing
- **Recharts** for performance/uptime charts
- **Zustand** for state management
- **Axios** for API calls (proxied to backend via `/api`)

### Backend (`/server`)
- **Node.js + Express** REST API (port **3001**)
- **MongoDB** via Mongoose (local instance, port 27017)
- **JWT + bcryptjs** for authentication
- **node-cron** for automated monitoring every 30 seconds
- **Nodemailer** for email alerts
- **ssl-checker** for SSL certificate validation

## Running the App

The `start.sh` script starts all three services:
1. **MongoDB** - starts as a background daemon
2. **Backend server** - `cd server && npm run dev` (port 3001)
3. **Frontend** - `cd client && npm run dev` (port 5000)

## Key Configuration

### Frontend Proxy
Vite proxies `/api` requests to `http://localhost:3001` so the frontend doesn't need cross-origin config.

### Environment Variables (`server/.env`)
- `PORT=3001` - Backend port
- `MONGO_URI=mongodb://localhost:27017/siteguard` - MongoDB connection
- `JWT_SECRET` - Auth token secret
- `EMAIL_USER` / `EMAIL_PASS` - Nodemailer credentials
- `SLACK_WEBHOOK_URL` - Slack integration
- `CLIENT_URL=http://localhost:5000` - CORS allowed origin

### MongoDB Data Directory
MongoDB data is stored at `/home/runner/data/mongodb`

## Features
- **Automated Monitoring**: Cron job runs every 30 seconds checking registered URLs
- **Uptime Tracking**: 90-day uptime percentage calculations
- **Performance Logging**: Response time tracking and charting
- **Alerting**: Email/Slack notifications when sites go down or become slow (>3000ms)
- **SSL Monitoring**: Warns when SSL certificates expire within 30 days
- **User Auth**: JWT-based authentication with bcrypt password hashing
