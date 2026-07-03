import { Router } from 'express';
import healthRoutes from './healthRoutes';
import chatRoutes from './chatRoutes';
import flashcardRoutes from './flashcardRoutes';
import boothRoutes from './boothRoutes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/chat', chatRoutes);
router.use('/flashcards', flashcardRoutes);
router.use('/booth', boothRoutes);

export default router;
