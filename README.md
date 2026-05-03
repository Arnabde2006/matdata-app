# MatdataApp (मतदाता ऐप)

A comprehensive web application that helps Indian citizens understand the election process, learn about their democratic rights, and make informed voting decisions.

## Features

1. **Interactive Election Timeline Wizard:** Track important dates for upcoming Lok Sabha, Vidhan Sabha, and Municipal elections.
2. **AI-Powered Chatbot Assistant:** Get answers to your election-related questions in English and Hindi.
3. **Flashcard Learning System:** Gamified learning experience to understand democratic concepts and voting procedures.
4. **Candidate & Party Information Hub:** Search and explore profiles of candidates contesting in your constituency.
5. **Polling Booth Finder:** Find your exact polling station using your EPIC (Voter ID) number.

## Technology Stack

### Frontend
- React 18.2 with TypeScript
- Vite
- Tailwind CSS with Indian Flag Color Palette
- shadcn/ui components
- React Router v6
- i18next (English/Hindi Support)

### Backend
- Node.js & Express.js
- TypeScript
- PostgreSQL (SQLite for local dev)
- Prisma ORM
- Zod Validation

## Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- npm or yarn

### 1. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Access the Application
Open `http://localhost:5173` in your browser.

## Deployment to Google Cloud Run

This application is containerized and ready for deployment to Google Cloud Run.

1. Build the Docker image:
   ```bash
   docker build -t gcr.io/YOUR_PROJECT_ID/matdata-app .
   ```

2. Push to Container Registry:
   ```bash
   docker push gcr.io/YOUR_PROJECT_ID/matdata-app
   ```

3. Deploy to Cloud Run:
   ```bash
   gcloud run deploy matdata-app \
     --image gcr.io/YOUR_PROJECT_ID/matdata-app \
     --platform managed \
     --region asia-south1 \
     --allow-unauthenticated \
     --set-env-vars="DATABASE_URL=your_db_url,CLAUDE_API_KEY=your_api_key"
   ```

## License
MIT License

## Google Services Used
- **Gemini 2.5 Flash API** — AI-powered bilingual chatbot
- **Google Cloud Run** — Serverless container deployment
- **Google Cloud Build** — CI/CD pipeline
- **Google Artifact Registry** — Docker container storage
- **OpenStreetMap + Nominatim** — Free map and geocoding

## Architecture
- Frontend: React 18 + TypeScript + Tailwind CSS
- Backend: Node.js + Express + Prisma
- Database: SQLite (dev) / PostgreSQL (prod)
- Deployment: Google Cloud Run (asia-south1/Mumbai)
