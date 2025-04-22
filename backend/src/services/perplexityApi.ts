import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Constants and Configuration
const CONFIG = {
  API_URL: 'https://api.perplexity.ai/chat/completions',
  DEFAULT_MODEL: 'sonar' as const,
  DEFAULT_TEMPERATURE: 0.2,
  DEFAULT_TOP_P: 0.9,
  DEFAULT_FREQUENCY_PENALTY: 1,
  DEFAULT_PRESENCE_PENALTY: 0,
  DEFAULT_TOP_K: 0,
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
  } as const
};

// Types
type PerplexityModel = keyof typeof CONFIG.MODELS;

interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface PerplexityRequestOptions {
  model?: PerplexityModel;
  messages: PerplexityMessage[];
  frequency_penalty?: number;
  max_tokens?: number;
  presence_penalty?: number;
  response_format?: {
    type: string;
    [key: string]: any;
  };
  return_images?: boolean;
  return_related_questions?: boolean;
  search_domain_filter?: string[];
  search_recency_filter?: 'month' | 'week' | 'day' | 'hour';
  search_after_date_filter?: string; // MM/DD/YYYY format
  search_before_date_filter?: string; // MM/DD/YYYY format
  stream?: boolean;
  temperature?: number;
  top_k?: number;
  top_p?: number;
  web_search_options?: {
    search_context_size?: 'low' | 'medium' | 'high';
  };
}

