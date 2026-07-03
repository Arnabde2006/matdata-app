import { Router } from 'express';
import { getStates } from '../controllers/timelineController';

const router = Router();
router.get('/', getStates);

export default router;
