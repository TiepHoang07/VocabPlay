import { Request, Response, NextFunction } from 'express';
import { createClerkClient } from '@clerk/clerk-sdk-node';

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    
    // Verify the token with Clerk
    const claims = await clerkClient.verifyToken(token);
    
    if (!claims || !claims.sub) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Set user ID from Clerk's subject claim
    req.userId = claims.sub;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};