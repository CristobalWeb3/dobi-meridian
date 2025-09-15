/**
 * Application constants and configuration
 * Centralized constants for better maintainability
 */

// ============================================================================
// APPLICATION CONFIGURATION
// ============================================================================

export const APP_CONFIG = {
  name: 'DOBI',
  description: 'AI Agent para RWA & DAMs en Stellar',
  version: '1.0.0',
  author: 'DOBI Team'
} as const;

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const API_ENDPOINTS = {
  base: process.env.REACT_APP_API_BASE || 'http://localhost:3000',
  stellar: {
    horizon: 'https://horizon.stellar.org',
    testnet: 'https://horizon-testnet.stellar.org'
  },
  dobi: {
    validateRWA: '/api/rwa/validate',
    getDAMs: '/api/dam/devices',
    executeContract: '/api/stellar/contract/execute'
  }
} as const;

// ============================================================================
// RWA VALIDATION CONSTANTS
// ============================================================================

export const RWA_CONFIG = {
  supportedTypes: ['solar', 'wind', 'real-estate', 'equipment', 'other'] as const,
  supportedCurrencies: ['USD', 'EUR', 'XLM'] as const,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['.pdf', '.doc', '.docx', '.jpg', '.png', '.jpeg'],
  validationThresholds: {
    minConfidence: 60,
    maxRiskScore: 70,
    minValue: 1000
  }
} as const;

// ============================================================================
// DAM MANAGEMENT CONSTANTS
// ============================================================================

export const DAM_CONFIG = {
  deviceTypes: ['charging-station', 'solar-panel', 'wind-turbine', 'sensor', 'other'] as const,
  statuses: ['online', 'offline', 'maintenance', 'error'] as const,
  maintenanceIntervals: {
    chargingStation: 30, // days
    solarPanel: 45,
    windTurbine: 60,
    sensor: 90
  },
  metrics: {
    minEfficiency: 70,
    maxTemperature: 60,
    minUptime: 95
  }
} as const;

// ============================================================================
// STELLAR/SOROBAN CONSTANTS
// ============================================================================

export const STELLAR_CONFIG = {
  network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet',
  baseReserve: 0.5, // XLM
  fee: 0.00001, // XLM
  timeout: 30000, // 30 seconds
  contractTypes: ['rwa-validator', 'dam-manager', 'oracle', 'custom'] as const
} as const;

// ============================================================================
// UI CONSTANTS
// ============================================================================

export const UI_CONFIG = {
  colors: {
    primary: '#8B5CF6',
    secondary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#06B6D4'
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)'
    }
  }
} as const;

// ============================================================================
// VALIDATION MESSAGES
// ============================================================================

export const VALIDATION_MESSAGES = {
  required: 'Este campo es obligatorio',
  email: 'Ingresa un email válido',
  minLength: (min: number) => `Mínimo ${min} caracteres`,
  maxLength: (max: number) => `Máximo ${max} caracteres`,
  min: (min: number) => `Valor mínimo: ${min}`,
  max: (max: number) => `Valor máximo: ${max}`,
  pattern: 'Formato inválido',
  fileSize: (maxSize: number) => `Archivo demasiado grande. Máximo: ${maxSize / 1024 / 1024}MB`,
  fileType: (allowedTypes: string[]) => `Tipo de archivo no permitido. Permitidos: ${allowedTypes.join(', ')}`
} as const;

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  network: 'Error de conexión. Verifica tu internet.',
  unauthorized: 'No autorizado. Inicia sesión nuevamente.',
  forbidden: 'No tienes permisos para esta acción.',
  notFound: 'Recurso no encontrado.',
  serverError: 'Error del servidor. Intenta más tarde.',
  walletConnection: 'Error al conectar wallet. Verifica que esté instalado.',
  transactionFailed: 'Transacción fallida. Verifica tu balance.',
  contractError: 'Error en el contrato inteligente.',
  validationError: 'Error en la validación de datos.'
} as const;

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
  walletConnected: 'Wallet conectado exitosamente',
  transactionSent: 'Transacción enviada exitosamente',
  rwaValidated: 'RWA validado exitosamente',
  damRegistered: 'DAM registrado exitosamente',
  contractDeployed: 'Contrato desplegado exitosamente',
  dataSaved: 'Datos guardados exitosamente'
} as const;
