import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkFactWithPerplexity, checkPerplexityApiHealth } from './services/perplexityApi';
import { searchWithExa, checkExaApiHealth } from './services/exaApi';
import { searchWithLinkup, checkLinkupApiHealth } from './services/linkupApi';
import { searchWithParallel, checkParallelApiHealth } from './services/parallelApi';
import { searchWithTavily, checkTavilyApiHealth } from './services/tavilyApi';
import { searchWithValyu, checkValyuApiHealth } from './services/valyuApi';
import { sessionDb, factCheckDb, exaSearchDb } from './services/database';
import { CONFIG } from './config/constants';
import { logger } from './utils/logger';
import {
  validateStatement,
  validateModel,
  validateSearchDomains,
  validateSearchRecency,
  validateSearchContextSize,
  validateDateFormat,
  ValidationError
} from './utils/validation';

dotenv.config();

const app = express();
const port = CONFIG.SERVER.PORT;

// CORS configuration with improved security
const corsOptions = {
  origin: CONFIG.SERVER.CORS_ORIGINS.filter(Boolean) as string[],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.logRequest(req.method, req.path, req.get('User-Agent'));
  next();
});

// Types
interface FactCheckRequest {
  statement: string;
  model?: 'sonar' | 'sonar-pro' | 'sonar-reasoning' | 'sonar-reasoning-pro';
  maxTokens?: number;
  temperature?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  topK?: number;
  topP?: number;
  searchDomains?: string[];
  searchRecency?: 'month' | 'week' | 'day' | 'hour';
  searchAfterDate?: string; // MM/DD/YYYY format
  searchBeforeDate?: string; // MM/DD/YYYY format
  searchContextSize?: 'low' | 'medium' | 'high';
  returnImages?: boolean;
  returnRelatedQuestions?: boolean;
  stream?: boolean;
}

interface FactCheckResponse {
  isFactual: boolean;
  confidence: number;
  explanation: string;
  sources: string[];
  thinking?: string;
}

// Custom error class
class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Error handler middleware
const errorHandler = (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  logger.logError(err, {
    method: req.method,
    path: req.path,
    body: req.body
  });

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details
    });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: err.message,
      field: err.field
    });
  }

  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// Enhanced validation middleware
const validateFactCheckRequest = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const {
      statement,
      model,
      searchDomains,
      searchRecency,
      searchAfterDate,
      searchBeforeDate,
      searchContextSize
    } = req.body as FactCheckRequest;

    // Validate all fields
    validateStatement(statement);
    validateModel(model);
    validateSearchDomains(searchDomains);
    validateSearchRecency(searchRecency);
    validateSearchContextSize(searchContextSize);
    validateDateFormat(searchAfterDate, 'searchAfterDate');
    validateDateFormat(searchBeforeDate, 'searchBeforeDate');

    if (!process.env.PERPLEXITY_API_KEY) {
      throw new ApiError(500, 'Server configuration error', 'Perplexity API key is not configured');
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Routes
app.post('/api/check-fact', validateFactCheckRequest, async (req, res) => {
  let hasResponded = false;

  // Set timeout from configuration
  req.setTimeout(CONFIG.REQUEST_TIMEOUT);
  res.setTimeout(CONFIG.REQUEST_TIMEOUT);

  try {
    const { 
      statement, 
      model, 
      maxTokens,
      temperature,
      frequencyPenalty,
      presencePenalty,
      topK,
      topP,
      searchDomains,
      searchRecency,
      searchAfterDate,
      searchBeforeDate,
      searchContextSize,
      returnImages,
      returnRelatedQuestions,
      stream 
    } = req.body as FactCheckRequest;

    // Create options object with all parameters
    const options = {
      model,
      maxTokens,
      temperature,
      frequencyPenalty,
      presencePenalty,
      topK,
      topP,
      searchDomains,
      searchRecency,
      searchAfterDate,
      searchBeforeDate,
      searchContextSize,
      returnImages,
      returnRelatedQuestions
    };

    if (stream) {
      // Set up SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const streamHandler = {
        onThinking: (thinking: string) => {
          if (!hasResponded) {
            res.write(`data: ${JSON.stringify({ type: 'thinking', content: thinking })}\n\n`);
          }
        },
        onResult: (result: FactCheckResponse) => {
          if (!hasResponded) {
            res.write(`data: ${JSON.stringify({ type: 'result', content: result })}\n\n`);
            res.write('data: [DONE]\n\n');
            res.end();
            hasResponded = true;
          }
        },
        onError: (error: Error) => {
          if (!hasResponded) {
            res.write(`data: ${JSON.stringify({ type: 'error', content: error.message })}\n\n`);
            res.write('data: [DONE]\n\n');
            res.end();
            hasResponded = true;
          }
        }
      };

      // Handle client disconnect
      req.on('close', () => {
        hasResponded = true;
      });

      try {
        const result = await checkFactWithPerplexity(statement, options, streamHandler);
        if (!hasResponded) {
          streamHandler.onResult(result);
        }
      } catch (error) {
        if (!hasResponded) {
          streamHandler.onError(error instanceof Error ? error : new Error('Unknown error occurred'));
        }
      }
    } else {
      const result = await checkFactWithPerplexity(statement, options);
      
      // Save to database
      try {
        const session = sessionDb.create('fact-check', statement);
        factCheckDb.save(session.id, {
          isFactual: result.isFactual,
          confidence: result.confidence,
          explanation: result.explanation,
          thinking: result.thinking,
          model: options.model,
          usage: result.usage,
          citations: result.citations
        });
        logger.info(`Saved fact check session: ${session.id}`);
      } catch (dbError) {
        logger.error('Failed to save fact check result to database:', dbError);
        // Don't fail the request if database save fails
      }
      
      res.json(result);
    }
  } catch (error) {
    if (!hasResponded) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: 'The request took too long to process. Please try again.'
      });
      hasResponded = true;
    }
  }
});

