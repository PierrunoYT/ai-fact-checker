import { describe, it, expect } from 'vitest';
import {
  validateStatement,
  validateDomainFilter,
  formatDateForInput,
  formatDateForApi,
  formatDateObjectForApi,
  ValidationError
} from '../validation';

describe('validation utilities', () => {
  describe('validateStatement', () => {
    it('should pass for valid statements', () => {
      expect(() => validateStatement('This is a valid statement')).not.toThrow();
      expect(() => validateStatement('Short')).not.toThrow();
    });

    it('should throw for empty statements', () => {
      expect(() => validateStatement('')).toThrow(ValidationError);
      expect(() => validateStatement('   ')).toThrow(ValidationError);
    });

    it('should throw for statements that are too long', () => {
      const longStatement = 'a'.repeat(10001);
      expect(() => validateStatement(longStatement)).toThrow(ValidationError);
    });
  });

  describe('validateDomainFilter', () => {
    it('should return empty array for empty input', () => {
      expect(validateDomainFilter('')).toEqual([]);
      expect(validateDomainFilter('   ')).toEqual([]);
    });

    it('should parse valid domains', () => {
      expect(validateDomainFilter('example.com')).toEqual(['example.com']);
      expect(validateDomainFilter('example.com, test.org')).toEqual(['example.com', 'test.org']);
      expect(validateDomainFilter('-pinterest.com')).toEqual(['-pinterest.com']);
    });

    it('should throw for invalid domain formats', () => {
      expect(() => validateDomainFilter('invalid..domain')).toThrow(ValidationError);
      expect(() => validateDomainFilter('.invalid')).toThrow(ValidationError);
      expect(() => validateDomainFilter('invalid.')).toThrow(ValidationError);
    });

    it('should throw for too many domains', () => {
      const manyDomains = Array.from({ length: 21 }, (_, i) => `domain${i}.com`).join(',');
      expect(() => validateDomainFilter(manyDomains)).toThrow(ValidationError);
    });
  });

  describe('date formatting functions', () => {
    describe('formatDateForInput', () => {
      it('should convert MM/DD/YYYY to YYYY-MM-DD', () => {
        expect(formatDateForInput('12/25/2023')).toBe('2023-12-25');
        expect(formatDateForInput('01/01/2024')).toBe('2024-01-01');
      });

      it('should return empty string for empty input', () => {
        expect(formatDateForInput('')).toBe('');
      });

      it('should return original string for invalid format', () => {
        expect(formatDateForInput('invalid')).toBe('invalid');
      });
    });

    describe('formatDateForApi', () => {
      it('should convert YYYY-MM-DD to MM/DD/YYYY', () => {
        expect(formatDateForApi('2023-12-25')).toBe('12/25/2023');
        expect(formatDateForApi('2024-01-01')).toBe('1/1/2024');
      });

      it('should return empty string for empty input', () => {
        expect(formatDateForApi('')).toBe('');
      });

      it('should return original string for invalid format', () => {
        expect(formatDateForApi('invalid')).toBe('invalid');
      });
    });

    describe('formatDateObjectForApi', () => {
      it('should format Date object to MM/DD/YYYY', () => {
        const date = new Date('2023-12-25');
        expect(formatDateObjectForApi(date)).toBe('12/25/2023');
      });

      it('should handle single digit months and days', () => {
        const date = new Date('2024-01-01');
        expect(formatDateObjectForApi(date)).toBe('1/1/2024');
      });
    });
  });

  describe('ValidationError', () => {
    it('should create error with message and field', () => {
      const error = new ValidationError('Test error', 'testField');
      expect(error.message).toBe('Test error');
      expect(error.field).toBe('testField');
      expect(error.name).toBe('ValidationError');
    });

    it('should create error with just message', () => {
      const error = new ValidationError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.field).toBeUndefined();
    });
  });
});
