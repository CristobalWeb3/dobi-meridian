import { createRoot } from 'react-dom/client';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

// Types
type UUID = string;
type ViewType = 'chat' | 'rwa' | 'dam' | 'stellar';

// Define the interface for the ELIZA_CONFIG
interface ElizaConfig {
  agentId: string;
  apiBase: string;
}

// Declare global window extension for TypeScript
declare global {
  interface Window {
    ELIZA_CONFIG?: ElizaConfig;
  }
}

const queryClient = new QueryClient();

console.log('Index.tsx loaded successfully');

// Simple Chat Interface
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'dobi';
  timestamp: Date;
}

function SimpleChatInterface() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      content: '¡Hola! Soy DOBI, tu asistente especializado en Real-World Assets (RWA) y Decentralized Autonomous Machines (DAMs) en la red Stellar. ¿En qué puedo ayudarte hoy?',
      sender: 'dobi',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateDobiResponse = (input: string): string => {
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
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
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
        timestamp: new Date()
      };
      setMessages(prev => [...prev, dobiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-3xl ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                  message.sender === 'user' 
                    ? 'bg-blue-600' 
                    : 'bg-gradient-to-br from-blue-600 to-purple-600'
                }`}>
                  {message.sender === 'user' ? (
                    <span className="text-white font-semibold text-sm">U</span>
                  ) : (
                    <span className="text-white font-semibold text-sm">D</span>
                  )}
                </div>
                
                {/* Message Bubble */}
                <div className={`px-6 py-4 rounded-2xl shadow-sm max-w-2xl ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900 border border-gray-200'
                }`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-3xl">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-sm">
                  <span className="text-white font-semibold text-sm">D</span>
                </div>
                <div className="bg-gray-100 border border-gray-200 px-6 py-4 rounded-2xl shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">DOBI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about RWAs, DAMs, Stellar, Soroban..."
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 px-6 py-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 placeholder-gray-500"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-xl text-white font-semibold transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main DOBI Application Component
function DobiApp() {
  const [currentView, setCurrentView] = React.useState<ViewType>('chat');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'rwa':
        return (
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-4xl">🏗️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">RWA Validator</h3>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Validate and tokenize Real-World Assets using advanced AI and blockchain technology. 
                  Coming soon with comprehensive validation tools.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-md mx-auto">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-blue-900">Development in progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'dam':
        return (
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-4xl">🤖</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">DAM Manager</h3>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Manage Decentralized Autonomous Machines with real-time monitoring, 
                  maintenance scheduling, and performance analytics.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-md mx-auto">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-blue-900">Development in progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'stellar':
        return (
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-4xl">⭐</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Stellar Integration</h3>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Integrate with Stellar blockchain for seamless transactions, 
                  smart contract deployment, and asset management.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-md mx-auto">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-blue-900">Development in progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <SimpleChatInterface />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo Section */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">DOBI</h1>
              <p className="text-sm text-gray-500">AI Agent Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6">
          <div className="space-y-2">
            {([
              { id: 'chat', label: 'Chat Assistant', icon: '💬', description: 'AI-powered conversations' },
              { id: 'rwa', label: 'RWA Validator', icon: '🏗️', description: 'Real-World Assets' },
              { id: 'dam', label: 'DAM Manager', icon: '🤖', description: 'Device Management' },
              { id: 'stellar', label: 'Stellar Integration', icon: '⭐', description: 'Blockchain Tools' }
            ] as Array<{id: ViewType, label: string, icon: string, description: string}>).map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                  currentView === item.id
                    ? 'bg-blue-50 border-2 border-blue-200 shadow-sm'
                    : 'hover:bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className={`font-semibold ${
                      currentView === item.id ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {item.label}
                    </div>
                    <div className={`text-sm ${
                      currentView === item.id ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </nav>

        {/* Status Section */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <div className="text-sm font-semibold text-green-900">Online</div>
              <div className="text-xs text-green-600">All systems operational</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {currentView === 'chat' ? 'Chat Assistant' :
               currentView === 'rwa' ? 'RWA Validator' :
               currentView === 'dam' ? 'DAM Manager' : 'Stellar Integration'}
            </h2>
            <p className="text-sm text-gray-500">
              {currentView === 'chat' ? 'AI-powered conversations about RWAs and DAMs' :
               currentView === 'rwa' ? 'Validate and tokenize Real-World Assets' :
               currentView === 'dam' ? 'Manage Decentralized Autonomous Machines' : 'Integrate with Stellar blockchain'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Connected</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
      {renderCurrentView()}
        </div>
      </div>
    </div>
  );
}

// Main route component
function ExampleRoute() {
  const config = window.ELIZA_CONFIG;
  const agentId = config?.agentId;

  // Apply dark mode to the root element
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
    console.log('Dark mode applied, agentId:', agentId);
  }, []);

  if (!agentId) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8">DOBI Test Page</h1>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Status</h2>
            <p className="text-red-400 font-medium">Error: Agent ID not found</p>
            <p className="text-sm text-gray-400 mt-2">
          The server should inject the agent ID configuration.
            </p>
            <p className="text-sm text-gray-300 mt-4">
              React is working! ✅<br/>
              React Query loaded! ✅<br/>
              Time: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <DobiApp />;
}

// Wrapper with QueryClientProvider
function AppWithProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <ExampleRoute />
    </QueryClientProvider>
  );
}

// Initialize the application
console.log('Initializing React app...');
const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);

if (rootElement) {
  console.log('Rendering AppWithProviders...');
  createRoot(rootElement).render(<AppWithProviders />);
  console.log('AppWithProviders rendered successfully');
} else {
  console.error('Root element not found!');
}

// No exports needed for this entry point