// Exa search endpoint
type ExaSearchType =
  | 'auto'
  | 'neural'
  | 'fast'
  | 'deep'
  | 'deep-reasoning'
  | 'deep-max'
  | 'instant';

type ExaCategory =
  | 'company'
  | 'research paper'
  | 'news'
  | 'tweet'
  | 'personal site'
  | 'financial report'
  | 'people';

const VALID_EXA_SEARCH_TYPES: ExaSearchType[] = [
  'auto',
  'neural',
  'fast',
  'deep',
  'deep-reasoning',
  'deep-max',
  'instant'
];

const VALID_EXA_CATEGORIES: ExaCategory[] = [
  'company',
  'research paper',
  'news',
  'tweet',
  'personal site',
  'financial report',
  'people'
];

const LEGACY_EXA_SEARCH_TYPE_MAP: Record<string, ExaSearchType> = {
  keyword: 'auto'
};

const LEGACY_EXA_CATEGORY_MAP: Record<string, ExaCategory | undefined> = {
  'linkedin profile': 'people',
  pdf: undefined,
  github: undefined
};

function normalizeExaSearchType(type?: string): ExaSearchType | undefined {
  if (!type) return undefined;

  const normalizedType = type.trim().toLowerCase();
  const mappedType = LEGACY_EXA_SEARCH_TYPE_MAP[normalizedType];
  if (mappedType) {
    return mappedType;
  }

  if (VALID_EXA_SEARCH_TYPES.includes(normalizedType as ExaSearchType)) {
    return normalizedType as ExaSearchType;
  }

  throw new ValidationError(
    `Invalid Exa search type. Must be one of: ${VALID_EXA_SEARCH_TYPES.join(', ')}`,
    'type'
  );
}

function normalizeExaCategory(category?: string): ExaCategory | undefined {
  if (!category) return undefined;

  const normalizedCategory = category.trim().toLowerCase();
  if (Object.prototype.hasOwnProperty.call(LEGACY_EXA_CATEGORY_MAP, normalizedCategory)) {
    return LEGACY_EXA_CATEGORY_MAP[normalizedCategory];
  }

  if (VALID_EXA_CATEGORIES.includes(normalizedCategory as ExaCategory)) {
    return normalizedCategory as ExaCategory;
  }

  throw new ValidationError(
    `Invalid Exa category. Must be one of: ${VALID_EXA_CATEGORIES.join(', ')}`,
    'category'
  );
}

interface ExaSearchRequest {
  query: string;
  type?: ExaSearchType | 'keyword';
  numResults?: number;
  includeDomains?: string[];
  excludeDomains?: string[];
  startPublishedDate?: string;
  endPublishedDate?: string;
  category?: ExaCategory | 'pdf' | 'github' | 'linkedin profile';
  userLocation?: string;
  getText?: boolean;
  getSummary?: boolean;
  getHighlights?: boolean;
  getContext?: boolean;
  contextMaxCharacters?: number;
}