interface PerplexityResponse {
  id: string;
  model: string;
  object: string;
  created: number;
  citations: string[];
  choices: {
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
    delta?: {
      role?: string;
      content?: string;
    };
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface JsonSchemaFormat {
  type: "json_schema";
  json_schema: {
    schema: {
      type: "object";
      properties: {
        isFactual: { type: "boolean" };
        confidence: { type: "number"; minimum: 0; maximum: 100 };
        explanation: { type: "string" };
        sources: { type: "array"; items: { type: "string" }; minItems: 1 };
        thinking: { type: "string"; optional: true };
      };
      required: ["isFactual", "confidence", "explanation", "sources"];
    };
  };
}

interface FactCheckOptions {
  model?: PerplexityModel;
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
  returnImages?: boolean;
  returnRelatedQuestions?: boolean;
  searchContextSize?: 'low' | 'medium' | 'high';
}

interface FactCheckResult {
  isFactual: boolean;
  confidence: number;
  explanation: string;
  sources: string[];
  thinking?: string;
  citations?: string[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface StreamHandler {
  onThinking?: (thinking: string) => void;
  onResult?: (result: FactCheckResult) => void;
  onError?: (error: Error) => void;
}

// Add logging utility
const log = {
  info: (...args: any[]) => console.log('\x1b[36m%s\x1b[0m', '[Perplexity API]', ...args),
  error: (...args: any[]) => console.error('\x1b[31m%s\x1b[0m', '[Perplexity API Error]', ...args),
  debug: (...args: any[]) => console.debug('\x1b[35m%s\x1b[0m', '[Perplexity API Debug]', ...args)
};

// Helper Functions
const createSystemPrompt = (): string => `You are a fact-checking AI assistant.

Rules:
1. Analyze statements for factual accuracy using real-time search
2. Provide responses in a clear, objective format
3. Include confidence levels based on the reliability of sources
4. Always cite sources to support your analysis
5. Be precise and concise in your explanations`;

const createPerplexityRequest = (
  statement: string,
  options: FactCheckOptions,
  stream: boolean
): PerplexityRequestOptions => {
  const model = options.model || CONFIG.DEFAULT_MODEL;
  const modelConfig = CONFIG.MODELS[model];

  log.info(`Creating request for model: ${model}, stream: ${stream}`);
  log.debug('Request options:', options);

  return {
    model,
    messages: [
      {
        role: 'system',
        content: `You are a fact-checking AI assistant. Analyze the given statement and respond with a JSON object containing:
- isFactual: boolean indicating if the statement is factually accurate
- confidence: number from 0-100 indicating confidence level
- explanation: string explaining the analysis in the same language as the input statement, using [n] citation references
- sources: array of strings with citation URLs from diverse sources (at least 5)
- thinking: string showing your analysis process with [n] citation references

Guidelines:
1. Search globally in multiple languages to find authoritative sources
2. Include sources from scientific organizations, educational institutions, and reputable media
3. Use numbered citations [1], [2], etc. in both explanation and thinking to reference sources
4. For non-English statements, include both local language and English sources
5. Prioritize primary sources and official records when available

Respond ONLY with the JSON object, no markdown or other formatting.`
      },
      { role: 'user', content: statement }
    ],
    temperature: options.temperature ?? CONFIG.DEFAULT_TEMPERATURE,
    max_tokens: options.maxTokens ?? modelConfig.maxTokens,
    top_p: options.topP ?? CONFIG.DEFAULT_TOP_P,
    top_k: options.topK ?? CONFIG.DEFAULT_TOP_K,
    frequency_penalty: options.frequencyPenalty ?? CONFIG.DEFAULT_FREQUENCY_PENALTY,
    presence_penalty: options.presencePenalty ?? CONFIG.DEFAULT_PRESENCE_PENALTY,
    stream,
    search_domain_filter: options.searchDomains,
    search_recency_filter: options.searchRecency,
    search_after_date_filter: options.searchAfterDate,
    search_before_date_filter: options.searchBeforeDate,
    return_images: options.returnImages ?? false,
    return_related_questions: options.returnRelatedQuestions ?? false,
    web_search_options: options.searchContextSize ? {
      search_context_size: options.searchContextSize
    } : undefined
  };
};

// Main Function
export async function checkFactWithPerplexity(
  statement: string,
  options: FactCheckOptions = {},
  streamHandler?: StreamHandler
): Promise<FactCheckResult> {
  log.info(`Starting fact check for statement: "${statement.slice(0, 100)}${statement.length > 100 ? '...' : ''}"`);
  log.debug('Options:', options);

  if (!process.env.PERPLEXITY_API_KEY) {
    log.error('API key not configured');
    throw new Error('Perplexity API key is not configured');
  }

  const headers = {
    'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
    'Content-Type': 'application/json'
  };

  try {
    return streamHandler
      ? await handleStreamingRequest(statement, options, headers, streamHandler)
      : await handleNormalRequest(statement, options, headers);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      log.error('API Request Failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: JSON.parse(error.config?.data || '{}'),
          headers: error.config?.headers
        }
      });

      // Throw more descriptive error
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please check your API key.');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.response?.data?.error) {
        throw new Error(`Perplexity API error: ${error.response.data.error}`);
      }
    }

    const enhancedError = new Error(
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
    streamHandler?.onError?.(enhancedError);
    throw enhancedError;
  }
}

// Request Handlers
async function handleNormalRequest(
  statement: string,
  options: FactCheckOptions,
  headers: Record<string, string>
): Promise<FactCheckResult> {
  log.info('Making normal (non-streaming) request');

  const response = await axios.post(
    CONFIG.API_URL,
    createPerplexityRequest(statement, options, false),
    { headers }
  );

  log.debug('Received response:', {
    status: response.status,
    headers: response.headers,
    data: response.data
  });

  const content = response.data.choices[0]?.message?.content;
  if (!content) {
    log.error('No content in response:', response.data);
    throw new Error('No content in response');
  }

  try {
    // Sanitize the content by removing control characters
    const sanitizedContent = content.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
    log.debug('Attempting to parse sanitized content:', sanitizedContent);
    const result = JSON.parse(sanitizedContent);
    
    // Ensure thinking process is included
    if (!result.thinking && result.explanation) {
      result.thinking = `Analysis process:\n1. Evaluated the statement: "${statement}"\n2. Searched and analyzed multiple sources\n3. Found that ${result.isFactual ? 'the statement is factual' : 'the statement is not factual'}\n4. Confidence level: ${result.confidence}%\n5. Key findings: ${result.explanation}`;
    }
    return {
      ...result,
      citations: response.data.citations || [],
      usage: response.data.usage || {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      }
    };
  } catch (error) {
    log.debug('Direct parsing failed, attempting to extract JSON from markdown');
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      log.error('Failed to parse response:', content);
      throw new Error('Invalid response format from Perplexity API');
    }

    try {
      const jsonContent = jsonMatch[1] || jsonMatch[0];
      // Sanitize the extracted JSON content
      const sanitizedJsonContent = jsonContent.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
      log.debug('Extracted and sanitized JSON content:', sanitizedJsonContent);
      const result = JSON.parse(sanitizedJsonContent);
      
      // Ensure thinking process is included
      if (!result.thinking && result.explanation) {
        result.thinking = `Analysis process:\n1. Evaluated the statement: "${statement}"\n2. Searched and analyzed multiple sources\n3. Found that ${result.isFactual ? 'the statement is factual' : 'the statement is not factual'}\n4. Confidence level: ${result.confidence}%\n5. Key findings: ${result.explanation}`;
      }
      return {
        isFactual: result.isFactual ?? false,
        confidence: result.confidence ?? 0,
        explanation: result.explanation ?? 'No explanation provided',
        sources: result.sources ?? [],
        thinking: result.thinking,
        citations: response.data.citations || [],
        usage: response.data.usage || {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      };
    } catch (parseError) {
      log.error('Error parsing extracted JSON:', parseError);
      throw new Error('Failed to parse fact-checking result');
    }
  }
}

async function handleStreamingRequest(
  statement: string,
  options: FactCheckOptions,
  headers: Record<string, string>,
  streamHandler: StreamHandler
): Promise<FactCheckResult> {
  log.info('Making streaming request');

  const response = await axios.post<NodeJS.ReadableStream>(
    CONFIG.API_URL,
    createPerplexityRequest(statement, options, true),
    {
      headers: { ...headers, 'Accept': 'text/event-stream' },
      responseType: 'stream'
    }
  );

  log.debug('Stream response received, setting up handlers');

  return new Promise<FactCheckResult>((resolve, reject) => {
    let buffer = '';
    let thinking = '';
    let result: FactCheckResult | null = null;
    let isCollectingJson = false;
    let jsonBuffer = '';

    const tryParseJson = (text: string): FactCheckResult | null => {
      try {
        const parsed = JSON.parse(text);
        return {
          isFactual: parsed.isFactual ?? false,
          confidence: parsed.confidence ?? 0,
          explanation: parsed.explanation ?? 'No explanation provided',
          sources: parsed.sources ?? [],
          thinking: parsed.thinking
        };
      } catch {
        return null;
      }
    };

    const handleStreamData = (chunk: Buffer) => {
      const lines = chunk.toString().split('\n');

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;

        const data = line.slice(6);
        if (data === '[DONE]') {
          log.info('Stream completed');
          if (result) {
            resolve(result);
          } else if (jsonBuffer) {
            const finalResult = tryParseJson(jsonBuffer);
            if (finalResult) {
              resolve(finalResult);
            } else {
              reject(new Error('Failed to parse final result'));
            }
          } else {
            reject(new Error('Stream ended without valid result'));
          }
          return;
        }

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices[0]?.delta?.content || '';
          buffer += content;

          // Check for JSON start/end markers
          if (buffer.includes('{') && !isCollectingJson) {
            isCollectingJson = true;
            jsonBuffer = buffer.slice(buffer.indexOf('{'));
            // If there's content before the JSON, treat it as thinking
            const thinkingContent = buffer.slice(0, buffer.indexOf('{'));
            if (thinkingContent.trim()) {
              thinking += thinkingContent;
              streamHandler.onThinking?.(thinking);
            }
          } else if (isCollectingJson) {
            jsonBuffer += content;
          } else if (buffer.trim()) {
            thinking += buffer;
            streamHandler.onThinking?.(thinking);
            buffer = '';
          }

          // Try to parse complete JSON objects
          if (isCollectingJson && jsonBuffer.includes('}')) {
            const possibleJson = jsonBuffer.slice(0, jsonBuffer.lastIndexOf('}') + 1);
            const parsedResult = tryParseJson(possibleJson);
            if (parsedResult) {
              result = parsedResult;
              isCollectingJson = false;
              jsonBuffer = '';
              buffer = '';
              log.debug('Successfully parsed JSON from stream');
            }
          }
        } catch (error) {
          log.debug('Error processing stream chunk, continuing collection');
        }
      }
    };

    response.data
      .on('data', handleStreamData)
      .on('end', () => {
        log.info('Stream ended');
        if (result) {
          resolve(result);
        } else if (jsonBuffer) {
          const finalResult = tryParseJson(jsonBuffer);
          if (finalResult) {
            resolve(finalResult);
          } else {
            reject(new Error('Failed to parse final result'));
          }
        } else {
          log.error('Stream ended without valid result');
          reject(new Error('Stream ended without valid result'));
        }
      })
      .on('error', (error) => {
        log.error('Stream error:', error);
        reject(error);
      });
  });
}

// Health check function
export async function checkPerplexityApiHealth(): Promise<boolean> {
  if (!process.env.PERPLEXITY_API_KEY) {
    throw new Error('Perplexity API key is not configured');
  }

  try {
    const response = await axios.post(
      CONFIG.API_URL,
      {
        model: CONFIG.DEFAULT_MODEL,
        messages: [
          { role: 'user', content: 'test' }
        ],
        max_tokens: 10
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Perplexity API Health Check Error:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message
      });
    }
    return false;
  }
}