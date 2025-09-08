import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import Button from './Button';

const AgentChat = ({ 
  variant = 'default', 
  onSendMessage, 
  messages = [], 
  isLoading = false,
  placeholder = "Ask me anything...",
  tools = []
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage?.(input.trim());
      setInput('');
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'h-64';
      case 'withTools':
        return 'h-96';
      default:
        return 'h-80';
    }
  };

  const MessageBubble = ({ message, isUser }) => (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`px-4 py-2 rounded-lg ${
            isUser
              ? 'bg-primary text-white ml-auto'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
          {message.timestamp && (
            <p className="text-xs opacity-70 mt-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </p>
          )}
        </div>
        
        {!isUser && (
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(message.content)}
              className="h-6 px-2 text-xs"
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
            >
              <ThumbsUp className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
            >
              <ThumbsDown className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-gray-600" />
        </div>
      )}
    </div>
  );

  return (
    <div className={`flex flex-col bg-white border border-gray-200 rounded-lg shadow-card ${getVariantClasses()}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-gray-900">AI Assistant</h3>
        </div>
        {variant === 'withTools' && tools.length > 0 && (
          <div className="flex gap-1">
            {tools.map((tool, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={tool.onClick}
                className="h-7 px-2 text-xs"
              >
                {tool.icon && <tool.icon className="w-3 h-3 mr-1" />}
                {tool.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Bot className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Start a conversation with the AI assistant</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              isUser={message.role === 'user'}
            />
          ))
        )}
        
        {isLoading && (
          <div className="flex gap-3 justify-start mb-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                <span className="text-sm text-gray-500">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-3"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AgentChat;
