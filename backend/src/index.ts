import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';
import { handleClerkWebhook } from './webhooks/clerk';
import wordsRouter from './routes/words.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ⚠️ IMPORTANT: Webhook route must come BEFORE express.json()
// Because webhook needs RAW body for signature verification
app.post(
  '/api/webhooks/clerk',
  express.raw({ type: 'application/json' }), // This gives us raw buffer
  async (req, res) => {
    try {
      console.log('📨 Webhook received');
      await handleClerkWebhook(req.body, req.headers);
      res.status(200).json({ received: true });
    } catch (err) {
      console.error('❌ Webhook error:', err);
      res.status(400).json({ error: 'Webhook error' });
    }
  }
);

// Regular middleware for all other routes
app.use(clerkMiddleware());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json()); // This now comes AFTER webhook route

// Routes
app.use('/api/words', wordsRouter);

// Health check (useful for testing)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler (keep at the end)
app.use((err: any, req: any, res: any, next: any) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 Webhook endpoint: http://localhost:${PORT}/api/webhooks/clerk`);
});