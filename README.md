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
- Git

### Installation

#### Windows

1. **Install Prerequisites**
   ```powershell
   # Install Node.js and npm from https://nodejs.org/
   # Install Git from https://git-scm.com/download/windows
   ```

2. **Clone and Install**
   ```powershell
   # Clone repository
   git clone https://github.com/PierrunoYT/truth-check.git
   cd truth-check

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure Environment**
   ```powershell
   # Backend (.env)
   cd ../backend
   copy .env.example .env
   # Edit .env and add your Perplexity API key

   # Frontend (.env)
   cd ../frontend
   copy .env.example .env
   ```

4. **Start Development Servers**
   ```powershell
   # Terminal 1: Backend
   cd backend
   npm run dev

   # Terminal 2: Frontend
   cd frontend
   npm run dev
   ```

#### macOS

1. **Install Prerequisites**
   ```bash
   # Install Homebrew
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

   # Install Node.js and Git
   brew install node git
   ```

2. **Clone and Install**
   ```bash
   # Clone repository
   git clone https://github.com/PierrunoYT/truth-check.git
   cd truth-check

   # Install dependencies
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Configure Environment**
   ```bash
   # Backend (.env)
   cd ../backend
   cp .env.example .env
   # Edit .env and add your Perplexity API key

   # Frontend (.env)
   cd ../frontend
   cp .env.example .env
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev

   # Terminal 2: Frontend
   cd frontend && npm run dev
   ```

#### Linux (Ubuntu/Debian)

1. **Install Prerequisites**
   ```bash
   # Update package list
   sudo apt update

   # Install Node.js and npm
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install Git
   sudo apt install -y git
   ```

2. **Clone and Install**
   ```bash
   # Clone repository
   git clone https://github.com/PierrunoYT/truth-check.git
   cd truth-check

   # Install dependencies
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Configure Environment**
   ```bash
   # Backend (.env)
   cd ../backend
   cp .env.example .env
   # Edit .env and add your Perplexity API key

   # Frontend (.env)
   cd ../frontend
   cp .env.example .env
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev

   # Terminal 2: Frontend
   cd frontend && npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

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
  "model": "sonar" | "sonar-pro" | "sonar-reasoning" | "sonar-reasoning-pro"
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

### Common Issues

1. **API Key Error**
   ```bash
   # Check API key is set
   echo $PERPLEXITY_API_KEY    # macOS/Linux
   echo %PERPLEXITY_API_KEY%   # Windows
   ```

2. **Port Conflicts**
   ```bash
   # Check ports 3000 and 5173 are available
   netstat -ano | findstr "3000 5173"  # Windows
   lsof -i :3000,5173                  # macOS/Linux
   ```

3. **Node Version**
   ```bash
   # Ensure Node.js v18+
   node --version
   ```

### Platform-Specific Issues

#### Windows
- If you get EACCES errors, run PowerShell as Administrator
- If `npm install` fails, try: `npm install --no-optional`
- For permission issues: Right-click → Run as Administrator

#### macOS
- If you get permission errors:
  ```bash
  sudo chown -R $USER /usr/local/lib/node_modules
  ```
- If Homebrew is not found: Add to path
  ```bash
  echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
  ```

#### Linux
- If you get EACCES errors:
  ```bash
  mkdir ~/.npm-global
  npm config set prefix '~/.npm-global'
  echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
  source ~/.profile
  ```
- For permission issues:
  ```bash
  sudo chown -R $USER:$GROUP ~/.npm
  sudo chown -R $USER:$GROUP ~/.config
  ```

## 📄 License

MIT License - see [LICENSE](LICENSE)

## 👤 Author

**PierrunoYT**
- 🌐 [pierruno.com](https://pierruno.com)
- 💻 [@PierrunoYT](https://github.com/PierrunoYT)

## 🙏 Acknowledgments

- [Perplexity AI](https://www.perplexity.ai/)
- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/) 