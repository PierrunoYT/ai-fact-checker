import { describe, it, expect } from '@jest/globals';
import {
  validateStatement,
  validateModel,
  validateSearchDomains,
  validateSearchRecency,
  validateSearchContextSize,
  validateDateFormat,
  sanitizeContent,
  ValidationError
} from '../validation';

describe('Backend Validation Utilities', () => {
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

  describe('validateModel', () => {
    it('should pass for valid models', () => {
      expect(() => validateModel('sonar')).not.toThrow();
      expect(() => validateModel('sonar-pro')).not.toThrow();
      expect(() => validateModel('sonar-reasoning')).not.toThrow();
      expect(() => validateModel('sonar-reasoning-pro')).not.toThrow();
    });

    it('should pass for undefined model', () => {
      expect(() => validateModel(undefined)).not.toThrow();
    });

    it('should throw for invalid models', () => {
      expect(() => validateModel('invalid-model')).toThrow(ValidationError);
      expect(() => validateModel('gpt-4')).toThrow(ValidationError);
    });
  });

  describe('validateSearchDomains', () => {
    it('should pass for valid domains', () => {
      expect(() => validateSearchDomains(['example.com'])).not.toThrow();
      expect(() => validateSearchDomains(['example.com', 'test.org'])).not.toThrow();
      expect(() => validateSearchDomains(['-pinterest.com'])).not.toThrow();
    });

    it('should pass for undefined domains', () => {
      expect(() => validateSearchDomains(undefined)).not.toThrow();
    });

    it('should throw for too many domains', () => {
      const manyDomains = Array.from({ length: 21 }, (_, i) => `domain${i}.com`);
      expect(() => validateSearchDomains(manyDomains)).toThrow(ValidationError);
    });

    it('should throw for invalid domain formats', () => {
      expect(() => validateSearchDomains(['invalid..domain'])).toThrow(ValidationError);
      expect(() => validateSearchDomains(['.invalid'])).toThrow(ValidationError);
      expect(() => validateSearchDomains(['invalid.'])).toThrow(ValidationError);
    });
  });

  describe('validateSearchRecency', () => {
    it('should pass for valid recency values', () => {
      expect(() => validateSearchRecency('month')).not.toThrow();
      expect(() => validateSearchRecency('week')).not.toThrow();
      expect(() => validateSearchRecency('day')).not.toThrow();
      expect(() => validateSearchRecency('hour')).not.toThrow();
    });

    it('should pass for undefined recency', () => {
      expect(() => validateSearchRecency(undefined)).not.toThrow();
    });

    it('should throw for invalid recency values', () => {
      expect(() => validateSearchRecency('year')).toThrow(ValidationError);
      expect(() => validateSearchRecency('minute')).toThrow(ValidationError);
    });
  });

  describe('validateSearchContextSize', () => {
    it('should pass for valid context sizes', () => {
      expect(() => validateSearchContextSize('low')).not.toThrow();
      expect(() => validateSearchContextSize('medium')).not.toThrow();
      expect(() => validateSearchContextSize('high')).not.toThrow();
    });

    it('should pass for undefined context size', () => {
      expect(() => validateSearchContextSize(undefined)).not.toThrow();
    });

    it('should throw for invalid context sizes', () => {
      expect(() => validateSearchContextSize('very-high')).toThrow(ValidationError);
      expect(() => validateSearchContextSize('minimal')).toThrow(ValidationError);
    });
  });

  describe('validateDateFormat', () => {
    it('should pass for valid dates', () => {
      expect(() => validateDateFormat('12/25/2023')).not.toThrow();
      expect(() => validateDateFormat('01/01/2024')).not.toThrow();
      expect(() => validateDateFormat('02/29/2024')).not.toThrow(); // Leap year
    });

    it('should pass for undefined date', () => {
      expect(() => validateDateFormat(undefined)).not.toThrow();
    });

    it('should throw for invalid date formats', () => {
      expect(() => validateDateFormat('2023-12-25')).toThrow(ValidationError);
      expect(() => validateDateFormat('25/12/2023')).toThrow(ValidationError);
      expect(() => validateDateFormat('invalid')).toThrow(ValidationError);
    });

    it('should throw for invalid dates', () => {
      expect(() => validateDateFormat('02/29/2023')).toThrow(ValidationError); // Not a leap year
      expect(() => validateDateFormat('13/01/2023')).toThrow(ValidationError); // Invalid month
      expect(() => validateDateFormat('12/32/2023')).toThrow(ValidationError); // Invalid day
    });

    it('should include field name in error', () => {
      expect(() => validateDateFormat('invalid', 'testField')).toThrow(
        expect.objectContaining({ field: 'testField' })
      );
    });
  });

  describe('sanitizeContent', () => {
    it('should remove control characters', () => {
      const input = 'Hello\x00\x01\x02World\x7F\x80\x9F';
      const expected = 'HelloWorld';
      expect(sanitizeContent(input)).toBe(expected);
    });

    it('should preserve valid whitespace', () => {
      const input = 'Hello\t\n\r World';
      expect(sanitizeContent(input)).toBe(input);
    });

    it('should handle empty string', () => {
      expect(sanitizeContent('')).toBe('');
    });

    it('should handle string with no control characters', () => {
      const input = 'Hello World! 123 @#$%';
      expect(sanitizeContent(input)).toBe(input);
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
