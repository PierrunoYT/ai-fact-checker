# AI Fact Checker

A powerful fact-checking application that verifies statements using Perplexity AI's advanced language models and real-time web search capabilities.

## ✨ Features

- 🔍 **Real-time Fact Checking**
  - Instant verification using web search
  - Confidence scores with detailed analysis
  - Source citations with clickable links
  - Transparent thinking process

- 🤖 **Multiple AI Models**
  - `sonar`: Fast checks (127k context)
  - `sonar-pro`: Enhanced capabilities (200k context)
  - `sonar-reasoning`: Detailed analysis with citations
  - `sonar-reasoning-pro`: Premium model with extensive reasoning

- 🌐 **Advanced Search Options**
  - Domain filtering to include/exclude specific websites
  - Date range filtering for time-specific research
  - Adjustable search context size (low/medium/high)
  - Recency filters (month/week/day/hour)

- 💻 **Modern Interface**
  - Clean, responsive design
  - Dark/Light mode support
  - Real-time updates
  - Usage statistics tracking

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm v8+
- Perplexity AI API key (required)
- Exa AI API key (optional, for enhanced web search)

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
   # - EXA_API_KEY (optional, for web search functionality)

   # Frontend (.env)
   cd ../frontend
   cp env.template .env
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

1. **Select Model**
   - `sonar/sonar-pro`: Quick fact checks
   - `sonar-reasoning/pro`: Detailed analysis

2. **Enter Statement**
   - Type or paste any statement
   - Click "Check Fact" or press Enter

3. **Review Results**
   - Factual assessment
   - Confidence score
   - Detailed explanation
   - Source links
   - Analysis process

## 🛠 Tech Stack

- **Frontend**
  - React + TypeScript
  - Tailwind CSS
  - Vite

- **Backend**
  - Node.js + Express
  - TypeScript
  - Perplexity AI API
  - Exa AI API (for web search)

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
  "returnRelatedQuestions": boolean
}
```

### Exa Web Search
```http
POST /api/exa-search
Content-Type: application/json

{
  "query": string,
  "type": "neural" | "keyword" | "auto" | "fast",
  "numResults": number, // 1-100, default: 10
  "includeDomains": string[],
  "excludeDomains": string[],
  "startPublishedDate": string, // ISO 8601 or MM/DD/YYYY format
  "endPublishedDate": string, // ISO 8601 or MM/DD/YYYY format
  "category": "company" | "research paper" | "news" | "pdf" | "github" | "tweet" | "personal site" | "linkedin profile" | "financial report",
  "userLocation": string, // ISO country code (e.g., "US")
  "getText": boolean,
  "getSummary": boolean,
  "getHighlights": boolean,
  "getContext": boolean,
  "contextMaxCharacters": number
}
```

**Response:**
```json
{
  "success": true,
  "query": "search query",
  "results": [
    {
      "title": "Result title",
      "url": "https://example.com",
      "publishedDate": "2024-01-01T00:00:00.000Z",
      "author": "Author Name",
      "snippet": "Brief excerpt...",
      "text": "Full text content...",
      "summary": "AI-generated summary...",
      "highlights": ["Relevant excerpt 1", "Relevant excerpt 2"],
      "relevanceScore": 0.95
    }
  ],
  "searchType": "neural",
  "costDollars": 0.005,
  "requestId": "unique-request-id",
  "totalResults": 10
}
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
    }
  },
  "models": ["sonar", "sonar-pro", "sonar-reasoning", "sonar-reasoning-pro"]
}
```

## 🔧 Development

### Project Structure
```
ai-fact-checker/
├── 📁 backend/                 # Express.js API server
│   ├── 📁 src/
│   │   ├── 📁 config/         # Configuration constants
│   │   ├── 📁 services/       # Business logic services
│   │   ├── 📁 utils/          # Utility functions & validation
│   │   └── 📄 server.ts       # Main server file
│   ├── 📄 .env.example        # Environment template
│   └── 📄 package.json
├── 📁 frontend/               # React + TypeScript frontend
│   ├── 📁 src/
│   │   ├── 📁 api/           # API client with retry logic
│   │   ├── 📁 components/    # Reusable React components
│   │   ├── 📁 hooks/         # Custom React hooks
│   │   ├── 📁 types/         # TypeScript definitions
│   │   ├── 📁 utils/         # Frontend utilities
│   │   └── 📄 App.tsx        # Main application
│   ├── 📄 .env.example       # Environment template
│   └── 📄 package.json
├── 📄 start-dev.js           # Development launcher
├── 📄 DEVELOPMENT.md         # Development guide
├── 📄 CODE_ISSUES_REPORT.md  # Code quality report
└── 📄 package.json           # Root configuration
```

### Available Scripts
```bash
# Development
npm run dev              # Start both servers
npm run build           # Build for production
npm run test            # Run all tests
npm run lint            # Lint all code
npm run format          # Format all code

# Frontend only
cd frontend
npm run dev             # Start frontend dev server
npm run build           # Build frontend
npm run test            # Run frontend tests
npm run preview         # Preview production build

# Backend only
cd backend
npm run dev             # Start backend dev server
npm run build           # Build backend
npm run test            # Run backend tests
npm run start           # Start production server
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
   PERPLEXITY_API_KEY=your_api_key_here
   EXA_API_KEY=your_exa_api_key_here  # Optional
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

## 🙏 Acknowledgments

- [Perplexity AI](https://www.perplexity.ai/)
- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
