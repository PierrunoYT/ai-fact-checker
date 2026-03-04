# AI Fact Checker

A powerful fact-checking application that verifies statements using Perplexity AI's advanced language models and real-time web search capabilities. Features multiple search providers, session management, and a modern React-based interface.

## ✨ Features

### 🔍 Real-time Fact Checking
- Instant verification using web search
- Confidence scores with detailed analysis
- Source citations with clickable links
- Transparent thinking process
- Streaming support for real-time updates

### 🤖 Multiple AI Models
- `sonar`: Fast checks (127k context, 4k max tokens)
- `sonar-pro`: Enhanced capabilities (200k context, 8k max tokens)
- `sonar-reasoning`: Detailed analysis with citations (127k context, 4k max tokens)
- `sonar-reasoning-pro`: Premium model with extensive reasoning (127k context, 8k max tokens)

### 🌐 Multiple Search Providers
- **Exa AI**: Neural search with content extraction, summaries, and highlights
- **Linkup**: Deep web search with sourced answers and inline citations
- **Parallel AI**: Parallel search with custom query optimization
- **Tavily**: Fast search with answer generation and topic filtering
- **Valyu**: Multi-source search across web, news, and 36+ proprietary datasets (PubMed, arXiv, SEC filings, patents, and more)

### 🔧 Advanced Search Options
- Domain filtering to include/exclude specific websites
- Date range filtering for time-specific research
- Adjustable search context size (low/medium/high)
- Recency filters (month/week/day/hour)
- Category filtering (for Exa: company, research paper, news, PDF, GitHub, etc.)
- Search depth control (basic/advanced for Tavily, standard/deep for Linkup)

### 💾 Session Management
- Automatic session history with SQLite database
- Save and retrieve fact-check results
- Search history tracking
- Session-based result storage

### 💻 Modern Interface
- Clean, responsive design with split-panel layout
- Dark/Light mode support with system preference detection
- Real-time updates and loading states
- Usage statistics tracking
- Error boundaries for graceful error handling
- Tabbed interface for fact-checking and web search

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm v8+
- **Required**: Perplexity AI API key (for fact-checking)
- **Optional**: Exa AI API key (for Exa web search)
- **Optional**: Linkup API key (for Linkup web search)
- **Optional**: Parallel AI API key (for Parallel web search)
- **Optional**: Tavily API key (for Tavily web search)
- **Optional**: Valyu API key (for Valyu web search)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/PierrunoYT/truth-check.git
   cd truth-check
   ```

2. **Install Dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure Environment**
   ```bash
   # Backend (.env)
   cd backend
   cp env.template .env
   # Edit .env and add your API keys:
   # - PERPLEXITY_API_KEY (required for fact-checking)
   # - EXA_API_KEY (optional, for Exa web search)
   # - LINKUP_API_KEY (optional, for Linkup web search)
   # - PARALLEL_API_KEY (optional, for Parallel web search)
   # - TAVILY_API_KEY (optional, for Tavily web search)
   # - VALYU_API_KEY (optional, for Valyu web search)

   # Frontend (.env)
   cd ../frontend
   cp env.template .env
   # Edit .env and configure:
   # - VITE_API_URL=http://localhost:3000/api
   ```

4. **Start Development Servers**
   ```bash
   # Start both frontend and backend servers
   npm run dev
   ```

   The servers will start at:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## 📖 Usage

### Fact Checking
1. **Select Model**
   - `sonar/sonar-pro`: Quick fact checks
   - `sonar-reasoning/pro`: Detailed analysis with reasoning

2. **Enter Statement**
   - Type or paste any statement
   - Configure advanced options (domains, dates, context size)
   - Click "Check Fact" or press Enter

3. **Review Results**
   - Factual assessment (true/false)
   - Confidence score (0-1)
   - Detailed explanation
   - Source citations with clickable links
   - Thinking process (for reasoning models)
   - Usage statistics

### Web Search
1. **Select Search Provider**
   - Choose from Exa, Linkup, Parallel, or Tavily
   - Each provider has unique features and capabilities

2. **Enter Search Query**
   - Type your search query
   - Configure provider-specific options
   - Submit search

3. **Review Results**
   - Search results with titles, URLs, snippets
   - Full text content (when available)
   - AI-generated summaries and highlights
   - Relevance scores
   - Source citations

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Tab-based navigation** with React state (no URL routing)
- **Axios** for API communication with retry logic
- **Custom Hooks** for state management and API calls

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Better-SQLite3** for session and result storage
- **Axios** for external API calls
- **CORS** enabled for cross-origin requests
- **Request logging** and error handling middleware

### APIs & Services
- **Perplexity AI** - Fact-checking and reasoning
- **Exa AI** - Neural web search with content extraction
- **Linkup** - Deep web search with sourced answers
- **Parallel AI** - Parallel search optimization
- **Tavily** - Fast search with answer generation
- **Valyu** - Multi-source search across web, news, and proprietary datasets

## 📡 API Endpoints

### Check Fact
```http
POST /api/check-fact
Content-Type: application/json

