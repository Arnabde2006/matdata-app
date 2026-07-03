import { Request, Response } from 'express';
import { listCandidates, getCandidatesByIds } from '../services/candidateService';
import { candidateQuerySchema, candidateCompareSchema } from '../validation/schemas';

export async function getCandidates(req: Request, res: Response) {
  try {
    const result = candidateQuerySchema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0].message });
    }
    const { constituencyId } = result.data;
    const candidates = await listCandidates(constituencyId);
    res.json(candidates);
  } catch (error) {
    console.error('Get Candidates API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function compareCandidates(req: Request, res: Response) {
  try {
    const result = candidateCompareSchema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0].message });
    }
    const ids = result.data.ids;
    const candidates = await getCandidatesByIds(ids);
    res.json(candidates);
  } catch (error) {
    console.error('Compare Candidates API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
