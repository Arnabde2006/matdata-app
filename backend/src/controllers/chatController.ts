import { Request, Response } from 'express';
import { askElectionAssistant } from '../services/geminiService';

export async function postChat(req: Request, res: Response) {
  try {
    const { message, language } = req.body;
    const response = await askElectionAssistant(message, language);
    res.json({ response });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
