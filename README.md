# RiverGuard

AI-Powered Illegal Encroachment Detection System

RiverGuard is a standalone web application that uses satellite imagery and AI to detect and monitor river side encroachments. Built with Next.js, it provides a comprehensive platform for reporting, analyzing, and managing environmental violations.

## Features

- **Live Satellite Monitoring**: Click anywhere on the map to fetch historical satellite images
- **Image Selection**: Choose from available satellite images as baseline for monitoring
- **Case Management**: Report and track encroachment cases with detailed information
- **Satellite Image Upload**: Upload before/after satellite images for each case
- **AI Analysis**: Use AI to analyze image pairs and detect changes indicative of encroachment
- **Severity Assessment**: AI provides severity levels and detailed analysis reports
- **Interactive Map**: Visualize cases on an interactive Leaflet map
- **Dashboard**: Overview of case statistics and recent activity
- **Authentication**: Secure login system (optional for demo)

## How It Works

### Satellite Image Monitoring
1. **Click Location**: Go to "Live Monitoring" page and click anywhere on the map
2. **Fetch Images**: System retrieves available satellite images for that location
3. **Select Baseline**: Choose a historical image as your "before" reference
4. **Monitor Changes**: AI analyzes new images against your baseline
5. **Report Issues**: If encroachment detected, create a case with evidence

### AI Analysis Process
- **Image Comparison**: AI compares before/after satellite images
- **Change Detection**: Identifies land use changes, new constructions
- **Severity Scoring**: Assigns LOW/MEDIUM/HIGH severity levels
- **Detailed Reports**: Provides area affected, construction type, environmental impact

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Live Monitoring Workflow
1. **Navigate to Live Monitoring**: Go to the "Live Monitoring" page from the dashboard
2. **Click on Map**: Click anywhere on the map where you want to monitor for encroachment
3. **Browse Satellite Images**: View available historical satellite images for that location
4. **Select Baseline Image**: Choose a "before" image that represents the original state
5. **Create Monitoring Case**: Use the selected image to create a case for ongoing monitoring

### Case Management
1. **Create Cases**: Report new encroachments with location and images
2. **Upload Images**: Attach satellite images showing before/after states
3. **AI Analysis**: Click "AI Analyze" to get automated assessment with severity levels
4. **Track Progress**: Update case status and monitor investigation progress

### AI Analysis Features
- **Change Detection**: Identifies new constructions, land use changes
- **Severity Assessment**: LOW/MEDIUM/HIGH risk classification
- **Detailed Reports**: Area affected, construction type, environmental impact
- **Confidence Scores**: AI confidence level for each analysis

## AI Integration

The application uses **free AI APIs** for image analysis. Currently configured for Hugging Face, but easily adaptable to other free services:

### Current Setup (Hugging Face)
- **Image Captioning**: Salesforce BLIP model describes satellite images
- **Change Detection**: Compares captions to identify encroachments
- **Free Usage**: No API key required for basic inference limits

### Alternative Free AI APIs
If you prefer different services, the code can be easily modified to use:
- **Google Vision API**: 1000 free requests/month
- **Clarifai**: Free tier with generous limits  
- **Replicate**: Various free AI models available
- **Roboflow**: Free computer vision models

### Setup Instructions
1. For Hugging Face (current): Get optional token from https://huggingface.co/settings/tokens
2. Add `HF_TOKEN=your_token` to `.env.local` (optional for higher limits)
3. Uncomment the integration code in `/app/api/analyze/route.ts`
4. Ensure images are publicly accessible for analysis

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: CSS Modules
- **Maps**: Leaflet with React-Leaflet
- **Database**: JSON file (can be upgraded to Prisma/SQLite)
- **AI**: OpenAI GPT-4 Vision (configurable)
- **Authentication**: NextAuth.js

## Project Structure

```
app/
├── api/              # API routes
├── dashboard/        # Main dashboard
├── login/           # Authentication
└── ...

components/
├── cases/           # Case management components
├── dashboard/       # Dashboard widgets
├── map/            # Map components
└── ui/             # Reusable UI components

lib/
├── api.ts          # API client functions
├── auth.ts         # Authentication config
└── db.ts           # Database utilities
```
