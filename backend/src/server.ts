import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
export const prisma = new PrismaClient();

// Security Middlewares
app.use(helmet({ contentSecurityPolicy: { directives: { defaultSrc: ["'self'"], connectSrc: ["'self'", "https://nominatim.openstreetmap.org", "https://generativelanguage.googleapis.com"], imgSrc: ["'self'", "data:", "https://*.tile.openstreetmap.org"], scriptSrc: ["'self'", "'unsafe-inline'"], styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"] } } }));
app.use(cors());

// Rate Limiting (50 requests per 15 mins per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// Parsing
app.use(express.json());

// Basic Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MatdataApp API is running' });
});

// Chatbot Route
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemInstruction = language === 'hi'
      ? 'आप मतदाता ऐप के एक सहायक हैं। उपयोगकर्ता के सवालों का हिंदी में उत्तर दें और मतदान से संबंधित जानकारी प्रदान करें।'
      : "You are the MatdataApp assistant. Answer the user's questions in English and provide information related to voting and elections.";

    const prompt = `${systemInstruction}\n\nUser: ${message}`;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.json({ response: responseText });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get Flashcards
app.get('/api/flashcards', async (req, res) => {
  try {
    const flashcards = await prisma.flashcard.findMany();
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../public')));

// Fallback for React Router SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Booth Finder Route
app.post('/api/booth', async (req, res) => {
  const { epicNumber } = req.body;
  
  // Sample booth data for demo
  const boothData = {
    voterName: "Sample Voter",
    epicNumber: epicNumber,
    partNumber: "142",
    serialNumber: "567",
    boothName: "Govt Primary School, Room 2",
    address: "Sector 4, Main Road, Varanasi, UP 221005",
    latitude: 25.3176,
    longitude: 82.9739,
    pollingHours: "7:00 AM - 6:00 PM",
    facilities: ["Wheelchair Ramp", "Drinking Water", "Washroom"],
    assemblyConstituency: "Varanasi North",
    parliamentaryConstituency: "Varanasi"
  };
  
  res.json(boothData);
});
