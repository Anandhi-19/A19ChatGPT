import React from 'react';
import { GeminiIcon } from './icons/GeminiIcon';

interface WelcomeScreenProps {
  onPromptClick: (prompt: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onPromptClick }) => {
  const prompts = [
    { title: "Explain a concept", text: "Explain quantum computing in simple terms" },
    { title: "Write a creative piece", text: "Write a short story about a robot who discovers music" },
    { title: "Provide code", text: "Show me a Python code snippet for a web scraper" },
    { title: "Plan a trip", text: "What are some must-see places for a 3-day trip to Tokyo?" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-300 animate-fade-in">
      <div className="mb-8">
        <div className="w-24 h-24 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
          <GeminiIcon className="w-16 h-16 text-white" />
        </div>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Hello, how can I help?</h1>
      <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl">
        I am a large language model, trained by Google. Start a conversation or try one of these prompts.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        {prompts.map((prompt, index) => (
          <button
            key={prompt.title}
            onClick={() => onPromptClick(prompt.text)}
            className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 text-left hover:bg-gray-700/70 transition-colors duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <h3 className="font-semibold text-lg text-white">{prompt.title}</h3>
            <p className="text-gray-400 mt-1">{prompt.text}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;