import React, { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa';

// Define the types for our messages
interface Message {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const ZoroBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Add welcome message when the chat is first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          content: "👋 Hi there! I'm Zoro, your personal assistant for Zoro Cars. How can I help you today? I can provide information about car bookings, our luxury fleet, or connect you with customer support.",
          role: 'assistant',
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (input.trim() === '') return;
    
    const userMessage: Message = {
      content: input,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      const response = await fetch('/api/ai/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          // Include a few previous messages for context
          history: messages.slice(-5).map(msg => ({ 
            role: msg.role, 
            content: msg.content 
          }))
        }),
      });
      
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        content: data.response,
        role: 'assistant',
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
      setMessages(prev => [...prev, {
        content: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.",
        role: 'assistant',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Suggested questions that users can click on
  const suggestions = [
    "How do I book a car?",
    "Tell me about your luxury cars",
    "Do you offer chauffeur service?",
    "What's your cancellation policy?"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat button */}
      <button 
        onClick={toggleChat}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        aria-label="Chat with Zoro"
      >
        {isOpen ? 
          <FiX className="w-6 h-6" /> : 
          <div className="relative">
            <FaRobot className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>
        }
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-purple-100 transform transition-transform duration-300 origin-bottom-right">
          {/* Chat header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <FaRobot className="w-5 h-5 mr-2" />
              <h3 className="font-semibold">Zoro Assistant</h3>
            </div>
            <button 
              onClick={toggleChat}
              className="text-white hover:text-gray-200"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          
          {/* Chat body */}
          <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-3 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div 
                  className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                      : 'bg-white shadow-md border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-purple-200' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center space-x-2 text-gray-500 text-sm mb-3">
                <FaRobot className="w-4 h-4" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Suggested questions */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 bg-indigo-50 border-t border-indigo-100">
              <p className="text-xs text-indigo-700 mb-1">Suggested questions:</p>
              <div className="flex flex-wrap gap-1">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs bg-white border border-indigo-200 rounded-full px-2 py-1 hover:bg-indigo-100 transition-colors text-indigo-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Chat input */}
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 bg-white">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                value={input}
                onChange={handleInputChange}
              />
              <button
                type="submit"
                className="ml-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full p-2 hover:shadow-md transition-shadow"
                disabled={isTyping}
              >
                <FiSend className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ZoroBot;