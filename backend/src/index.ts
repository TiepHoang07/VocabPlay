import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import wordsRouter from './routes/words.routes';
import { clerkMiddleware } from '@clerk/express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(clerkMiddleware())

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/api/words', wordsRouter);

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});