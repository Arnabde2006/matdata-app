import { Router } from 'express';
import { validate } from '../middleware/validate';
import { chatSchema } from '../validation/schemas';
import { postChat } from '../controllers/chatController';

const router = Router();
router.post('/', validate(chatSchema), postChat);

export default router;
