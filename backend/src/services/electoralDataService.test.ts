/// <reference types="jest" />
import { validateVoteSum } from './electoralDataService';

describe('electoralDataService Unit Tests', () => {
  describe('validateVoteSum', () => {
    it('should validate when sum matches exactly', () => {
      const candidateVotes = [500000, 300000, 200000];
      const validVotes = 1000000;
      expect(validateVoteSum(candidateVotes, validVotes)).toBe(true);
    });

    it('should validate when sum is within 0.5% tolerance (just under)', () => {
      const candidateVotes = [500000, 300000, 196000]; // 996,000 (0.4% diff)
      const validVotes = 1000000;
      expect(validateVoteSum(candidateVotes, validVotes)).toBe(true);
    });

    it('should validate when sum is within 0.5% tolerance (just over)', () => {
      const candidateVotes = [500000, 300000, 204000]; // 1,004,000 (0.4% diff)
      const validVotes = 1000000;
      expect(validateVoteSum(candidateVotes, validVotes)).toBe(true);
    });

    it('should reject when sum is outside 0.5% tolerance', () => {
      const candidateVotes = [500000, 300000, 190000]; // 990,000 (1% diff)
      const validVotes = 1000000;
      expect(validateVoteSum(candidateVotes, validVotes)).toBe(false);
    });

    it('should reject when validVotes is zero or negative', () => {
      expect(validateVoteSum([100], 0)).toBe(false);
      expect(validateVoteSum([100], -100)).toBe(false);
    });
  });
});
