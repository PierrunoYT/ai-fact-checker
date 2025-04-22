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
- Perplexity AI API key

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
   cp .env.example .env
   # Edit .env and add your Perplexity API key

   # Frontend (.env)
   cd ../frontend
   cp .env.example .env
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

### Health Check
```http
GET /health
```

## 🔧 Development

```
truth-check/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/
│   │   ├── api/
│   │   └── ...
├── backend/           # Express server
│   ├── src/
│   │   ├── services/
│   │   └── ...
```

## ❗ Troubleshooting

1. **API Key Error**
   ```bash
   # Check API key is set in backend/.env
   PERPLEXITY_API_KEY=your_api_key_here
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
