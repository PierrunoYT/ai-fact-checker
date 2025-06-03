import { CONFIG } from '../config/constants';

/**
 * Validation utility functions
 */

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validates a fact-check statement
 */
export function validateStatement(statement: string): void {
  if (!statement?.trim()) {
    throw new ValidationError('Statement is required', 'statement');
  }
  
  if (statement.length > CONFIG.VALIDATION.MAX_STATEMENT_LENGTH) {
    throw new ValidationError(
      `Statement must be less than ${CONFIG.VALIDATION.MAX_STATEMENT_LENGTH} characters`,
      'statement'
    );
  }
}

/**
 * Validates the selected model
 */
export function validateModel(model?: string): void {
  if (model && !CONFIG.VALIDATION.VALID_MODELS.includes(model as any)) {
    throw new ValidationError(
      `Invalid model. Must be one of: ${CONFIG.VALIDATION.VALID_MODELS.join(', ')}`,
      'model'
    );
  }
}

/**
 * Validates search domains
 */
export function validateSearchDomains(domains?: string[]): void {
  if (!domains) return;
  
  if (domains.length > CONFIG.VALIDATION.MAX_DOMAINS) {
    throw new ValidationError(
      `Too many domains. Maximum ${CONFIG.VALIDATION.MAX_DOMAINS} allowed`,
      'searchDomains'
    );
  }
  
  const domainRegex = /^-?[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  for (const domain of domains) {
    const cleanDomain = domain.startsWith('-') ? domain.slice(1) : domain;
    if (!domainRegex.test(cleanDomain)) {
      throw new ValidationError(
        `Invalid domain format: ${domain}`,
        'searchDomains'
      );
    }
  }
}

/**
 * Validates search recency
 */
export function validateSearchRecency(recency?: string): void {
  if (recency && !CONFIG.VALIDATION.VALID_RECENCY.includes(recency as any)) {
    throw new ValidationError(
      `Invalid recency. Must be one of: ${CONFIG.VALIDATION.VALID_RECENCY.join(', ')}`,
      'searchRecency'
    );
  }
}

/**
 * Validates search context size
 */
export function validateSearchContextSize(contextSize?: string): void {
  if (contextSize && !CONFIG.VALIDATION.VALID_CONTEXT_SIZE.includes(contextSize as any)) {
    throw new ValidationError(
      `Invalid context size. Must be one of: ${CONFIG.VALIDATION.VALID_CONTEXT_SIZE.join(', ')}`,
      'searchContextSize'
    );
  }
}

/**
 * Validates date format (MM/DD/YYYY)
 */
export function validateDateFormat(date?: string, fieldName?: string): void {
  if (!date) return;
  
  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
  if (!dateRegex.test(date)) {
    throw new ValidationError(
      `Invalid date format. Expected MM/DD/YYYY, got: ${date}`,
      fieldName
    );
  }
  
  // Validate actual date
  const [month, day, year] = date.split('/').map(Number);
  const dateObj = new Date(year, month - 1, day);
  
  if (dateObj.getFullYear() !== year || 
      dateObj.getMonth() !== month - 1 || 
      dateObj.getDate() !== day) {
    throw new ValidationError(
      `Invalid date: ${date}`,
      fieldName
    );
  }
}

/**
 * Sanitizes content while preserving valid characters
 */
export function sanitizeContent(content: string): string {
  // Remove only control characters that are not whitespace
  return content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');
}
