import React, { useState, useRef, useEffect } from 'react';
import { type Chat } from '@google/genai';
import { Message, Role } from './types';
import { createChatSession } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import WelcomeScreen from './components/WelcomeScreen';
import { GeminiIcon } from './components/icons/GeminiIcon';

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const chatRef = useRef<Chat | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatRef.current = createChatSession();
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages, isLoading]);

    const handleSendMessage = async (userMessage: string) => {
        if (!chatRef.current || isLoading) return;
        
        const userMsg: Message = { role: Role.USER, text: userMessage };
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const stream = await chatRef.current.sendMessageStream({ message: userMessage });

            let modelResponse = '';
            let firstChunk = true;

            for await (const chunk of stream) {
                const chunkText = chunk.text;
                modelResponse += chunkText;

                if (firstChunk) {
                    setMessages(prev => [...prev, { role: Role.MODEL, text: modelResponse }]);
                    firstChunk = false;
                } else {
                    setMessages(prev => {
                        const newMessages = [...prev];
                        if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === Role.MODEL) {
                            newMessages[newMessages.length - 1].text = modelResponse;
                        }
                        return newMessages;
                    });
                }
            }
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMsg: Message = { role: Role.MODEL, text: "Sorry, I encountered an error. Please check the console or try again." };
            setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage && lastMessage.role === Role.USER) {
                    return [...prev, errorMsg];
                }
                return prev;
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const startNewChat = () => {
        setMessages([]);
        chatRef.current = createChatSession();
    }

    return (
        <div className="flex flex-col h-screen bg-transparent text-white font-sans">
            <header className="flex-shrink-0 p-4 bg-black/10 backdrop-blur-lg border-b border-white/10 z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <GeminiIcon className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-xl font-bold">
                        Gemini Chat
                    </h1>
                </div>
                <button onClick={startNewChat} className="px-4 py-2 text-sm font-semibold bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-600/70 transition-colors">
                    New Chat
                </button>
            </header>

            <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                <div className="max-w-4xl mx-auto w-full h-full">
                    {messages.length === 0 && !isLoading ? (
                        <WelcomeScreen onPromptClick={handleSendMessage} />
                    ) : (
                        messages.map((msg, index) => (
                            <ChatMessage key={index} message={msg} />
                        ))
                    )}
                    {isLoading && (
                       <div className="flex w-full justify-start">
                         <div className="max-w-[85%] md:max-w-[75%] flex items-start gap-4 animate-fade-in">
                           <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-purple-500 to-blue-500 shadow-md">
                             <GeminiIcon className="w-5 h-5 text-white" />
                           </div>
                           <div className="flex-1 overflow-hidden p-4 rounded-2xl shadow-lg bg-gray-800 rounded-bl-none">
                             <div className="flex items-center gap-2">
                               <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse"></span>
                               <span style={{animationDelay: '0.2s'}} className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse"></span>
                               <span style={{animationDelay: '0.4s'}} className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse"></span>
                             </div>
                           </div>
                         </div>
                       </div>
                    )}
                </div>
            </main>
            
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
    );
};

export default App;