{
  "statement": string,
  "model": "sonar" | "sonar-pro" | "sonar-reasoning" | "sonar-reasoning-pro",
  "maxTokens": number,
  "temperature": number,
  "frequencyPenalty": number,
  "presencePenalty": number,
  "topK": number,
  "topP": number,
  "searchDomains": string[],
  "searchRecency": "month" | "week" | "day" | "hour",
  "searchAfterDate": string, // MM/DD/YYYY format
  "searchBeforeDate": string, // MM/DD/YYYY format
  "searchContextSize": "low" | "medium" | "high",
  "returnImages": boolean,
  "returnRelatedQuestions": boolean,
  "stream": boolean // Set to true to enable SSE streaming
}
```

### Exa Web Search
```http
POST /api/exa-search
Content-Type: application/json

{
  "query": string,
  "type": "auto" | "neural" | "fast" | "deep" | "deep-reasoning" | "deep-max" | "instant",
  "numResults": number, // 1-100, default: 10
  "includeDomains": string[],
  "excludeDomains": string[],
  "startPublishedDate": string, // ISO 8601 or MM/DD/YYYY format
  "endPublishedDate": string, // ISO 8601 or MM/DD/YYYY format
  "category": "company" | "research paper" | "news" | "tweet" | "personal site" | "financial report" | "people",
  "userLocation": string, // ISO country code (e.g., "US")
  "getText": boolean,
  "getSummary": boolean,
  "getHighlights": boolean,
  "getContext": boolean,
  "contextMaxCharacters": number
}
```

### Linkup Web Search
```http
POST /api/linkup-search
Content-Type: application/json

{
  "query": string,
  "depth": "standard" | "deep", // default: "standard"
  "outputType": "sourcedAnswer" | "raw", // default: "sourcedAnswer"
  "structuredOutputSchema": object, // optional JSON schema for structured output
  "includeImages": boolean, // default: false
  "fromDate": string, // YYYY-MM-DD or MM/DD/YYYY format
  "toDate": string, // YYYY-MM-DD or MM/DD/YYYY format
  "excludeDomains": string[],
  "includeDomains": string[],
  "includeInlineCitations": boolean, // default: false
  "includeSources": boolean // default: true
}
```

**Response:**
```json
{
  "success": true,
  "query": "search query",
  "results": [...],
  "answer": "AI-generated answer",
  "sources": [
    {
      "name": "Source Name",
      "url": "https://example.com",
      "snippet": "Relevant excerpt"
    }
  ],
  "totalResults": 10
}
```

### Parallel Web Search
```http
POST /api/parallel-search
Content-Type: application/json

{
  "objective": string,
  "searchQueries": string[], // optional, auto-generated if not provided
  "maxResults": number, // default: 10
  "maxCharsPerResult": number // default: 10000
}
```

**Response:**
```json
{
  "success": true,
  "query": "objective",
  "results": [...],
  "searchId": "unique-search-id",
  "totalResults": 10
}
```

### Tavily Web Search
```http
POST /api/tavily-search
Content-Type: application/json

{
  "query": string,
  "searchDepth": "basic" | "advanced", // default: "basic"
  "maxResults": number, // default: 10
  "includeDomains": string[],
  "excludeDomains": string[],
  "includeAnswer": boolean, // default: false
  "includeImages": boolean, // default: false
  "includeRawContent": boolean, // default: false
  "topic": "general" | "news" // default: "general"
}
```

**Response:**
```json
{
  "success": true,
  "query": "search query",
  "results": [...],
  "answer": "AI-generated answer",
  "responseTime": 0.5,
  "totalResults": 10
}
```

### Valyu Web Search
```http
POST /api/valyu-search
Content-Type: application/json

