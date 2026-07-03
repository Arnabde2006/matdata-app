import { prisma } from '../server';

export async function listStates() {
  return prisma.state.findMany();
}

export async function listTimelineEvents(stateId?: number) {
  return prisma.timelineEvent.findMany({
    where: {
      OR: [
        { state_id: null }, // National events
        ...(stateId !== undefined ? [{ state_id: stateId }] : []),
      ],
    },
    orderBy: {
      event_date: 'asc',
    },
  });
}
