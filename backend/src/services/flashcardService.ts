import { prisma } from '../server';

export async function listFlashcards() {
  return prisma.flashcard.findMany();
}
