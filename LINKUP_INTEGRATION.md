# Linkup API Integration

This document describes the Linkup API integration in the AI Fact Checker application.

## Overview

Linkup is a web search engine for AI apps that provides grounding data to enrich AI output and increase precision, accuracy, and factuality. Linkup is #1 in the world for factuality, scoring state-of-the-art results on OpenAI's SimpleQA benchmark.

## Features

- **Web Search**: Perform web searches with advanced filtering options
- **Sourced Answers**: Get answers with source citations
- **Domain Filtering**: Include or exclude specific domains
- **Date Range Filtering**: Filter results by publication date
- **Deep Search**: Standard or deep search depth options

## Setup

1. **Get API Key**: 
   - Visit [Linkup Documentation](https://docs.linkup.so/pages/documentation/get-started/introduction)
   - Create a free account (no credit card required)
   - Get your API key

2. **Configure Environment**:
   ```bash
   cd backend
   cp env.template .env
   # Edit .env and add:
   LINKUP_API_KEY=your_linkup_api_key_here
   ```

## API Endpoints

### POST /api/linkup-search

Perform a web search using Linkup API.

**Request Body:**
```json
{
  "query": "What is Microsoft's 2024 revenue?",
  "depth": "standard",
  "outputType": "sourcedAnswer",
  "includeImages": false,
  "fromDate": "2024-01-01",
  "toDate": "2024-12-31",
  "excludeDomains": ["wikipedia.com"],
  "includeDomains": ["microsoft.com"],
  "includeInlineCitations": false,
  "includeSources": true
}
```

**Response:**
```json
{
  "success": true,
  "query": "What is Microsoft's 2024 revenue?",
  "results": [
    {
      "title": "Microsoft 2024 Annual Report",
      "url": "https://www.microsoft.com/investor/reports/ar24/index.html",
      "snippet": "Highlights from fiscal year 2024..."
    }
  ],
  "answer": "Microsoft's revenue for fiscal year 2024 was $245.1 billion...",
  "sources": [
    {
      "name": "Microsoft 2024 Annual Report",
      "url": "https://www.microsoft.com/investor/reports/ar24/index.html",
      "snippet": "Highlights from fiscal year 2024..."
    }
  ],
  "totalResults": 10
}
```

## Request Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `query` | string | Search query (required) | - |
| `depth` | 'standard' \| 'deep' | Search depth | 'standard' |
| `outputType` | 'sourcedAnswer' \| 'raw' | Output format | 'sourcedAnswer' |
| `includeImages` | boolean | Include images in results | false |
| `fromDate` | string | Start date (YYYY-MM-DD or MM/DD/YYYY) | - |
| `toDate` | string | End date (YYYY-MM-DD or MM/DD/YYYY) | - |
| `excludeDomains` | string[] | Domains to exclude | - |
| `includeDomains` | string[] | Domains to include | - |
| `includeInlineCitations` | boolean | Include inline citations | false |
| `includeSources` | boolean | Include source list | true |

## Usage Examples

### Frontend (TypeScript)

```typescript
import { linkupApi } from './api/linkupApi';

// Basic search
const result = await linkupApi.search('What is AI?');

// Advanced search with options
const result = await linkupApi.search('Microsoft revenue 2024', {
  depth: 'deep',
  outputType: 'sourcedAnswer',
  fromDate: '2024-01-01',
  toDate: '2024-12-31',
  includeDomains: ['microsoft.com'],
  excludeDomains: ['wikipedia.com']
});
```

### Backend (TypeScript)

```typescript
import { searchWithLinkup } from './services/linkupApi';

const result = await searchWithLinkup('What is AI?', {
  depth: 'standard',
  outputType: 'sourcedAnswer',
  includeSources: true
});
```

## Health Check

The health check endpoint (`GET /health`) includes Linkup API status:

```json
{
  "status": "ok",
  "apis": {
    "linkup": {
      "configured": true,
      "connected": true
    }
  }
}
```

## Error Handling

The integration handles common errors:

- **401 Unauthorized**: Invalid or missing API key
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: General API errors

All errors are logged and return descriptive error messages to the client.

## Important Notes

1. **Precise Prompts**: The more precise and detailed your prompts, the better the results. Linkup recommends using their [Prompt Optimizer](https://docs.linkup.so/pages/documentation/get-started/prompting).

2. **Free Tier**: Linkup offers a free tier with no credit card required.

3. **Rate Limits**: Be aware of rate limits. Check the [Rate Limits documentation](https://docs.linkup.so/pages/documentation/development/rate-limits) for details.

4. **Date Formats**: The API accepts both `YYYY-MM-DD` and `MM/DD/YYYY` formats. The service automatically converts between formats as needed.

## Documentation

For more information, visit:
- [Linkup API Documentation](https://docs.linkup.so/)
- [Quickstart Guide](https://docs.linkup.so/pages/documentation/get-started/quickstart)
- [API Reference](https://docs.linkup.so/pages/documentation/api-reference/endpoint/post-search)

