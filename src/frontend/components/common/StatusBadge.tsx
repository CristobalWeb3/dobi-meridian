/**
 * Status Badge Component
 * Displays status with appropriate colors and icons
 */

import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'dot' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const getStatusConfig = (status: string) => {
    const statusMap: Record<string, { color: string; icon: string; text: string }> = {
      // General statuses
      'online': { color: 'text-green-400 bg-green-900/20', icon: '🟢', text: 'ONLINE' },
      'offline': { color: 'text-red-400 bg-red-900/20', icon: '🔴', text: 'OFFLINE' },
      'maintenance': { color: 'text-yellow-400 bg-yellow-900/20', icon: '🟡', text: 'MANTENIMIENTO' },
      'error': { color: 'text-red-500 bg-red-900/20', icon: '🔴', text: 'ERROR' },
      'pending': { color: 'text-yellow-400 bg-yellow-900/20', icon: '⏳', text: 'PENDIENTE' },
      'success': { color: 'text-green-400 bg-green-900/20', icon: '✅', text: 'ÉXITO' },
      'failed': { color: 'text-red-400 bg-red-900/20', icon: '❌', text: 'FALLIDO' },
      'active': { color: 'text-green-400 bg-green-900/20', icon: '🟢', text: 'ACTIVO' },
      'inactive': { color: 'text-red-400 bg-red-900/20', icon: '🔴', text: 'INACTIVO' },
      
      // Priority levels
      'low': { color: 'text-blue-400 bg-blue-900/20', icon: '🔵', text: 'BAJA' },
      'medium': { color: 'text-yellow-400 bg-yellow-900/20', icon: '🟡', text: 'MEDIA' },
      'high': { color: 'text-orange-400 bg-orange-900/20', icon: '🟠', text: 'ALTA' },
      'critical': { color: 'text-red-500 bg-red-900/20', icon: '🔴', text: 'CRÍTICA' },
      
      // Task statuses
      'in-progress': { color: 'text-blue-400 bg-blue-900/20', icon: '🔄', text: 'EN PROGRESO' },
      'completed': { color: 'text-green-400 bg-green-900/20', icon: '✅', text: 'COMPLETADO' }
    };

    return statusMap[status.toLowerCase()] || {
      color: 'text-gray-400 bg-gray-900/20',
      icon: '⚪',
      text: status.toUpperCase()
    };
  };

  const config = getStatusConfig(status);

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-colors';
  const classes = `${baseClasses} ${config.color} ${sizeClasses[size]} ${className}`;

  if (variant === 'dot') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className={`w-2 h-2 rounded-full ${config.color.split(' ')[0]}`} />
        <span className={`text-sm font-medium ${config.color.split(' ')[0]}`}>
          {config.text}
        </span>
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        <span className="text-lg">{config.icon}</span>
        <span className={`text-sm font-medium ${config.color.split(' ')[0]}`}>
          {config.text}
        </span>
      </div>
    );
  }

  return (
    <span className={classes}>
      {config.icon && <span className="mr-1">{config.icon}</span>}
      {config.text}
    </span>
  );
};

export default StatusBadge;
