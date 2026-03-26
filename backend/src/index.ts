import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import wordsRouter from './routes/words.routes';
import gameScoresRouter from './routes/game_scores.routes';
import authRouter from './routes/auth.routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Debug: log every incoming request before any middleware
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/words', wordsRouter);
app.use('/api/game-scores', gameScoresRouter);

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});