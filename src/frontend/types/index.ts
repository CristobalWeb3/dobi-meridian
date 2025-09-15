/**
 * TypeScript type definitions for DOBI Frontend
 * Centralized type definitions for better organization and reusability
 */

// ============================================================================
// CORE TYPES
// ============================================================================

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'dobi';
  timestamp: Date;
  type?: 'text' | 'transaction' | 'validation' | 'error';
}

export interface StellarAccount {
  address: string;
  balance: string;
  sequence: string;
  subentryCount: number;
  flags: {
    authRequired: boolean;
    authRevocable: boolean;
    authImmutable: boolean;
  };
  assets: Array<{
    code: string;
    issuer: string;
    balance: string;
    limit?: string;
  }>;
}

// ============================================================================
// RWA VALIDATION TYPES
// ============================================================================

export type RWAAssetType = 'solar' | 'wind' | 'real-estate' | 'equipment' | 'other';

export interface RWAValidationData {
  assetId: string;
  assetType: RWAAssetType;
  location: string;
  value: number;
  currency: string;
  documents: File[];
  metadata: {
    coordinates?: { lat: number; lng: number };
    specifications?: Record<string, any>;
    certifications?: string[];
  };
}

export interface ValidationResult {
  isValid: boolean;
  confidence: number;
  issues: string[];
  recommendations: string[];
  estimatedValue: number;
  riskScore: number;
}

// ============================================================================
// DAM MANAGEMENT TYPES
// ============================================================================

export type DAMDeviceType = 'charging-station' | 'solar-panel' | 'wind-turbine' | 'sensor' | 'other';
export type DAMDeviceStatus = 'online' | 'offline' | 'maintenance' | 'error';
export type MaintenanceTaskType = 'preventive' | 'corrective' | 'emergency';
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface DAMDevice {
  id: string;
  name: string;
  type: DAMDeviceType;
  status: DAMDeviceStatus;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  metrics: {
    powerOutput?: number;
    energyConsumption?: number;
    temperature?: number;
    efficiency?: number;
    uptime: number;
  };
  lastUpdate: Date;
  maintenanceSchedule: {
    next: Date;
    interval: number; // days
  };
}

export interface MaintenanceTask {
  id: string;
  deviceId: string;
  type: MaintenanceTaskType;
  description: string;
  priority: MaintenancePriority;
  status: TaskStatus;
  assignedTo?: string;
  scheduledDate: Date;
  estimatedDuration: number; // hours
}

// ============================================================================
// STELLAR/SOROBAN TYPES
// ============================================================================

export type SorobanContractType = 'rwa-validator' | 'dam-manager' | 'oracle' | 'custom';
export type ContractStatus = 'active' | 'inactive' | 'pending';
export type TransactionType = 'payment' | 'contract' | 'asset' | 'trust';
export type TransactionStatus = 'pending' | 'success' | 'failed';

export interface SorobanContract {
  contractId: string;
  name: string;
  type: SorobanContractType;
  status: ContractStatus;
  functions: Array<{
    name: string;
    description: string;
    parameters: string[];
  }>;
  lastDeployed: Date;
}

export interface Transaction {
  id: string;
  hash: string;
  type: TransactionType;
  amount?: string;
  asset?: string;
  from: string;
  to: string;
  status: TransactionStatus;
  timestamp: Date;
  fee: string;
}

// ============================================================================
// UI COMPONENT TYPES
// ============================================================================

export interface AgentPanel {
  name: string;
  path: string;
  component: React.ComponentType<any>;
  icon?: string;
  public?: boolean;
  shortLabel?: string;
}

export interface PanelProps {
  agentId: string;
}

export type ViewType = 'chat' | 'rwa' | 'dam' | 'stellar';

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface ElizaConfig {
  agentId: string;
  apiBase: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface FormState {
  [key: string]: any;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
}