app.post('/api/exa-search', async (req, res) => {
  try {
    const {
      query,
      type,
      numResults,
      includeDomains,
      excludeDomains,
      startPublishedDate,
      endPublishedDate,
      category,
      userLocation,
      getText,
      getSummary,
      getHighlights,
      getContext,
      contextMaxCharacters
    } = req.body as ExaSearchRequest;

    const normalizedType = normalizeExaSearchType(type);
    const normalizedCategory = normalizeExaCategory(category);

    // Validate query
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Query is required and must be a non-empty string'
      });
    }

    if (query.length > 1000) {
      return res.status(400).json({
        error: 'Query must be 1000 characters or less'
      });
    }

    // Validate domains if provided
    if (includeDomains) {
      validateSearchDomains(includeDomains);
    }
    if (excludeDomains) {
      validateSearchDomains(excludeDomains);
    }

    // Validate dates if provided
    if (startPublishedDate) {
      validateDateFormat(startPublishedDate, 'startPublishedDate');
    }
    if (endPublishedDate) {
      validateDateFormat(endPublishedDate, 'endPublishedDate');
    }

    if (numResults !== undefined) {
      if (!Number.isInteger(numResults) || numResults < 1 || numResults > 100) {
        throw new ValidationError('numResults must be an integer between 1 and 100', 'numResults');
      }
    }

    if (contextMaxCharacters !== undefined) {
      if (!Number.isInteger(contextMaxCharacters) || contextMaxCharacters < 100 || contextMaxCharacters > 50000) {
        throw new ValidationError(
          'contextMaxCharacters must be an integer between 100 and 50000',
          'contextMaxCharacters'
        );
      }
    }

    if (type && normalizedType !== type) {
      logger.warn(`Mapped legacy Exa search type "${type}" to "${normalizedType}"`);
    }
    if (category && normalizedCategory !== category) {
      logger.warn(`Mapped/deprecated Exa category "${category}" to "${normalizedCategory ?? 'none'}"`);
    }

    const searchOptions = {
      type: normalizedType,
      numResults: numResults ?? 10,
      includeDomains,
      excludeDomains,
      startPublishedDate,
      endPublishedDate,
      category: normalizedCategory,
      userLocation,
      getText: getText || false,
      getSummary: getSummary || false,
      getHighlights: getHighlights || false,
      getContext: getContext || false,
      contextMaxCharacters
    };

    const result = await searchWithExa(query, searchOptions);
    
    // Save to database
    try {
      const session = sessionDb.create('exa-search', query);
      exaSearchDb.save(session.id, {
        searchType: result.searchType,
        costDollars: result.costDollars,
        requestId: result.requestId,
        results: result.results
      });
      logger.info(`Saved Exa search session: ${session.id}`);
    } catch (dbError) {
      logger.error('Failed to save Exa search result to database:', dbError);
      // Don't fail the request if database save fails
    }
    
    res.json({
      success: true,
      query,
      results: result.results,
      searchType: result.searchType,
      costDollars: result.costDollars,
      requestId: result.requestId,
      totalResults: result.results.length
    });
  } catch (error) {
    logger.error('Exa search error:', error);

    // Log detailed error information for debugging
    if (error instanceof Error) {
      logger.error('Error message:', error.message);
      logger.error('Error stack:', error.stack);
    }

    // Return more helpful error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const statusCode = error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 500;

    if (error instanceof ValidationError) {
      return res.status(400).json({
        error: error.message,
        field: error.field
      });
    }

    res.status(statusCode).json({
      error: errorMessage,
      details: 'Failed to perform Exa search. Please try again or adjust your search parameters.'
    });
  }
});

// Linkup search endpoint
interface LinkupSearchRequest {
  query: string;
  depth?: 'standard' | 'deep';
  outputType?: 'sourcedAnswer' | 'raw';
  structuredOutputSchema?: any;
  includeImages?: boolean;
  fromDate?: string;
  toDate?: string;
  excludeDomains?: string[];
  includeDomains?: string[];
  includeInlineCitations?: boolean;
  includeSources?: boolean;
}

