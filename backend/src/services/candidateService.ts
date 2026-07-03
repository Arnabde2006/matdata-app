import { prisma } from '../server';

const CANDIDATE_MOCKS: Record<number, { age: number; education: string }> = {
  1: { age: 45, education: 'Post Graduate' },
  2: { age: 38, education: 'Graduate Professional' },
  3: { age: 41, education: 'Doctorate' },
  4: { age: 52, education: 'Graduate' },
  5: { age: 49, education: 'Post Graduate' },
};

function mapCandidate(candidate: any) {
  const extra = CANDIDATE_MOCKS[candidate.id] || { age: 40, education: 'Graduate' };
  return {
    ...candidate,
    age: extra.age,
    education: extra.education,
  };
}

export async function listCandidates(constituencyId?: number) {
  const candidates = await prisma.candidate.findMany({
    where: constituencyId !== undefined ? { constituency_id: constituencyId } : {},
    include: {
      party: true,
      constituency: {
        include: {
          state: true,
        },
      },
    },
  });
  return candidates.map(mapCandidate);
}

export async function getCandidatesByIds(ids: number[]) {
  const candidates = await prisma.candidate.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    include: {
      party: true,
      constituency: {
        include: {
          state: true,
        },
      },
    },
  });
  return candidates.map(mapCandidate);
}

