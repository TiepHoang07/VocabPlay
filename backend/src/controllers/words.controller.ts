import { Request, Response } from 'express';
import prisma from '../services/prisma';
import { getWordDefinition } from '../services/dictionary';

export const searchWord = async (req: Request, res: Response) => {
  try {
    const { word } = req.params;
    
    // Check if word is undefined or an array
    if (!word || Array.isArray(word)) {
      return res.status(400).json({ error: 'Invalid word parameter' });
    }

    const definition = await getWordDefinition(word);
    res.json(definition);
  } catch (error: any) {
    res.status(404).json({ error: error.message || 'Word not found' });
  }
};

export const addWord = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { word, meaning, partOfSpeech, example, phonetic } = req.body;

    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return Error("You have to sign in first !")
    }

    const newWord = await prisma.userWord.create({
      data: {
        userId: userId!,
        word: word.toLowerCase(),
        meaning,
        partOfSpeech,
        example,
        phonetic
      }
    });

    res.status(201).json(newWord);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Word already in your dictionary' });
    } else {
      res.status(500).json({ error: 'Failed to add word' });
    }
  }
};

export const getUserWords = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { filter } = req.query;

    let whereClause: any = { userId };

    if (filter === 'memorized') {
      whereClause.memorized = { some: {} };
    }

    const words = await prisma.userWord.findMany({
      where: whereClause,
      include: {
        memorized: true
      },
      orderBy: { addedAt: 'desc' }
    });

    res.json(words);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch words' });
  }
};

export const deleteWord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Ensure id is a string and convert to number
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: 'Invalid word ID' });
    }

    const wordId = parseInt(id);
    
    if (isNaN(wordId)) {
      return res.status(400).json({ error: 'Word ID must be a number' });
    }

    await prisma.userWord.deleteMany({
      where: {
        id: wordId,
        userId
      }
    });

    res.json({ message: 'Word deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete word' });
  }
};