{
  "query": string,
  "searchType": "web" | "proprietary" | "news" | "all", // default: "all"
  "maxNumResults": number, // 1-20, default: 10
  "maxPrice": number, // optional max cost in dollars per query
  "relevanceThreshold": number, // 0.0-1.0, default: 0.5
  "includedSources": string[], // e.g. ["pubmed", "arxiv"]
  "excludedSources": string[],
  "startDate": string, // YYYY-MM-DD format
  "endDate": string, // YYYY-MM-DD format
  "countryCode": string, // ISO 2-letter code, e.g. "US"
  "responseLength": "short" | "medium" | "large" | "max", // default: "short"
  "fastMode": boolean // default: false
}
```

**Response:**
```json
{
  "success": true,
  "query": "search query",
  "results": [...],
  "txId": "transaction-id",
  "totalDeductionDollars": 0.001,
  "totalCharacters": 12500,
  "totalResults": 10
}
```

### Sessions Management
```http
# Get all sessions
GET /api/sessions?type=fact-check&limit=50&offset=0

# Get session by ID with results
GET /api/sessions/:id

# Delete session
DELETE /api/sessions/:id
```

### Health Check
```http
GET /health
```

**Response:**
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
    },
    "linkup": {
      "configured": true,
      "connected": true
    },
    "parallel": {
      "configured": true,
      "connected": true
    },
    "tavily": {
      "configured": true,
      "connected": true
    },
    "valyu": {
      "configured": true,
      "connected": true
    }
  },
  "models": ["sonar", "sonar-pro", "sonar-reasoning", "sonar-reasoning-pro"]
}
```

## 🔧 Development

### Project Structure
```
ai-fact-checker/
├── 📁 backend/                      # Express.js API server
│   ├── 📁 src/
│   │   ├── 📁 config/               # Configuration constants
│   │   │   └── constants.ts        # API URLs, models, defaults
│   │   ├── 📁 services/             # Business logic services
│   │   │   ├── database.ts         # SQLite database operations
│   │   │   ├── perplexityApi.ts    # Perplexity AI integration
│   │   │   ├── exaApi.ts           # Exa AI search integration
│   │   │   ├── linkupApi.ts        # Linkup search integration
│   │   │   ├── parallelApi.ts      # Parallel AI search integration
│   │   │   ├── tavilyApi.ts        # Tavily search integration
│   │   │   └── valyuApi.ts         # Valyu search integration
│   │   ├── 📁 utils/               # Utility functions
│   │   │   ├── logger.ts          # Request/error logging
│   │   │   ├── validation.ts      # Input validation
│   │   │   └── __tests__/         # Test files
│   │   └── 📄 server.ts            # Main Express server
│   ├── 📁 data/                    # SQLite database files
│   ├── 📄 env.template             # Environment template
│   ├── 📄 package.json
│   └── 📄 tsconfig.json
├── 📁 frontend/                    # React + TypeScript frontend
│   ├── 📁 src/
│   │   ├── 📁 api/                 # API client modules
│   │   │   ├── apiClient.ts       # Base API client with retry
│   │   │   ├── perplexityApi.ts   # Fact-check API
│   │   │   ├── exaApi.ts          # Exa search API
│   │   │   ├── linkupApi.ts       # Linkup search API
│   │   │   ├── parallelApi.ts     # Parallel search API
│   │   │   ├── tavilyApi.ts       # Tavily search API
│   │   │   ├── valyuApi.ts        # Valyu search API
│   │   │   └── sessionsApi.ts     # Session management API
│   │   ├── 📁 components/          # React components
│   │   │   ├── FactChecker.tsx    # Main application component
│   │   │   ├── 📁 fact-checker/   # Fact-check specific components
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── FactCheckForm.tsx
│   │   │   │   ├── FactCheckResults.tsx
│   │   │   │   ├── ExaSearchForm.tsx
│   │   │   │   ├── ExaSearchResults.tsx
│   │   │   │   └── ... (other search forms/results)
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── SessionsHistory.tsx
│   │   ├── 📁 hooks/               # Custom React hooks
│   │   │   ├── useFactCheck.ts
│   │   │   ├── useFormState.ts
│   │   │   └── useTheme.ts
│   │   ├── 📁 types/               # TypeScript definitions
│   │   │   └── index.ts            # All type definitions
│   │   ├── 📁 utils/               # Frontend utilities
│   │   │   └── validation.ts       # Client-side validation
│   │   ├── 📄 App.tsx              # Root component
│   │   └── 📄 main.tsx             # Entry point
│   ├── 📄 env.template             # Environment template
│   ├── 📄 package.json
│   ├── 📄 vite.config.ts
│   └── 📄 tailwind.config.js
├── 📄 start-dev.js                 # Development launcher script
├── 📄 DEVELOPMENT.md               # Development guide
├── 📄 CODE_ISSUES_REPORT.md        # Code quality report
├── 📄 EXA_INTEGRATION.md           # Exa API documentation
├── 📄 LINKUP_INTEGRATION.md         # Linkup API documentation
└── 📄 package.json                 # Root configuration
```

