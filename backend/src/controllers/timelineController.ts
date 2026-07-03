import { Request, Response } from 'express';
import { listStates, listTimelineEvents } from '../services/timelineService';
import { timelineQuerySchema } from '../validation/schemas';

export async function getStates(req: Request, res: Response) {
  try {
    const states = await listStates();
    res.json(states);
  } catch (error) {
    console.error('States API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getTimeline(req: Request, res: Response) {
  try {
    const result = timelineQuerySchema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0].message });
    }
    const { stateId } = result.data;
    const events = await listTimelineEvents(stateId);
    res.json(events);
  } catch (error) {
    console.error('Timeline API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
