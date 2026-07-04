import { Router } from 'express';
import {
  getElections,
  getElectionSummary,
  getElectionConstituencies,
  getConstituencyDetail,
  triggerElectionSync
} from '../controllers/electoralController';

const router = Router();

router.get('/', getElections);
router.post('/sync', triggerElectionSync);
router.get('/:electionId/summary', getElectionSummary);
router.get('/:electionId/constituencies', getElectionConstituencies);
router.get('/:electionId/constituencies/:constituencyId', getConstituencyDetail);

export default router;
