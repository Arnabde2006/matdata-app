# MatdataApp (मतदाता ऐप) 🇮🇳

An AI-powered Indian Election Education Platform built with Google Antigravity for PromptWars Virtual 2026.

## Chosen Vertical
**Civic Education & Voter Awareness** — Helping Indian citizens understand the election process, learn democratic concepts, and make informed voting decisions.

## Problem Statement
Millions of Indian voters, especially first-time voters, lack awareness about:
- Voter registration process and deadlines
- How EVMs and VVPATs work
- Candidate information and party manifestos
- Their polling booth location

## Solution Approach
Built a full-stack bilingual (Hindi + English) web platform with:
1. **AI Chatbot** — Gemini 2.5 Flash powered assistant answering election FAQs
2. **Election Timeline** — State-specific voting deadlines and key dates
3. **Flashcard Learning** — 45 bilingual flashcards covering election terminology
4. **Candidate Hub** — Search and compare political candidates
5. **Booth Finder** — Find polling station using EPIC (Voter ID) number

## How It Works
- User visits the platform and selects their preferred language (Hindi/English)
- AI Assistant answers questions about Indian elections using Gemini API
- Timeline wizard shows state-specific election dates for Lok Sabha/Vidhan Sabha
- Flashcards use spaced repetition algorithm for effective learning
- Booth Finder uses OpenStreetMap/Nominatim to display polling location on map

## Tech Stack
- **Frontend:** React 18 + TypeScript + Tailwind CSS + Vite
- **Backend:** Node.js + Express + Prisma ORM
- **AI:** Google Gemini 2.5 Flash API
- **Maps:** Leaflet.js + OpenStreetMap (free, no API key needed)
- **Deployment:** Google Cloud Run (asia-south1/Mumbai region)
- **CI/CD:** Google Cloud Build + Artifact Registry
- **i18n:** react-i18next (Hindi + English)

## Google Services Used
- **Gemini 2.5 Flash API** — Powers the bilingual AI election assistant
- **Google Cloud Run** — Serverless container deployment in Mumbai region
- **Google Cloud Build** — Automated container builds and deployments
- **Google Artifact Registry** — Docker container image storage

## Assumptions Made
- Sample/mock data used for candidate information (real ECI API integration planned)
- Booth finder uses demo data with real map coordinates for Varanasi
- Hindi translations cover major UI elements (full translation in progress)
- SQLite used for development (PostgreSQL for production)

## Google Services Used
This application leverages multiple Google Services for enhanced functionality:
- **Cloud Run**: Target platform for scalable containerized backend and frontend deployment.
- **Gemini API**: Powers the AI chatbot assistant to answer election-related queries.
- **Google Analytics 4 (GA4)**: Tracks pageviews and user interactions with tracking ID `G-MATDATA2026`.
- **Firebase**: SDK integrated for future robust storage of user progress and chat histories via Firestore.
- **Google Fonts API**: Provides high-quality typography using Inter and Noto Sans Devanagari.
- **Google Translate API**: Embeds a multi-lingual translation widget in the navigation bar.

## License
MIT License

## Live Demo
🌐 [https://matdata-app-2977556014.asia-south1.run.app](https://matdata-app-2977556014.asia-south1.run.app)

## Local Setup
```bash
# Clone the repository
git clone https://github.com/Arnabde2006/matdata-app.git
cd matdata-app

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install

# Set up environment variables
cp backend/.env.example backend/.env
# Add your GEMINI_API_KEY to backend/.env

# Run backend
cd backend && npm run dev

# Run frontend (new terminal)
cd frontend && npm run dev
```

## Environment Variables
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PORT=3000
DATABASE_URL=file:./dev.db
## Security
- Helmet.js for HTTP security headers
- Rate limiting: 50 requests per 15 minutes per IP
- Input validation with Zod
- No sensitive voter data stored
- HTTPS enforced on Cloud Run

## Accessibility
- Bilingual support (Hindi + English)
- Mobile-first responsive design
- ARIA labels on interactive elements
- High contrast color scheme
- Large tap targets for mobile users

## Built By
**Arnab De** — PromptWars Virtual 2026
