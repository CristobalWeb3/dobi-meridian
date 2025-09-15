/**
 * Chat Interface Component
 * Main chat interface with messages and input
 */

import React from 'react';
import { useDobiChat } from '../../hooks/useDobiChat';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import LoadingSpinner from '../common/LoadingSpinner';

const ChatInterface: React.FC = () => {
  const {
    messages,
    inputValue,
    isLoading,
    messagesEndRef,
    setInputValue,
    handleSendMessage,
    handleKeyPress
  } = useDobiChat();

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            className="message-slide-in"
          />
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 px-4 py-2 rounded-lg">
              <LoadingSpinner size="sm" color="gray" />
            </div>
          </div>
        )}
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        onKeyPress={handleKeyPress}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatInterface;
