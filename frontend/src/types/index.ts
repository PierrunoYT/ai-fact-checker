/**
 * Comprehensive type definitions for the AI Fact Checker application
 */

// API Response Types
export interface FactCheckResponse {
  isFactual: boolean;
  confidence: number;
  explanation: string;
  sources: string[];
  citations?: Citation[];
  thinking?: string;
  usage?: UsageStats;
}

export interface Citation {
  id: number;
  url: string;
  title?: string;
  domain?: string;
  snippet?: string;
}

export interface UsageStats {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

// API Request Types
export interface FactCheckRequest {
  statement: string;
  model?: PerplexityModel;
  maxTokens?: number;
  temperature?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  topK?: number;
  topP?: number;
  searchDomains?: string[];
  searchRecency?: SearchRecency;
  searchAfterDate?: string;
  searchBeforeDate?: string;
  searchContextSize?: SearchContextSize;
  returnImages?: boolean;
  returnRelatedQuestions?: boolean;
  stream?: boolean;
}

// Model and Configuration Types
export type PerplexityModel = 'sonar' | 'sonar-pro' | 'sonar-reasoning' | 'sonar-reasoning-pro';
export type SearchRecency = 'month' | 'week' | 'day' | 'hour';
export type SearchContextSize = 'low' | 'medium' | 'high';

// Exa Search Types
export type ExaSearchType = 'neural' | 'keyword' | 'auto' | 'fast';
export type ExaCategory = 'company' | 'research paper' | 'news' | 'pdf' | 'github' | 'tweet' | 'personal site' | 'linkedin profile' | 'financial report';

export interface ExaSearchRequest {
  query: string;
  type?: ExaSearchType;
  numResults?: number;
  includeDomains?: string[];
  excludeDomains?: string[];
  startPublishedDate?: string;
  endPublishedDate?: string;
  category?: ExaCategory;
  userLocation?: string;
  getText?: boolean;
  getSummary?: boolean;
  getHighlights?: boolean;
  getContext?: boolean;
  contextMaxCharacters?: number;
}

export interface ExaSearchResult {
  title: string;
  url: string;
  publishedDate?: string;
  author?: string;
  snippet?: string;
  text?: string;
  summary?: string;
  highlights?: string[];
  relevanceScore?: number;
}

export interface ExaSearchResponse {
  success: boolean;
  query: string;
  results: ExaSearchResult[];
  searchType: string;
  costDollars?: number;
  requestId?: string;
  totalResults: number;
}

// Component Props Types
export interface ModelSelectorProps {
  model: PerplexityModel;
  onModelChange: (model: PerplexityModel) => void;
  isDarkMode: boolean;
}

export interface AdvancedOptionsProps {
  searchContextSize: SearchContextSize;
  setSearchContextSize: (size: SearchContextSize) => void;
  searchAfterDate: string;
  setSearchAfterDate: (date: string) => void;
  searchBeforeDate: string;
  setSearchBeforeDate: (date: string) => void;
  searchDomains: string;
  setSearchDomains: (domains: string) => void;
  searchRecency: SearchRecency | undefined;
  setSearchRecency: (recency: SearchRecency | undefined) => void;
  isDarkMode: boolean;
}

// Error Types
export interface ApiError {
  message: string;
  statusCode?: number;
  details?: string;
  field?: string;
}

export interface ValidationError extends Error {
  field?: string;
}

// Theme Types
export type Theme = 'light' | 'dark';

// Form State Types
export interface FactCheckFormState {
  statement: string;
  model: PerplexityModel;
  searchContextSize: SearchContextSize;
  searchAfterDate: string;
  searchBeforeDate: string;
  searchDomains: string;
  searchRecency: SearchRecency | undefined;
  showAdvancedOptions: boolean;
}

// Application State Types
export interface AppState {
  loading: boolean;
  result: FactCheckResponse | null;
  error: string | null;
  thinking: string;
  isDarkMode: boolean;
}

// Configuration Types
export interface ModelConfig {
  maxTokens: number;
  contextLength: number;
  hasReasoning: boolean;
}

export interface AppConfig {
  API_URL: string;
  REQUEST_TIMEOUT: number;
  MODELS: Record<PerplexityModel, ModelConfig>;
  DEFAULTS: {
    MODEL: PerplexityModel;
    TEMPERATURE: number;
    TOP_P: number;
    FREQUENCY_PENALTY: number;
    PRESENCE_PENALTY: number;
    TOP_K: number;
  };
  VALIDATION: {
    MAX_STATEMENT_LENGTH: number;
    MAX_DOMAINS: number;
    VALID_MODELS: readonly PerplexityModel[];
    VALID_RECENCY: readonly SearchRecency[];
    VALID_CONTEXT_SIZE: readonly SearchContextSize[];
  };
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Event Handler Types
export type FormSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
export type InputChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
export type ButtonClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => void;

// API Client Types
export interface ApiClient {
  checkFact: (statement: string, options?: Partial<FactCheckRequest>) => Promise<FactCheckResponse>;
  healthCheck: () => Promise<boolean>;
}

// Streaming Types
export interface StreamHandler {
  onData?: (chunk: string) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

// Date Utility Types
export type DateFormat = 'MM/DD/YYYY' | 'YYYY-MM-DD';

// Component Ref Types
export type TextAreaRef = React.RefObject<HTMLTextAreaElement>;
export type ButtonRef = React.RefObject<HTMLButtonElement>;

// Hook Return Types
export interface UseFactCheckReturn {
  loading: boolean;
  result: FactCheckResponse | null;
  error: string | null;
  checkFact: (statement: string, options?: Partial<FactCheckRequest>) => Promise<void>;
  reset: () => void;
}

export interface UseThemeReturn {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Constants
export const SUPPORTED_MODELS: readonly PerplexityModel[] = [
  'sonar',
  'sonar-pro', 
  'sonar-reasoning',
  'sonar-reasoning-pro'
] as const;

export const SEARCH_RECENCY_OPTIONS: readonly SearchRecency[] = [
  'hour',
  'day', 
  'week',
  'month'
] as const;

export const SEARCH_CONTEXT_SIZES: readonly SearchContextSize[] = [
  'low',
  'medium',
  'high'
] as const;
