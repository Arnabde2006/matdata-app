import { Router } from 'express';
import { validate } from '../middleware/validate';
import { boothSchema } from '../validation/schemas';
import { postBooth } from '../controllers/boothController';

const router = Router();
router.post('/', validate(boothSchema), postBooth);

export default router;
