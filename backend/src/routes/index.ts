import { Router } from 'express';
import healthRoutes from './healthRoutes';
import chatRoutes from './chatRoutes';
import flashcardRoutes from './flashcardRoutes';
import boothRoutes from './boothRoutes';
import timelineRoutes from './timelineRoutes';
import stateRoutes from './stateRoutes';
import candidateRoutes from './candidateRoutes';
import electoralRoutes from './electoralRoutes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/chat', chatRoutes);
router.use('/flashcards', flashcardRoutes);
router.use('/booth', boothRoutes);
router.use('/timeline', timelineRoutes);
router.use('/states', stateRoutes);
router.use('/candidates', candidateRoutes);
router.use('/elections', electoralRoutes);

export default router;
