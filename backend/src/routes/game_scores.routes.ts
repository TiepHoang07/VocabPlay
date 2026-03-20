import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
    updateWordChainScore,
    updateMatchingGameScore,
    getWordChainScore,
    getMatchingGameScore,
    getMatchingGameLeaderboard,
    getWordChainLeaderboard
} from '../controllers/game_scores.controller';

const router = Router();

router.post('/word-chain', authMiddleware, updateWordChainScore);
router.post('/matching-game', authMiddleware, updateMatchingGameScore);
router.get('/word-chain', authMiddleware, getWordChainScore);
router.get('/matching-game', authMiddleware, getMatchingGameScore);
router.get('/matching-game/leaderboard', getMatchingGameLeaderboard);
router.get('/word-chain/leaderboard', getWordChainLeaderboard);

export default router;