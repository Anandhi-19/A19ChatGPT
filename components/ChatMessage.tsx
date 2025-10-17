import React, { useState, useEffect } from 'react';
import { Message, Role } from '../types';
import { UserIcon } from './icons/UserIcon';
import { GeminiIcon } from './icons/GeminiIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';

const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
    });
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <div className="bg-black/70 rounded-lg my-2 text-sm font-mono">
      <div className="flex items-center justify-between px-3 py-1 bg-gray-800/80 rounded-t-lg">
        <span className="text-gray-400 text-xs">Generated Code</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white transition-colors"
        >
          <ClipboardIcon />
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
};

const parseMarkdown = (text: string) => {
  const parts = text.split(/(\`\`\`[\s\S]*?\`\`\`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('```')) {
      const code = part.replace(/^```(?:\w+\n)?/, '').replace(/```$/, '');
      return <CodeBlock key={index} code={code} />;
    } else {
      return part.split('\n').map((line, lineIndex) => {
        if (line.trim() === '') return null;
        const htmlLine = line
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code class="bg-gray-700/50 rounded-sm px-1.5 py-0.5 text-red-300 font-mono text-sm">$1</code>');
        return <p key={`${index}-${lineIndex}`} dangerouslySetInnerHTML={{ __html: htmlLine }} className="py-0.5" />;
      }).filter(Boolean);
    }
  });
};

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] md:max-w-[75%] flex items-start gap-4 animate-fade-in`}>
        {!isUser && (
          <div
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-purple-500 to-blue-500 shadow-md"
          >
            <GeminiIcon className="w-5 h-5 text-white" />
          </div>
        )}
        <div className={`flex-1 overflow-hidden p-4 rounded-2xl shadow-lg ${isUser ? 'bg-gradient-to-r from-blue-600 to-blue-500 rounded-br-none' : 'bg-gray-800 rounded-bl-none'}`}>
          <div className="prose prose-invert max-w-none text-gray-200 text-base leading-relaxed">
              {parseMarkdown(message.text)}
          </div>
        </div>
         {isUser && (
          <div
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-700 shadow-md"
          >
            <UserIcon className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;