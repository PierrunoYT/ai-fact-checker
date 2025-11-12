# Exa Web Search API Integration

This document describes the Exa AI Web Search API integration that has been added to the AI Fact Checker project.

## Overview

The Exa Web Search API has been integrated to provide enhanced web search capabilities alongside the existing Perplexity AI fact-checking functionality. This allows you to:

1. Perform raw web searches to gather sources
2. Retrieve full text content from web pages
3. Get AI-generated summaries and highlights
4. Filter results by domain, date, category, and more

## Implementation Details

### Backend Implementation

#### Files Created/Modified:

1. **`backend/src/services/exaApi.ts`** (NEW)
   - Main Exa API service
   - Handles search requests with full parameter support
   - Converts date formats (MM/DD/YYYY to ISO 8601)
   - Transforms Exa results to our FactCheckSearchResult format
   - Includes health check functionality

2. **`backend/src/config/constants.ts`** (MODIFIED)
   - Added `EXA_API_URL: 'https://api.exa.ai/search'`

3. **`backend/src/server.ts`** (MODIFIED)
   - Added `/api/exa-search` POST endpoint
   - Updated `/health` endpoint to include Exa API status
   - Added validation for Exa search requests

4. **`backend/.env.example`** (NEW)
   - Added `EXA_API_KEY` environment variable

### Frontend Implementation

#### Files Created/Modified:

1. **`frontend/src/api/exaApi.ts`** (NEW)
   - Frontend API client for Exa search
   - Uses the shared `apiClient` with retry logic

2. **`frontend/src/types/index.ts`** (MODIFIED)
   - Added Exa search types:
     - `ExaSearchType`
     - `ExaCategory`
     - `ExaSearchRequest`
     - `ExaSearchResult`
     - `ExaSearchResponse`

## API Endpoint

### POST `/api/exa-search`

Performs a web search using Exa AI.

**Request Body:**
```typescript
{
  query: string;                    // Required: Search query
  type?: 'neural' | 'keyword' | 'auto' | 'fast';  // Search type
  numResults?: number;              // 1-100, default: 10
  includeDomains?: string[];        // Filter to specific domains
  excludeDomains?: string[];        // Exclude specific domains
  startPublishedDate?: string;      // ISO 8601 or MM/DD/YYYY
  endPublishedDate?: string;        // ISO 8601 or MM/DD/YYYY
  category?: string;               // Content category filter
  userLocation?: string;            // ISO country code (e.g., "US")
  getText?: boolean;                // Get full text content
  getSummary?: boolean;             // Get AI summary
  getHighlights?: boolean;          // Get relevant highlights
  getContext?: boolean;             // Get context string for LLM
  contextMaxCharacters?: number;     // Max chars for context
}
```

**Response:**
```typescript
{
  success: boolean;
  query: string;
  results: ExaSearchResult[];
  searchType: string;
  costDollars?: number;
  requestId?: string;
  totalResults: number;
}
```

## Usage Examples

### Basic Search
```typescript
import { exaApi } from './api/exaApi';

const result = await exaApi.search('latest AI developments 2024');
console.log(result.results);
```

### Search with Filters
```typescript
const result = await exaApi.search('quantum computing', {
  type: 'neural',
  numResults: 20,
  includeDomains: ['arxiv.org', 'nature.com'],
  startPublishedDate: '01/01/2024',
  endPublishedDate: '12/31/2024',
  getText: true,
  getHighlights: true
});
```

### Search with Category
```typescript
const result = await exaApi.search('machine learning algorithms', {
  category: 'research paper',
  getSummary: true
});
```

## Environment Setup

Add your Exa API key to `backend/.env`:

```env
EXA_API_KEY=your_exa_api_key_here
```

Get your API key from: https://dashboard.exa.ai/api-keys

## Features

### Search Types
- **neural**: Embeddings-based search (up to 100 results)
- **keyword**: Google-like SERP (up to 10 results)
- **auto**: Intelligently combines both (default)
- **fast**: Streamlined versions

### Content Retrieval Options
- **Text**: Full page text in markdown format
- **Summary**: AI-generated summary using Gemini Flash
- **Highlights**: Relevant excerpts from the content
- **Context**: Combined string optimized for LLM/RAG applications

### Filtering Options
- Domain inclusion/exclusion
- Date range filtering (published date or crawl date)
- Category filtering (company, research paper, news, pdf, etc.)
- Geographic location filtering
- Text content filtering

## Integration with Fact-Checking

You can use Exa search results to enhance fact-checking:

1. **Gather Sources**: Use Exa to find authoritative sources
2. **Extract Content**: Get full text for deeper analysis
3. **Feed to LLM**: Use context strings with Perplexity or other LLMs
4. **Combine Results**: Merge Exa sources with Perplexity analysis

## Error Handling

The implementation includes comprehensive error handling:
- API key validation
- Request validation
- Network error handling
- Rate limit handling
- Timeout handling

## Health Check

The `/health` endpoint now includes Exa API status:

```json
{
  "status": "ok",
  "apis": {
    "perplexity": {
      "configured": true,
      "connected": true
    },
    "exa": {
      "configured": true,
      "connected": true
    }
  }
}
```

## Next Steps

To use Exa search in your frontend:

1. Import the API client:
   ```typescript
   import { exaApi } from './api/exaApi';
   ```

2. Call the search function:
   ```typescript
   const results = await exaApi.search('your query');
   ```

3. Display results in your UI

## Documentation

- Exa API Docs: https://docs.exa.ai/reference/search
- Get API Key: https://dashboard.exa.ai/api-keys