### Available Scripts

```bash
# Root (from project root)
npm run dev              # Start both frontend and backend servers concurrently
npm run install-all      # Install dependencies for both frontend and backend

# Frontend only
cd frontend
npm run dev              # Start Vite dev server (port 5173)
npm run build            # Type-check and build for production
npm run preview          # Preview production build
npm run test             # Run tests with Vitest
npm run test:coverage    # Run tests with coverage report
npm run lint             # Lint TypeScript/TSX files
npm run format           # Format source files with Prettier

# Backend only
cd backend
npm run dev              # Start backend with ts-node-dev (hot reload)
npm run build            # Compile TypeScript to dist/
npm start                # Start compiled production server
npm run test             # Run tests with Jest
npm run test:coverage    # Run tests with coverage report
npm run lint             # Lint TypeScript files
npm run format           # Format source files with Prettier
```

### Code Quality
- ✅ **TypeScript**: Strict type checking enabled
- ✅ **ESLint**: Code linting with custom rules
- ✅ **Prettier**: Consistent code formatting
- ✅ **Testing**: Comprehensive test coverage
- ✅ **Error Boundaries**: Graceful error handling
- ✅ **Input Validation**: Client and server-side validation

## ❗ Troubleshooting

1. **API Key Error**
   ```bash
   # Check API keys are set in backend/.env
   PERPLEXITY_API_KEY=your_api_key_here  # Required
   EXA_API_KEY=your_exa_api_key_here      # Optional
   LINKUP_API_KEY=your_linkup_api_key_here # Optional
   PARALLEL_API_KEY=your_parallel_api_key_here # Optional
   TAVILY_API_KEY=your_tavily_api_key_here # Optional
   VALYU_API_KEY=your_valyu_api_key_here   # Optional
   ```

2. **Port Conflicts**
   - Frontend uses port 5173
   - Backend uses port 3000
   - Make sure these ports are available

3. **Node Version**
   ```bash
   # Ensure Node.js v18+
   node --version
   ```

## 📄 License

MIT License - see [LICENSE](LICENSE)

## 👤 Author

**PierrunoYT**
- 💻 [@PierrunoYT](https://github.com/PierrunoYT)

## 📚 Additional Documentation

- [Development Guide](DEVELOPMENT.md) - Detailed development setup and guidelines
- [Exa Integration](EXA_INTEGRATION.md) - Exa AI API integration details
- [Linkup Integration](LINKUP_INTEGRATION.md) - Linkup API integration details

## 🙏 Acknowledgments

- [Perplexity AI](https://www.perplexity.ai/) - Fact-checking and reasoning models
- [Exa AI](https://exa.ai/) - Neural web search
- [Linkup](https://linkup.so/) - Deep web search
- [Parallel AI](https://parallel.ai/) - Parallel search optimization
- [Tavily](https://tavily.com/) - Fast search with answer generation
- [Valyu](https://valyu.ai/) - Multi-source AI search
- [React](https://reactjs.org/) - UI framework
- [Express](https://expressjs.com/) - Backend framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Vite](https://vitejs.dev/) - Build tool
- [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3) - Database
