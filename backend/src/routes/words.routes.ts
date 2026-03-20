import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  searchWord,
  addWord,
  getUserWords,
  deleteWord,
  memorizeWord
} from '../controllers/words.controller';

const router = Router();

// Public route
router.get('/search/:word', searchWord);

// Protected routes
router.get('/', authMiddleware, getUserWords);
router.post('/', authMiddleware, addWord);
router.delete('/:id', authMiddleware, deleteWord);
router.post('/:id/memorize', authMiddleware, memorizeWord);


export default router;