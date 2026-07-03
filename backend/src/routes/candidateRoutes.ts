import { Router } from 'express';
import { getCandidates, compareCandidates } from '../controllers/candidateController';

const router = Router();
router.get('/', getCandidates);
router.get('/compare', compareCandidates);

export default router;
