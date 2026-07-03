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

export const timelineQuerySchema = z.object({
  stateId: z
    .string()
    .optional()
    .refine((val) => {
      if (val === undefined || val.trim() === '') return true;
      const parsed = Number(val);
      return Number.isInteger(parsed) && parsed > 0;
    }, {
      message: 'stateId must be a positive integer',
    })
    .transform((val) => {
      if (val === undefined || val.trim() === '') return undefined;
      return parseInt(val, 10);
    }),
});

export const candidateQuerySchema = z.object({
  constituencyId: z
    .string()
    .optional()
    .refine((val) => {
      if (val === undefined || val.trim() === '') return true;
      const parsed = Number(val);
      return Number.isInteger(parsed) && parsed > 0;
    }, {
      message: 'constituencyId must be a positive integer',
    })
    .transform((val) => {
      if (val === undefined || val.trim() === '') return undefined;
      return parseInt(val, 10);
    }),
});

export const candidateCompareSchema = z.object({
  ids: z
    .string()
    .min(1, 'Candidate IDs are required')
    .refine((val) => {
      const parts = val.split(',');
      if (parts.length < 2 || parts.length > 3) return false;
      return parts.every((part) => {
        const num = Number(part);
        return Number.isInteger(num) && num > 0;
      });
    }, {
      message: 'Must provide between 2 and 3 positive integer candidate IDs separated by commas',
    })
    .transform((val) => {
      return val.split(',').map((part) => parseInt(part, 10));
    }),
});



