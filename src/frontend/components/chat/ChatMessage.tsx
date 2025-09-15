/**
 * Chat Message Component
 * Individual message display in the chat interface
 */

import React from 'react';
import type { Message } from '../../types';
import { formatRelativeTime } from '../../utils/helpers';

interface ChatMessageProps {
  message: Message;
  className?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  className = ''
}) => {
  const isUser = message.sender === 'user';
  const isDobi = message.sender === 'dobi';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${className}`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg transition-all duration-200 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-100'
        }`}
      >
        {/* Message content */}
        <div className="whitespace-pre-wrap">
          {message.content}
        </div>
        
        {/* Timestamp */}
        <div className={`text-xs mt-1 ${
          isUser ? 'text-blue-100' : 'text-gray-400'
        }`}>
          {formatRelativeTime(message.timestamp)}
        </div>
        
        {/* Message type indicator */}
        {message.type && message.type !== 'text' && (
          <div className="mt-1">
            {message.type === 'transaction' && (
              <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                💰 Transacción
              </span>
            )}
            {message.type === 'validation' && (
              <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
                ✅ Validación
              </span>
            )}
            {message.type === 'error' && (
              <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                ❌ Error
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
