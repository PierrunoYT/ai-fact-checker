/**
 * Frontend validation utilities
 */

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validates domain filter input
 */
export function validateDomainFilter(domains: string): string[] {
  if (!domains.trim()) return [];
  
  const domainList = domains.split(',').map(d => d.trim()).filter(Boolean);
  const maxDomains = 20;
  
  if (domainList.length > maxDomains) {
    throw new ValidationError(`Too many domains. Maximum ${maxDomains} allowed.`);
  }
  
  const domainRegex = /^-?[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  for (const domain of domainList) {
    const cleanDomain = domain.startsWith('-') ? domain.slice(1) : domain;
    if (!domainRegex.test(cleanDomain)) {
      throw new ValidationError(`Invalid domain format: ${domain}`);
    }
  }
  
  return domainList;
}

/**
 * Validates statement length
 */
export function validateStatement(statement: string): void {
  const maxLength = 10000;
  
  if (!statement.trim()) {
    throw new ValidationError('Statement is required');
  }
  
  if (statement.length > maxLength) {
    throw new ValidationError(`Statement must be less than ${maxLength} characters`);
  }
}

/**
 * Formats date for HTML input (YYYY-MM-DD)
 */
export function formatDateForInput(dateString: string): string {
  if (!dateString) return '';
  
  // Convert from MM/DD/YYYY to YYYY-MM-DD
  const parts = dateString.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
  }
  return dateString;
}

/**
 * Formats date for API (MM/DD/YYYY)
 */
export function formatDateForApi(dateString: string): string {
  if (!dateString) return '';
  
  // Convert from YYYY-MM-DD to MM/DD/YYYY
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[1]}/${parts[2]}/${parts[0]}`;
  }
  return dateString;
}

/**
 * Formats Date object to MM/DD/YYYY string
 */
export function formatDateObjectForApi(date: Date): string {
  const month = (date.getMonth() + 1).toString();
  const day = date.getDate().toString();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}
