import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from './icons/SendIcon';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`; // Set to scroll height
    }
  }, [input]);

  return (
    <div className="flex-shrink-0 p-4 bg-black/10 backdrop-blur-lg border-t border-white/10">
      <div className="relative max-w-4xl mx-auto">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Gemini..."
          rows={1}
          className="w-full p-4 pr-16 text-base bg-gray-800/50 border border-gray-600/50 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow placeholder-gray-400 max-h-48"
          disabled={isLoading}
          aria-label="Chat input"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-2.5 rounded-full text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:opacity-90 disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
          aria-label="Send message"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <SendIcon className="w-5 h-5" />
          )}
        </button>
      </div>
      <p className="text-center text-xs text-gray-500 mt-2">
        Powered by Google Gemini.
      </p>
    </div>
  );
};

export default ChatInput;