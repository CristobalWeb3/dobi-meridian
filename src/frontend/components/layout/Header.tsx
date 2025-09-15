/**
 * Header Component
 * Main application header with navigation
 */

import React from 'react';
import type { ViewType } from '../../types';

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const navigationItems = [
    { id: 'chat' as ViewType, label: 'Chat', icon: '💬' },
    { id: 'rwa' as ViewType, label: 'RWA', icon: '🏗️' },
    { id: 'dam' as ViewType, label: 'DAMs', icon: '🤖' },
    { id: 'stellar' as ViewType, label: 'Stellar', icon: '⭐' }
  ];

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-purple-600 font-bold text-lg">D</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">DOBI</h1>
            <p className="text-sm text-white/90">
              AI Agent para RWA & DAMs en Stellar
            </p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex space-x-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === item.id
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Header;
