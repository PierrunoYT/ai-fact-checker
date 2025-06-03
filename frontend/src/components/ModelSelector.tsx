import React from 'react';
import { PerplexityModel } from '../api/perplexityApi';

interface ModelSelectorProps {
  model: PerplexityModel;
  onModelChange: (model: PerplexityModel) => void;
  isDarkMode: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  model,
  onModelChange,
  isDarkMode
}) => {
  const models: { value: PerplexityModel; label: string; description: string }[] = [
    {
      value: 'sonar',
      label: 'Sonar',
      description: 'Fast fact-checking with 127k context'
    },
    {
      value: 'sonar-pro',
      label: 'Sonar Pro',
      description: 'Enhanced capabilities with 200k context'
    },
    {
      value: 'sonar-reasoning',
      label: 'Sonar Reasoning',
      description: 'Detailed analysis with citations'
    },
    {
      value: 'sonar-reasoning-pro',
      label: 'Sonar Reasoning Pro',
      description: 'Premium model with extensive reasoning'
    }
  ];

  return (
    <div className="mb-4">
      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
        Model
      </label>
      <div className="grid grid-cols-2 gap-3">
        {models.map((modelOption) => (
          <label key={modelOption.value} className="inline-flex items-start cursor-pointer">
            <input
              type="radio"
              className="form-radio text-blue-500 mt-1"
              name="model"
              value={modelOption.value}
              checked={model === modelOption.value}
              onChange={(e) => onModelChange(e.target.value as PerplexityModel)}
            />
            <div className="ml-2">
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {modelOption.label}
              </span>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
                {modelOption.description}
              </p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};
