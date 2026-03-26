import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { handleClerkWebhook } from './webhooks/clerk';
import wordsRouter from './routes/words.routes';
import gameScoresRouter from './routes/game_scores.routes';
import { clerkMiddleware } from '@clerk/express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Webhook route
app.post(
  '/api/webhooks/clerk',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      const result = await handleClerkWebhook(req.body, req.headers);
      res.status(200).json(result);
    } catch (err) {
      console.error('Webhook error:', err);
      res.status(400).json({ error: 'Webhook error' });
    }
  }
);

// Debug: log every incoming request before any middleware
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Clerk middleware
app.use(clerkMiddleware({
  secretKey: process.env.CLERK_SECRET_KEY,
}));

// Debug: confirm clerkMiddleware passed through
app.use((req, _res, next) => {
  console.log(`[clerk-passed] ${req.method} ${req.url} | auth:`, !!(req as any).auth?.userId);
  next();
});

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/words', wordsRouter);
app.use('/api/game-scores', gameScoresRouter);

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});