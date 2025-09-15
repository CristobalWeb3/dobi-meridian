/**
 * Custom hook for DOBI chat functionality
 * Manages chat state, message handling, and AI responses
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import type { Message } from '../types';

interface UseDobiChatReturn {
  messages: Message[];
  inputValue: string;
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  setInputValue: (value: string) => void;
  handleSendMessage: () => Promise<void>;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  clearMessages: () => void;
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  content: '¡Hola! Soy DOBI, tu asistente especializado en Real-World Assets (RWA) y Decentralized Autonomous Machines (DAMs) en la red Stellar. ¿En qué puedo ayudarte hoy?',
  sender: 'dobi',
  timestamp: new Date(),
  type: 'text'
};

export const useDobiChat = (): UseDobiChatReturn => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const generateDobiResponse = useCallback((input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('stellar') || lowerInput.includes('soroban')) {
      return 'Stellar y Soroban son perfectos para tu proyecto RWA. Te puedo ayudar a configurar smart contracts para validación de datos off-chain y gestión de DAMs. ¿Qué tipo de activos quieres tokenizar?';
    }
    
    if (lowerInput.includes('rwa') || lowerInput.includes('real-world')) {
      return 'Los Real-World Assets son mi especialidad. Puedo ayudarte con la validación de datos, detección de fraude y reducción de requisitos de colateral. ¿Tienes algún activo específico en mente?';
    }
    
    if (lowerInput.includes('depin') || lowerInput.includes('iot')) {
      return 'Los proyectos DePIN requieren gestión autónoma de dispositivos IoT. Puedo configurar sistemas de monitoreo, mantenimiento automático y distribución de recompensas. ¿Qué infraestructura física necesitas gestionar?';
    }
    
    if (lowerInput.includes('validación') || lowerInput.includes('validar')) {
      return 'Mi sistema de validación utiliza Trusted Execution Environments (TEEs) para garantizar la integridad de los datos. Puedo validar métricas de energía, transacciones y operaciones en tiempo real.';
    }
    
    if (lowerInput.includes('dobi') || lowerInput.includes('token')) {
      return 'El token $DOBI es la utilidad de mi ecosistema. Los holders reciben recompensas por la validación exitosa de RWAs y el mantenimiento de DAMs. ¿Te interesa saber más sobre la economía del token?';
    }
    
    if (lowerInput.includes('ayuda') || lowerInput.includes('help')) {
      return 'Puedo ayudarte con:\n• Validación de Real-World Assets (RWAs)\n• Gestión de Decentralized Autonomous Machines (DAMs)\n• Integración con Stellar y Soroban\n• Detección de fraude y análisis de riesgo\n• Tokenización de activos físicos\n\n¿En qué área específica necesitas ayuda?';
    }
    
    return 'Como DOBI, me especializo en validación de datos off-chain para RWAs y gestión de DAMs en Stellar. Puedo ayudarte con tokenización de activos, detección de fraude, y operaciones autónomas. ¿Qué aspecto específico te interesa?';
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const dobiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateDobiResponse(currentInput),
        sender: 'dobi',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, dobiResponse]);
      setIsLoading(false);
    }, 1000);
  }, [inputValue, isLoading, generateDobiResponse]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const clearMessages = useCallback(() => {
    setMessages([INITIAL_MESSAGE]);
  }, []);

  return {
    messages,
    inputValue,
    isLoading,
    messagesEndRef,
    setInputValue,
    handleSendMessage,
    handleKeyPress,
    clearMessages
  };
};