app.post('/api/linkup-search', async (req, res) => {
  try {
    const {
      query,
      depth,
      outputType,
      structuredOutputSchema,
      includeImages,
      fromDate,
      toDate,
      excludeDomains,
      includeDomains,
      includeInlineCitations,
      includeSources
    } = req.body as LinkupSearchRequest;

    // Validate query
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Query is required and must be a non-empty string'
      });
    }

    if (query.length > 1000) {
      return res.status(400).json({
        error: 'Query must be 1000 characters or less'
      });
    }

    // Validate domains if provided
    if (includeDomains) {
      validateSearchDomains(includeDomains);
    }
    if (excludeDomains) {
      validateSearchDomains(excludeDomains);
    }

    // Validate dates if provided
    if (fromDate) {
      validateDateFormat(fromDate, 'fromDate');
    }
    if (toDate) {
      validateDateFormat(toDate, 'toDate');
    }

    const searchOptions = {
      depth: depth || 'standard',
      outputType: outputType || 'sourcedAnswer',
      structuredOutputSchema,
      includeImages: includeImages || false,
      fromDate,
      toDate,
      excludeDomains,
      includeDomains,
      includeInlineCitations: includeInlineCitations !== undefined ? includeInlineCitations : false,
      includeSources: includeSources !== undefined ? includeSources : true
    };

    const result = await searchWithLinkup(query, searchOptions);
    
    // Save to database
    try {
      const session = sessionDb.create('linkup-search', query);
      exaSearchDb.save(session.id, {
        searchType: 'linkup',
        results: result.results
      });
      logger.info(`Saved Linkup search session: ${session.id}`);
    } catch (dbError) {
      logger.error('Failed to save Linkup search result to database:', dbError);
      // Don't fail the request if database save fails
    }
    
    res.json({
      success: true,
      query,
      results: result.results,
      answer: result.answer,
      sources: result.sources,
      totalResults: result.results.length
    });
  } catch (error) {
    logger.error('Linkup search error:', error);

    // Log detailed error information for debugging
    if (error instanceof Error) {
      logger.error('Error message:', error.message);
      logger.error('Error stack:', error.stack);
    }

    // Return more helpful error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const statusCode = error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 500;

    res.status(statusCode).json({
      error: errorMessage,
      details: 'Failed to perform Linkup search. Please try again or adjust your search parameters.'
    });
  }
});

// Parallel search endpoint
interface ParallelSearchRequest {
  objective: string;
  searchQueries?: string[];
  maxResults?: number;
  maxCharsPerResult?: number;
}

app.post('/api/parallel-search', async (req, res) => {
  try {
    const {
      objective,
      searchQueries,
      maxResults,
      maxCharsPerResult
    } = req.body as ParallelSearchRequest;

    // Validate objective
    if (!objective || typeof objective !== 'string' || objective.trim().length === 0) {
      return res.status(400).json({
        error: 'Objective is required and must be a non-empty string'
      });
    }

    if (objective.length > 2000) {
      return res.status(400).json({
        error: 'Objective must be 2000 characters or less'
      });
    }

    const searchOptions = {
      searchQueries: searchQueries && searchQueries.length > 0 ? searchQueries : undefined,
      maxResults: maxResults || 10,
      maxCharsPerResult: maxCharsPerResult || 10000
    };

    const result = await searchWithParallel(objective, searchOptions);
    
    // Save to database
    try {
      const session = sessionDb.create('parallel-search', objective);
      exaSearchDb.save(session.id, {
        searchType: 'parallel',
        results: result.results
      });
      logger.info(`Saved Parallel search session: ${session.id}`);
    } catch (dbError) {
      logger.error('Failed to save Parallel search result to database:', dbError);
      // Don't fail the request if database save fails
    }
    
    res.json({
      success: true,
      query: objective,
      results: result.results,
      searchId: result.searchId,
      totalResults: result.results.length
    });
  } catch (error) {
    logger.error('Parallel search error:', error);

    // Log detailed error information for debugging
    if (error instanceof Error) {
      logger.error('Error message:', error.message);
      logger.error('Error stack:', error.stack);
    }

    // Return more helpful error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const statusCode = error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 500;

    res.status(statusCode).json({
      error: errorMessage,
      details: 'Failed to perform Parallel search. Please try again or adjust your search parameters.'
    });
  }
});

// Tavily search endpoint
interface TavilySearchRequest {
  query: string;
  searchDepth?: 'basic' | 'advanced';
  maxResults?: number;
  includeDomains?: string[];
  excludeDomains?: string[];
  includeAnswer?: boolean;
  includeImages?: boolean;
  includeRawContent?: boolean;
  topic?: 'general' | 'news';
}

