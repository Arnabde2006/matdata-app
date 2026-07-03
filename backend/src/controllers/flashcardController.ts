import { Request, Response } from 'express';
import { listFlashcards } from '../services/flashcardService';

export async function getFlashcards(req: Request, res: Response) {
  try {
    const flashcards = await listFlashcards();
    res.json(flashcards);
  } catch (error) {
    console.error('Flashcard API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
