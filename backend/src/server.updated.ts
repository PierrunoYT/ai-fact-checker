import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkFactWithPerplexity, checkPerplexityApiHealth } from './services/perplexityApi';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

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
  console.error('Error:', err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details
    });
  }

  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// Validation middleware
const validateFactCheckRequest = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { statement, model } = req.body as FactCheckRequest;

  if (!statement?.trim()) {
    throw new ApiError(400, 'Statement is required');
  }

  if (model && !['sonar', 'sonar-pro', 'sonar-reasoning', 'sonar-reasoning-pro'].includes(model)) {
    throw new ApiError(400, 'Invalid model specified');
  }

  if (!process.env.PERPLEXITY_API_KEY) {
    throw new ApiError(500, 'Server configuration error', 'Perplexity API key is not configured');
  }

  next();
};

// Routes
app.post('/api/check-fact', validateFactCheckRequest, async (req, res) => {
  let hasResponded = false;
  
  // Set a longer timeout for this route
  req.setTimeout(120000); // 2 minutes
  res.setTimeout(120000); // 2 minutes

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

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const apiHealth = await checkPerplexityApiHealth();
    res.json({ 
      status: apiHealth ? 'ok' : 'error',
      apiConfigured: !!process.env.PERPLEXITY_API_KEY,
      apiConnected: apiHealth,
      models: ['sonar', 'sonar-pro', 'sonar-reasoning', 'sonar-reasoning-pro']
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      apiConfigured: !!process.env.PERPLEXITY_API_KEY,
      apiConnected: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Apply error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`API key configured: ${!!process.env.PERPLEXITY_API_KEY}`);
});