app.post('/api/tavily-search', async (req, res) => {
  try {
    const {
      query,
      searchDepth,
      maxResults,
      includeDomains,
      excludeDomains,
      includeAnswer,
      includeImages,
      includeRawContent,
      topic
    } = req.body as TavilySearchRequest;

    // Validate query
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Query is required and must be a non-empty string'
      });
    }

    if (query.length > 1000) {
      return res.status(400).json({
        error: 'Query must be 1000 characters or less'
      });
    }

    // Validate domains if provided
    if (includeDomains) {
      validateSearchDomains(includeDomains);
    }
    if (excludeDomains) {
      validateSearchDomains(excludeDomains);
    }

    const searchOptions = {
      searchDepth: searchDepth || 'basic',
      maxResults: maxResults || 10,
      includeDomains,
      excludeDomains,
      includeAnswer: includeAnswer || false,
      includeImages: includeImages || false,
      includeRawContent: includeRawContent || false,
      topic: topic || 'general'
    };

    const result = await searchWithTavily(query, searchOptions);
    
    // Save to database
    try {
      const session = sessionDb.create('tavily-search', query);
      exaSearchDb.save(session.id, {
        searchType: 'tavily',
        results: result.results
      });
      logger.info(`Saved Tavily search session: ${session.id}`);
    } catch (dbError) {
      logger.error('Failed to save Tavily search result to database:', dbError);
      // Don't fail the request if database save fails
    }
    
    res.json({
      success: true,
      query,
      results: result.results,
      answer: result.answer,
      responseTime: result.responseTime,
      totalResults: result.results.length
    });
  } catch (error) {
    logger.error('Tavily search error:', error);

    // Log detailed error information for debugging
    if (error instanceof Error) {
      logger.error('Error message:', error.message);
      logger.error('Error stack:', error.stack);
    }

    // Return more helpful error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const statusCode = error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 500;

    res.status(statusCode).json({
      error: errorMessage,
      details: 'Failed to perform Tavily search. Please try again or adjust your search parameters.'
    });
  }
});

// Valyu search endpoint
interface ValyuSearchRequest {
  query: string;
  searchType?: 'web' | 'proprietary' | 'news' | 'all';
  maxNumResults?: number;
  maxPrice?: number;
  relevanceThreshold?: number;
  includedSources?: string[];
  excludedSources?: string[];
  startDate?: string;
  endDate?: string;
  countryCode?: string;
  responseLength?: 'short' | 'medium' | 'large' | 'max';
  fastMode?: boolean;
}

app.post('/api/valyu-search', async (req, res) => {
  try {
    const {
      query,
      searchType,
      maxNumResults,
      maxPrice,
      relevanceThreshold,
      includedSources,
      excludedSources,
      startDate,
      endDate,
      countryCode,
      responseLength,
      fastMode
    } = req.body as ValyuSearchRequest;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Query is required and must be a non-empty string'
      });
    }

    if (query.length > 1000) {
      return res.status(400).json({
        error: 'Query must be 1000 characters or less'
      });
    }

    if (includedSources) {
      validateSearchDomains(includedSources);
    }
    if (excludedSources) {
      validateSearchDomains(excludedSources);
    }

    const searchOptions = {
      searchType: searchType || 'all',
      maxNumResults: maxNumResults || 10,
      maxPrice,
      relevanceThreshold,
      includedSources,
      excludedSources,
      startDate,
      endDate,
      countryCode,
      responseLength: responseLength || 'short',
      fastMode: fastMode || false
    };

    const result = await searchWithValyu(query, searchOptions);

    // Save to database
    try {
      const session = sessionDb.create('valyu-search', query);
      exaSearchDb.save(session.id, {
        searchType: 'valyu',
        results: result.results
      });
      logger.info(`Saved Valyu search session: ${session.id}`);
    } catch (dbError) {
      logger.error('Failed to save Valyu search result to database:', dbError);
    }

    res.json({
      success: true,
      query,
      results: result.results,
      txId: result.txId,
      totalDeductionDollars: result.totalDeductionDollars,
      totalCharacters: result.totalCharacters,
      totalResults: result.results.length
    });
  } catch (error) {
    logger.error('Valyu search error:', error);

    if (error instanceof Error) {
      logger.error('Error message:', error.message);
      logger.error('Error stack:', error.stack);
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const statusCode = error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 500;

    res.status(statusCode).json({
      error: errorMessage,
      details: 'Failed to perform Valyu search. Please try again or adjust your search parameters.'
    });
  }
});

