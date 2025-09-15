/**
 * Chat Input Component
 * Input field for sending messages in the chat
 */

import React from 'react';
import Button from '../common/Button';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  placeholder?: string;
  className?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  isLoading,
  placeholder = 'Pregunta sobre RWAs, DAMs, Stellar, Soroban...',
  className = ''
}) => {
  return (
    <div className={`bg-gray-800 p-4 border-t border-gray-700 ${className}`}>
      <div className="flex space-x-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder={placeholder}
          className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
          disabled={isLoading}
        />
        <Button
          onClick={onSend}
          disabled={!value.trim() || isLoading}
          loading={isLoading}
          variant="primary"
          size="md"
        >
          {isLoading ? 'Enviando...' : 'Enviar'}
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
