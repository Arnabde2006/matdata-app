import { Router } from 'express';
import { getFlashcards } from '../controllers/flashcardController';

const router = Router();
router.get('/', getFlashcards);

export default router;
