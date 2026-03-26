import { Request, Response } from "express";
import prisma from "../services/prisma";

export const updateWordChainScore = async (req: Request, res: Response) => {
    try {
        const { score } = req.body;
        const userId = (req as any).userId;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (score > user.highestScore) {
            await prisma.user.update({
                where: { id: userId },
                data: { highestScore: score },
            });
        }

        res.json(score);
    } catch (error) {
        console.error('Error updating word chain score:', error);
        res.status(500).json({ error: 'Failed to update word chain score' });
    }
}

export const updateMatchingGameScore = async (req: Request, res: Response) => {
    try {
        const { time } = req.body;
        const userId = (req as any).userId;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.fastestTime === 0 || time < user.fastestTime) {
            await prisma.user.update({
                where: { id: userId },
                data: { fastestTime: time },
            });
        }

        res.json(time);
    } catch (error) {
        console.error('Error updating matching game score:', error);
        res.status(500).json({ error: 'Failed to update matching game score' });
    }
}

export const getWordChainScore = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { highestScore: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ highestScore: user.highestScore });
    } catch (error) {
        console.error('Error getting word chain score:', error);
        res.status(500).json({ error: 'Failed to get word chain score' });
    }
}

export const getMatchingGameScore = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { fastestTime: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ fastestTime: user.fastestTime });
    } catch (error) {
        console.error('Error getting matching game score:', error);
        res.status(500).json({ error: 'Failed to get matching game score' });
    }
}

export const getMatchingGameLeaderboard = async (req: Request, res: Response) => {
    try {
        const topUsers = await prisma.user.findMany({
            where: { fastestTime: { gt: 0 } },
            orderBy: { fastestTime: 'asc' },
            take: 20,
            select: { id: true, name: true, avatarUrl: true, fastestTime: true }
        });
        res.json(topUsers);
    } catch (error) {
        console.error('Error getting matching game score:', error);
        res.status(500).json({ error: 'Failed to get matching game score' });
    }
}

export const getWordChainLeaderboard = async (req: Request, res: Response) => {
    try {
        const topUsers = await prisma.user.findMany({
            where: { highestScore: { gt: 0 } },
            orderBy: { highestScore: 'desc' },
            take: 20,
            select: { id: true, name: true, avatarUrl: true, highestScore: true }
        });
        res.json(topUsers);
    } catch (error) {
        console.error('Error getting word chain score:', error);
        res.status(500).json({ error: 'Failed to get word chain score' });
    }
}   