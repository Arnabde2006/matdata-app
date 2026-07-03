import { Request, Response } from 'express';
import { findBooth } from '../services/boothService';

export async function postBooth(req: Request, res: Response) {
  try {
    const { epicNumber } = req.body;
    const result = await findBooth(epicNumber);
    res.json(result);
  } catch (error) {
    console.error('Booth API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
