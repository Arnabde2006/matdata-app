import { Request, Response } from 'express';
import * as electoralDataService from '../services/electoralDataService';

export async function getElections(req: Request, res: Response) {
  try {
    const { syncType, syncYear, syncState } = req.query;
    
    // Optional query params to trigger a sync on-demand
    if (syncType && syncYear) {
      const year = parseInt(syncYear as string, 10);
      const state = (syncState as string) || null;
      try {
        await electoralDataService.syncFromDataGovIn(syncType as string, year, state);
      } catch (err: any) {
        console.error('Background sync failed on request:', err.message);
      }
    }

    const elections = await electoralDataService.listElections();
    res.json(elections);
  } catch (error) {
    console.error('Error fetching elections:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getElectionSummary(req: Request, res: Response) {
  try {
    const electionId = parseInt(req.params.electionId, 10);
    if (isNaN(electionId)) {
      return res.status(400).json({ error: 'Invalid election ID' });
    }

    const summary = await electoralDataService.getElectionSummary(electionId);
    if (!summary) {
      return res.status(404).json({ error: 'Election not found', code: 'ELECTION_NOT_FOUND' });
    }

    res.json(summary);
  } catch (error: any) {
    console.error('Error fetching election summary:', error);
    if (error.message && error.message.includes('Upstream source failed')) {
      return res.status(502).json({ error: 'Upstream source failed', upstreamFailed: true });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getElectionConstituencies(req: Request, res: Response) {
  try {
    const electionId = parseInt(req.params.electionId, 10);
    if (isNaN(electionId)) {
      return res.status(400).json({ error: 'Invalid election ID' });
    }

    const search = (req.query.search as string) || '';
    const offset = parseInt(req.query.offset as string, 10) || 0;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const result = await electoralDataService.getElectionConstituencies(electionId, search, offset, limit);
    res.json(result);
  } catch (error) {
    console.error('Error fetching election constituencies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getConstituencyDetail(req: Request, res: Response) {
  try {
    const electionId = parseInt(req.params.electionId, 10);
    const constituencyId = parseInt(req.params.constituencyId, 10);

    if (isNaN(electionId) || isNaN(constituencyId)) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    const detail = await electoralDataService.getConstituencyDetail(electionId, constituencyId);
    if (!detail) {
      return res.status(404).json({ error: 'Constituency detail not found', code: 'CONSTITUENCY_NOT_FOUND' });
    }

    res.json(detail);
  } catch (error) {
    console.error('Error fetching constituency detail:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Dedicated endpoint to trigger a sync manually
export async function triggerElectionSync(req: Request, res: Response) {
  try {
    const { type, year, state } = req.body;
    if (!type || !year) {
      return res.status(400).json({ error: 'Type and Year are required fields' });
    }

    const parseYear = parseInt(year, 10);
    if (isNaN(parseYear)) {
      return res.status(400).json({ error: 'Year must be a number' });
    }

    const stateParam = state || null;

    const result = await electoralDataService.syncFromDataGovIn(type, parseYear, stateParam);
    if (!result) {
      return res.status(400).json({ error: 'Sync could not be performed. Ensure resource ID is configured and API key is set.' });
    }

    res.json({ message: 'Sync completed successfully' });
  } catch (error: any) {
    console.error('Manual sync failed:', error);
    if (error.message && error.message.includes('Upstream source failed')) {
      return res.status(502).json({ error: 'Upstream source failed', upstreamFailed: true });
    }
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
