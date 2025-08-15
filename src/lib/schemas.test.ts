// src/lib/schemas.test.ts
import { onboardingSchema } from './schemas';

describe('onboardingSchema validation', () => {
  const getValidData = () => ({
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    companyName: 'Acme Corp',
    services: ['UI/UX'],
    budgetUsd: 1000,
    projectStartDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    acceptTerms: true,
  });

  it('should validate correct data', () => {
    const data = getValidData();
    const result = onboardingSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  describe('fullName validation', () => {
    it('should reject empty name', () => {
      const data = { ...getValidData(), fullName: '' };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toMatch(/at least 2 characters/);
    });

    it('should reject invalid characters', () => {
      const data = { ...getValidData(), fullName: 'John@Doe' };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toMatch(/letters, spaces/);
    });
  });

  describe('email validation', () => {
    it('should reject invalid email format', () => {
      const data = { ...getValidData(), email: 'not-an-email' };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toMatch(/valid email/);
    });
  });

  describe('services validation', () => {
    it('should require at least one service', () => {
      const data = { ...getValidData(), services: [] };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toMatch(/at least one service/);
    });

    it('should reject invalid services', () => {
      const data = { ...getValidData(), services: ['Invalid'] };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('budget validation', () => {
    it('should accept optional budget', () => {
      const data = { ...getValidData(), budgetUsd: undefined };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject budgets below 100', () => {
      const data = { ...getValidData(), budgetUsd: 99 };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('date validation', () => {
    it('should reject past dates', () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const data = { ...getValidData(), projectStartDate: yesterday };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('terms validation', () => {
    it('should require terms acceptance', () => {
      const data = { ...getValidData(), acceptTerms: false };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
  // Add to your schemas.test.ts
describe('edge cases', () => {
  it('should accept maximum valid name length (80 chars)', () => {
    const longName = 'A'.repeat(80);
    const data = { ...getValidData(), fullName: longName };
    expect(onboardingSchema.safeParse(data).success).toBe(true);
  });

  it('should reject name over 80 chars', () => {
    const longName = 'A'.repeat(81);
    const data = { ...getValidData(), fullName: longName };
    expect(onboardingSchema.safeParse(data).success).toBe(false);
  });

  it('should accept exactly 100 chars for company name', () => {
    const longCompany = 'A'.repeat(100);
    const data = { ...getValidData(), companyName: longCompany };
    expect(onboardingSchema.safeParse(data).success).toBe(true);
  });
});
});