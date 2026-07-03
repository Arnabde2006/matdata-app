import { z } from 'zod';

export const chatSchema = z.object({
  message: z.string().trim().min(1, 'Message is required').max(500, 'Message cannot exceed 500 characters'),
  language: z.enum(['en', 'hi']).default('en'),
});

export const boothSchema = z.object({
  epicNumber: z.string().trim().regex(/^[A-Z]{3}[0-9]{7}$/, 'Invalid EPIC number format. Must be 3 letters followed by 7 digits.'),
});

export type ChatInput = z.infer<typeof chatSchema>;
export type BoothInput = z.infer<typeof boothSchema>;
