/**
 * Application configuration constants
 */

export const CONFIG = {
  // API Configuration
  PERPLEXITY_API_URL: 'https://api.perplexity.ai/chat/completions',
  EXA_API_URL: 'https://api.exa.ai/search',
  LINKUP_API_URL: 'https://api.linkup.so/v1/search',
  LINKUP_CREDITS_URL: 'https://api.linkup.so/v1/credits/balance',
  PARALLEL_API_URL: 'https://api.parallel.ai/v1beta/search',
  
  // Timeout Configuration
  REQUEST_TIMEOUT: parseInt(process.env.API_TIMEOUT || '120000'), // 2 minutes
  STREAM_TIMEOUT: parseInt(process.env.API_TIMEOUT || '120000'), // 2 minutes
  
  // Model Configuration
  MODELS: {
    'sonar': {
      maxTokens: 4000,
      contextLength: 127000,
      hasReasoning: false
    },
    'sonar-pro': {
      maxTokens: 8000,
      contextLength: 200000,
      hasReasoning: false
    },
    'sonar-reasoning': {
      maxTokens: 4000,
      contextLength: 127000,
      hasReasoning: true
    },
    'sonar-reasoning-pro': {
      maxTokens: 8000,
      contextLength: 127000,
      hasReasoning: true
    }
  } as const,
  
  // Default Values
  DEFAULTS: {
    MODEL: 'sonar' as const,
    TEMPERATURE: 0.2,
    TOP_P: 0.9,
    FREQUENCY_PENALTY: 1,
    PRESENCE_PENALTY: 0,
    TOP_K: 0
  },
  
  // Server Configuration
  SERVER: {
    PORT: parseInt(process.env.PORT || '3000'),
    CORS_ORIGINS: process.env.NODE_ENV === 'production' 
      ? [process.env.FRONTEND_URL].filter(Boolean)
      : ['http://localhost:5173', 'http://127.0.0.1:5173']
  },
  
  // Database Configuration
  DATABASE: {
    PATH: process.env.DATABASE_PATH || './data/fact-checker.db'
  },
  
  // Validation
  VALIDATION: {
    MAX_STATEMENT_LENGTH: 10000,
    MAX_DOMAINS: 20,
    VALID_MODELS: ['sonar', 'sonar-pro', 'sonar-reasoning', 'sonar-reasoning-pro'] as const,
    VALID_RECENCY: ['month', 'week', 'day', 'hour'] as const,
    VALID_CONTEXT_SIZE: ['low', 'medium', 'high'] as const
  }
} as const;

export type PerplexityModel = keyof typeof CONFIG.MODELS;
export type SearchRecency = typeof CONFIG.VALIDATION.VALID_RECENCY[number];
export type SearchContextSize = typeof CONFIG.VALIDATION.VALID_CONTEXT_SIZE[number];
