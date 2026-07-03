import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import apiRoutes from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
export const prisma = new PrismaClient();

// Security Middlewares
app.use(helmet({ contentSecurityPolicy: { directives: { defaultSrc: ["'self'"], connectSrc: ["'self'", "https://nominatim.openstreetmap.org", "https://generativelanguage.googleapis.com"], imgSrc: ["'self'", "data:", "https://*.tile.openstreetmap.org"], scriptSrc: ["'self'", "'unsafe-inline'"], styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"] } } }));
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173', credentials: true }));

// Rate Limiting (50 requests per 15 mins per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// Parsing
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../public')));

// Fallback for React Router SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export { app };

