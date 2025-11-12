import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkFactWithPerplexity, checkPerplexityApiHealth } from './services/perplexityApi';
import { searchWithExa, checkExaApiHealth } from './services/exaApi';
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
  origin: CONFIG.SERVER.CORS_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // For legacy browser support
};

// Middleware
app.use(cors({
  ...corsOptions,
  origin: CONFIG.SERVER.CORS_ORIGINS.filter(Boolean) as string[]
}));
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
interface ExaSearchRequest {
  query: string;
  type?: 'neural' | 'keyword' | 'auto' | 'fast';
  numResults?: number;
  includeDomains?: string[];
  excludeDomains?: string[];
  startPublishedDate?: string;
  endPublishedDate?: string;
  category?: string;
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

    const searchOptions = {
      type,
      numResults: numResults || 10,
      includeDomains,
      excludeDomains,
      startPublishedDate,
      endPublishedDate,
      category,
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

    res.status(statusCode).json({
      error: errorMessage,
      details: 'Failed to perform Exa search. Please try again or adjust your search parameters.'
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
      type as 'fact-check' | 'exa-search' | undefined
    );
    
    const total = sessionDb.count(type as 'fact-check' | 'exa-search' | undefined);
    
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
    } else if (session.type === 'exa-search') {
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
    const [perplexityHealth, exaHealth] = await Promise.allSettled([
      checkPerplexityApiHealth(),
      checkExaApiHealth()
    ]);

    const perplexityConnected = perplexityHealth.status === 'fulfilled' && perplexityHealth.value;
    const exaConnected = exaHealth.status === 'fulfilled' && exaHealth.value;

    res.json({ 
      status: (perplexityConnected || exaConnected) ? 'ok' : 'error',
      apis: {
        perplexity: {
          configured: !!process.env.PERPLEXITY_API_KEY,
          connected: perplexityConnected
        },
        exa: {
          configured: !!process.env.EXA_API_KEY,
          connected: exaConnected
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

