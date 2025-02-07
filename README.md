# AI Fact Checker

An advanced fact-checking application powered by Perplexity AI that verifies statements using real-time information from reliable sources.

## Features

- **Real-time Fact Checking**: Analyzes statements for factual accuracy using the Perplexity AI API
- **Multiple AI Models**:
  - `sonar`: Fast, efficient fact-checking (127k context window)
  - `sonar-pro`: Enhanced capabilities with larger context (200k window)
  - `sonar-reasoning`: Detailed reasoning and citations (127k window)
  - `sonar-reasoning-pro`: Premium model with extensive analysis (127k window)
- **Comprehensive Analysis**:
  - Factual assessment with confidence scores
  - Detailed explanations with cited sources
  - Transparent thinking process
  - Multiple reliable sources with direct links
- **Modern UI/UX**:
  - Clean, responsive design
  - Dark/light mode support
  - Real-time updates
  - Source verification with clickable links
- **Usage Statistics**: Track token consumption and API usage

## Tech Stack

- **Frontend**:
  - React with TypeScript
  - Tailwind CSS for styling
  - Vite for build tooling
- **Backend**:
  - Node.js with Express
  - TypeScript for type safety
  - Perplexity AI API integration

## Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ai-fact-checker
   ```

2. **Install dependencies**:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure environment variables**:
   
   Backend (.env):
   ```
   PORT=3000
   PERPLEXITY_API_KEY=your_api_key_here
   FRONTEND_URL=http://localhost:5173
   ```

   Frontend (.env):
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Start the development servers**:
   ```bash
   # Start backend (from backend directory)
   npm run dev

   # Start frontend (from frontend directory)
   npm run dev
   ```

5. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## Usage

1. Select an AI model based on your needs:
   - Use `sonar` or `sonar-pro` for quick fact checks
   - Use `sonar-reasoning` or `sonar-reasoning-pro` for detailed analysis

2. Enter a statement to fact check

3. Review the results:
   - Factual assessment (true/false)
   - Confidence level
   - Detailed explanation
   - Thinking process
   - Source links with citations

## API Endpoints

### `POST /api/check-fact`
Checks the factuality of a statement.

Request body:
```json
{
  "statement": "string",
  "model": "sonar" | "sonar-pro" | "sonar-reasoning" | "sonar-reasoning-pro",
  "stream": boolean
}
```

Response:
```json
{
  "isFactual": boolean,
  "confidence": number,
  "explanation": string,
  "sources": string[],
  "thinking": string,
  "usage": {
    "prompt_tokens": number,
    "completion_tokens": number,
    "total_tokens": number
  }
}
```

### `GET /health`
Checks the health of the API and Perplexity connection.

## Development

- Backend code is in `backend/src/`
- Frontend code is in `frontend/src/`
- API client is in `frontend/src/api/`
- Components are in `frontend/src/components/`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for your own purposes.

## Acknowledgments

- Powered by [Perplexity AI](https://www.perplexity.ai/)
- Built with [React](https://reactjs.org/) and [Express](https://expressjs.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## ✨ Features

- 🔍 Real-time fact checking with web search capabilities
- 🤖 Choice between Sonar and Sonar Pro models
- 📊 Detailed analysis with confidence scores
- 📚 Source citations with clickable links
- 🌓 Dark/Light mode support
- 📱 Responsive design
- 💻 Cross-platform compatibility

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v8 or higher)
- [Git](https://git-scm.com/)

## Installation

### Windows

1. Open PowerShell or Command Prompt and clone the repository:
```bash
git clone https://github.com/PierrunoYT/truth-check.git
cd truth-check
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
copy .env.example .env
```

4. Add your Perplexity API key to the `.env` file:
```bash
PERPLEXITY_API_KEY=your_api_key_here
```

### macOS/Linux

1. Open Terminal and clone the repository:
```bash
git clone https://github.com/PierrunoYT/truth-check.git
cd truth-check
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Add your Perplexity API key to the `.env` file:
```bash
echo "PERPLEXITY_API_KEY=your_api_key_here" >> .env
```

## Running the Application

1. Start the backend server:
```bash
# From the root directory
cd backend
npm run dev
```

2. In a new terminal, start the frontend:
```bash
# From the root directory
cd frontend
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:5173
```

## Development

### Project Structure
```
truth-check/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── api/
│   │   └── ...
│   ├── package.json
│   └── ...
├── backend/
│   ├── src/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── ...
└── README.md
```

### Environment Variables

Backend (`.env`):
```
PORT=3000
PERPLEXITY_API_KEY=your_api_key_here
```

Frontend (`.env`):
```
VITE_API_URL=http://localhost:3000/api
```

## API Models

### Sonar
- Default model
- 127k token context window
- Suitable for most fact-checking needs

### Sonar Pro
- Advanced model
- 200k token context window
- 8k token output limit
- Better for complex fact-checking

## Troubleshooting

### Common Issues

1. **API Key Error**
   - Ensure your Perplexity API key is correctly set in the `.env` file
   - Check that the API key is valid and not expired

2. **Connection Error**
   - Verify both frontend and backend servers are running
   - Check the correct ports are available (3000 for backend, 5173 for frontend)

3. **Node Version Error**
   - Ensure you're using Node.js v18 or higher
   ```bash
   node --version
   ```
   - If needed, use nvm to switch Node versions:
   ```bash
   nvm use 18
   ```

### Platform-Specific Issues

#### Windows
- If you get EACCES errors, run PowerShell as Administrator
- If `npm install` fails, try:
  ```bash
  npm install --no-optional
  ```

#### macOS
- If you get permission errors:
  ```bash
  sudo chown -R $USER /usr/local/lib/node_modules
  ```

#### Linux
- If you get EACCES errors:
  ```bash
  mkdir ~/.npm-global
  npm config set prefix '~/.npm-global'
  echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
  source ~/.profile
  ```

## Contributing

1. Fork the repository
2. Create your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Perplexity AI](https://www.perplexity.ai/) for their powerful API
- [React](https://reactjs.org/) for the frontend framework
- [Express](https://expressjs.com/) for the backend server
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 👤 Author

**PierrunoYT**

* Website: [pierruno.com](https://pierruno.com)
* GitHub: [@PierrunoYT](https://github.com/PierrunoYT)

## 🤝 Contributing

Contributions, issues and feature requests are welcome! Feel free to check the [issues page](https://github.com/PierrunoYT/truth-check/issues). 