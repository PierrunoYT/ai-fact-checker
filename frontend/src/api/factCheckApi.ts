interface FactCheckOptions {
  model?: string;
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

export const factCheckApi = {
  checkFact: async (statement: string, options: FactCheckOptions = {}): Promise<FactCheckResult> => {
    const response = await fetch('/api/fact-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ statement, ...options }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to check fact');
    }

    return response.json();
  }
}; 