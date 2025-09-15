import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import './index.css';
import React, { useState } from 'react';
import type { UUID, ViewType } from '@elizaos/core';

// Components
import Header from './components/layout/Header';
import ChatInterface from './components/chat/ChatInterface';
import RWAValidator from './components/RWAValidator';
import DAMManager from './components/DAMManager';
import StellarIntegration from './components/StellarIntegration';

const queryClient = new QueryClient();

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

/**
 * Main DOBI Application Component
 */
function DobiApp() {
  const [currentView, setCurrentView] = useState<ViewType>('chat');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'rwa':
        return <RWAValidator />;
      case 'dam':
        return <DAMManager />;
      case 'stellar':
        return <StellarIntegration />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView} 
      />
      {renderCurrentView()}
    </div>
  );
}

/**
 * Main Example route component
 */
function ExampleRoute() {
  const config = window.ELIZA_CONFIG;
  const agentId = config?.agentId;

  // Apply dark mode to the root element
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  if (!agentId) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-600 font-medium">Error: Agent ID not found</div>
        <div className="text-sm text-gray-600 mt-2">
          The server should inject the agent ID configuration.
        </div>
      </div>
    );
  }

  return <ExampleProvider agentId={agentId as UUID} />;
}

/**
 * Example provider component
 */
function ExampleProvider({ agentId }: { agentId: UUID }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DobiApp />
    </QueryClientProvider>
  );
}

// Initialize the application - no router needed for iframe
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<ExampleRoute />);
}

// Define types for integration with agent UI system
export interface AgentPanel {
  name: string;
  path: string;
  component: React.ComponentType<any>;
  icon?: string;
  public?: boolean;
  shortLabel?: string; // Optional short label for mobile
}

interface PanelProps {
  agentId: string;
}

/**
 * DOBI Dashboard panel component
 */
const DobiDashboard: React.FC<PanelProps> = ({ agentId }) => {
  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">DOBI Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">RWAs Validados</h3>
            <p className="text-3xl font-bold text-green-400">24</p>
            <p className="text-sm text-gray-400">+12% este mes</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">DAMs Activos</h3>
            <p className="text-3xl font-bold text-blue-400">8</p>
            <p className="text-sm text-gray-400">100% operativos</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Transacciones</h3>
            <p className="text-3xl font-bold text-purple-400">1,247</p>
            <p className="text-sm text-gray-400">+8% esta semana</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-purple-600 hover:bg-purple-700 p-4 rounded-lg text-center transition-colors">
              <div className="text-2xl mb-2">🏗️</div>
              <div className="text-sm">Validar RWA</div>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg text-center transition-colors">
              <div className="text-2xl mb-2">🤖</div>
              <div className="text-sm">Gestionar DAM</div>
            </button>
            <button className="bg-green-600 hover:bg-green-700 p-4 rounded-lg text-center transition-colors">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm">Ver Analytics</div>
            </button>
            <button className="bg-orange-600 hover:bg-orange-700 p-4 rounded-lg text-center transition-colors">
              <div className="text-2xl mb-2">⚙️</div>
              <div className="text-sm">Configurar</div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Actividad Reciente</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">RWA "Solar Farm Alpha" validado exitosamente</p>
                <p className="text-xs text-gray-400">Hace 2 minutos</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">DAM "EV Charging Station" actualizado</p>
                <p className="text-xs text-gray-400">Hace 15 minutos</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">Nueva transacción en Stellar procesada</p>
                <p className="text-xs text-gray-400">Hace 1 hora</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the panel configuration for integration with the agent UI
export const panels: AgentPanel[] = [
  {
    name: 'DOBI Dashboard',
    path: 'dashboard',
    component: DobiDashboard,
    icon: 'Dashboard',
    public: false,
    shortLabel: 'Dashboard',
  },
];

export * from './utils';
