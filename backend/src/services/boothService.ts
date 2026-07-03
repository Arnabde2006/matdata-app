import { getMockBooth, BoothRecord } from '../data/boothMockData';

export async function findBooth(epicNumber: string): Promise<BoothRecord> {
  // Currently wrapper around mock data, can be integrated with external APIs later
  return getMockBooth(epicNumber);
}
