import { Request, Response } from "express";
import prisma from "../services/prisma";
import { getWordDefinition } from "../services/dictionary";

export const searchWord = async (req: Request, res: Response) => {
  try {
    const { word } = req.params;

    if (!word || Array.isArray(word)) {
      return res.status(400).json({ error: "Invalid word parameter" });
    }

    const definition = await getWordDefinition(word);
    res.json(definition);
  } catch (error: any) {
    res.status(404).json({ error: error.message || "Word not found" });
  }
};

export const getUserWords = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found in database" });
    }

    const words = await prisma.userWord.findMany({
      where: { userId: user.id },
      orderBy: { addedAt: "desc" },
    });

    console.log(`Found ${words.length} words`);
    res.json(words);
  } catch (err) {
    console.error('Error in getUserWords:', err);
    res.status(500).json({ error: "Failed to fetch words" });
  }
};

export const addWord = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { word, meaning, partOfSpeech, example, phonetic } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "You must be signed in" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found in database" });
    }

    const newWord = await prisma.userWord.create({
      data: {
        userId: user.id,
        word: word.toLowerCase(),
        meaning,
        partOfSpeech,
        example,
        phonetic,
      },
    });
    res.status(201).json(newWord);
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(400).json({ error: "Word already in your dictionary" });
    } else {
      console.error("Add word error:", error);
      res.status(500).json({ error: "Failed to add word" });
    }
  }
};

export const deleteWord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ error: "You must be signed in" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found in database" });
    }

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: "Invalid word ID" });
    }

    const wordId = parseInt(id);

    if (isNaN(wordId)) {
      return res.status(400).json({ error: "Word ID must be a number" });
    }

    console.log(`Attempting to delete word ${wordId} for user ${user.id}`);

    const deleted = await prisma.userWord.deleteMany({
      where: {
        id: wordId,
        userId: user.id,
      },
    });

    console.log(`Deletion result:`, deleted);

    if (deleted.count === 0) {
      return res.status(404).json({ error: "Word not found or unauthorized" });
    }

    res.json({ message: "Word deleted successfully" });
  } catch (error) {
    console.error("Delete word error:", error);
    res.status(500).json({ error: "Failed to delete word" });
  }
};

export const memorizeWord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ error: "You must be sign in"})
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return res.status(401).json({ error:  "User not found in database"})
    }

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: "Invalid word ID"})
    }

    const wordId = parseInt(id)

    if (isNaN(wordId)) {
      return res.status(400).json({ error: "Word ID must be a number"})
    }

    const word = await prisma.userWord.findFirst({
      where: {
        id: wordId,
        userId: user.id
      }
    })

    if (!word) {
      return res.status(404).json({ error: "Word not found"})
    }

    const updatedWord = await prisma.userWord.update({
      where: {
        id: wordId
      },
      data: {
        memorized: true
      }
    })

    res.json(updatedWord)
  } catch (error) {
    console.error("Memorize word error:", error)
    res.status(500).json({ error: "Failed to memorize word"})
  }
}