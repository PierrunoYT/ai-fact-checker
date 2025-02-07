# AI Fact Checker 🔍

> A powerful AI-powered fact-checking application that verifies statements using Perplexity's Sonar models with web search capabilities.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-%5E18.0.0-blue)](https://reactjs.org/)

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