// Get all sessions endpoint
app.get('/api/sessions', async (req, res) => {
  try {
    const { type, limit = '50', offset = '0' } = req.query;
    
    const sessions = sessionDb.getAll(
      parseInt(limit as string),
      parseInt(offset as string),
      type as 'fact-check' | 'exa-search' | 'linkup-search' | 'parallel-search' | 'tavily-search' | 'valyu-search' | undefined
    );
    
    const total = sessionDb.count(type as 'fact-check' | 'exa-search' | 'linkup-search' | 'parallel-search' | 'tavily-search' | 'valyu-search' | undefined);
    
    res.json({
      sessions,
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    });
  } catch (error) {
    logger.error('Error fetching sessions:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Get session by ID with results
app.get('/api/sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const session = sessionDb.getById(id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    let result = null;
    
    if (session.type === 'fact-check') {
      const results = factCheckDb.getBySessionId(id);
      if (results.length > 0) {
        const latestResult = factCheckDb.getById(results[0].id);
        result = latestResult;
      }
    } else if (session.type === 'exa-search' || session.type === 'linkup-search' || session.type === 'parallel-search' || session.type === 'tavily-search' || session.type === 'valyu-search') {
      // All web search types use the exaSearchDb (which stores all search results)
      const results = exaSearchDb.getBySessionId(id);
      if (results.length > 0) {
        const latestResult = exaSearchDb.getById(results[0].id);
        result = latestResult;
      }
    }
    
    res.json({
      session,
      result
    });
  } catch (error) {
    logger.error('Error fetching session:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Delete session endpoint
app.delete('/api/sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const session = sessionDb.getById(id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    sessionDb.delete(id);
    
    res.json({ success: true, message: 'Session deleted successfully' });
  } catch (error) {
    logger.error('Error deleting session:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const [perplexityHealth, exaHealth, linkupHealth, tavilyHealth, valyuHealth] = await Promise.allSettled([
      checkPerplexityApiHealth(),
      checkExaApiHealth(),
      checkLinkupApiHealth(),
      checkTavilyApiHealth(),
      checkValyuApiHealth()
    ]);

    const perplexityConnected = perplexityHealth.status === 'fulfilled' && perplexityHealth.value;
    const exaConnected = exaHealth.status === 'fulfilled' && exaHealth.value;
    const linkupConnected = linkupHealth.status === 'fulfilled' && linkupHealth.value;
    const tavilyConnected = tavilyHealth.status === 'fulfilled' && tavilyHealth.value;
    const valyuConnected = valyuHealth.status === 'fulfilled' && valyuHealth.value;

    res.json({ 
      status: (perplexityConnected || exaConnected || linkupConnected || tavilyConnected || valyuConnected) ? 'ok' : 'error',
      apis: {
        perplexity: {
          configured: !!process.env.PERPLEXITY_API_KEY,
          connected: perplexityConnected
        },
        exa: {
          configured: !!process.env.EXA_API_KEY,
          connected: exaConnected
        },
        linkup: {
          configured: !!process.env.LINKUP_API_KEY,
          connected: linkupConnected
        },
        tavily: {
          configured: !!process.env.TAVILY_API_KEY,
          connected: tavilyConnected
        },
        valyu: {
          configured: !!process.env.VALYU_API_KEY,
          connected: valyuConnected
        }
      },
      models: ['sonar', 'sonar-pro', 'sonar-reasoning', 'sonar-reasoning-pro']
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      apis: {
        perplexity: {
          configured: !!process.env.PERPLEXITY_API_KEY,
          connected: false
        },
        exa: {
          configured: !!process.env.EXA_API_KEY,
          connected: false
        },
        linkup: {
          configured: !!process.env.LINKUP_API_KEY,
          connected: false
        },
        tavily: {
          configured: !!process.env.TAVILY_API_KEY,
          connected: false
        },
        valyu: {
          configured: !!process.env.VALYU_API_KEY,
          connected: false
        }
      },
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Apply error handler
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
  logger.logApiKeyStatus(!!process.env.PERPLEXITY_API_KEY);
});

