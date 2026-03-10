import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  searchWord,
  addWord,
  getUserWords,
  deleteWord
} from '../controllers/words.controller';

const router = Router();

router.get('/search/:word', searchWord);
router.get('/', requireAuth, getUserWords);
router.post('/', requireAuth, addWord);
router.delete('/:id', requireAuth, deleteWord);

export default router;