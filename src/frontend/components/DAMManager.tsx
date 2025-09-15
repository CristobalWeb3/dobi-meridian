import React, { useState, useEffect } from 'react';

interface DAMDevice {
  id: string;
  name: string;
  type: 'charging-station' | 'solar-panel' | 'wind-turbine' | 'sensor' | 'other';
  status: 'online' | 'offline' | 'maintenance' | 'error';
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

interface MaintenanceTask {
  id: string;
  deviceId: string;
  type: 'preventive' | 'corrective' | 'emergency';
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo?: string;
  scheduledDate: Date;
  estimatedDuration: number; // hours
}

const DAMManager: React.FC = () => {
  const [devices, setDevices] = useState<DAMDevice[]>([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<DAMDevice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data initialization
  useEffect(() => {
    const mockDevices: DAMDevice[] = [
      {
        id: 'DAM-001',
        name: 'EV Charging Station Alpha',
        type: 'charging-station',
        status: 'online',
        location: {
          lat: 40.7128,
          lng: -74.0060,
          address: 'New York, NY'
        },
        metrics: {
          powerOutput: 150,
          energyConsumption: 120,
          temperature: 25,
          efficiency: 92,
          uptime: 99.5
        },
        lastUpdate: new Date(),
        maintenanceSchedule: {
          next: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          interval: 30
        }
      },
      {
        id: 'DAM-002',
        name: 'Solar Farm Beta',
        type: 'solar-panel',
        status: 'online',
        location: {
          lat: 34.0522,
          lng: -118.2437,
          address: 'Los Angeles, CA'
        },
        metrics: {
          powerOutput: 2500,
          energyConsumption: 0,
          temperature: 28,
          efficiency: 88,
          uptime: 98.2
        },
        lastUpdate: new Date(),
        maintenanceSchedule: {
          next: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          interval: 45
        }
      },
      {
        id: 'DAM-003',
        name: 'Wind Turbine Gamma',
        type: 'wind-turbine',
        status: 'maintenance',
        location: {
          lat: 41.8781,
          lng: -87.6298,
          address: 'Chicago, IL'
        },
        metrics: {
          powerOutput: 0,
          energyConsumption: 5,
          temperature: 15,
          efficiency: 0,
          uptime: 85.7
        },
        lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000),
        maintenanceSchedule: {
          next: new Date(),
          interval: 60
        }
      }
    ];

    const mockTasks: MaintenanceTask[] = [
      {
        id: 'TASK-001',
        deviceId: 'DAM-003',
        type: 'preventive',
        description: 'Limpieza de aspas y revisión de sistema de frenado',
        priority: 'medium',
        status: 'in-progress',
        assignedTo: 'Técnico Juan Pérez',
        scheduledDate: new Date(),
        estimatedDuration: 4
      },
      {
        id: 'TASK-002',
        deviceId: 'DAM-001',
        type: 'preventive',
        description: 'Calibración de medidores y verificación de conectores',
        priority: 'low',
        status: 'pending',
        scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        estimatedDuration: 2
      }
    ];

    setDevices(mockDevices);
    setMaintenanceTasks(mockTasks);
    setIsLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'offline': return 'text-red-400';
      case 'maintenance': return 'text-yellow-400';
      case 'error': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return '🟢';
      case 'offline': return '🔴';
      case 'maintenance': return '🟡';
      case 'error': return '🔴';
      default: return '⚪';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-600';
      case 'medium': return 'bg-yellow-600';
      case 'high': return 'bg-orange-600';
      case 'critical': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-900 text-white">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-4">Gestor de DAMs</h2>
        <p className="text-gray-400">
          Monitorea y gestiona tus Decentralized Autonomous Machines en tiempo real
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Dispositivos */}
        <div className="lg:col-span-2">
          <div className="dobi-card p-6">
            <h3 className="text-xl font-semibold mb-6">Dispositivos Conectados</h3>
            
            <div className="space-y-4">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedDevice?.id === device.id
                      ? 'border-purple-500 bg-purple-900/20'
                      : 'border-gray-700 bg-gray-800 hover:bg-gray-750'
                  }`}
                  onClick={() => setSelectedDevice(device)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {device.type === 'charging-station' ? '🔌' :
                         device.type === 'solar-panel' ? '☀️' :
                         device.type === 'wind-turbine' ? '🌪️' : '📡'}
                      </span>
                      <div>
                        <h4 className="font-semibold">{device.name}</h4>
                        <p className="text-sm text-gray-400">{device.location.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getStatusIcon(device.status)}</span>
                      <span className={`text-sm font-medium ${getStatusColor(device.status)}`}>
                        {device.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Potencia</p>
                      <p className="font-semibold">{device.metrics.powerOutput || 0} kW</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Eficiencia</p>
                      <p className="font-semibold">{device.metrics.efficiency || 0}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Uptime</p>
                      <p className="font-semibold">{device.metrics.uptime}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Temperatura</p>
                      <p className="font-semibold">{device.metrics.temperature}°C</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel de Detalles */}
        <div className="space-y-6">
          {/* Detalles del Dispositivo Seleccionado */}
          {selectedDevice && (
            <div className="dobi-card p-6">
              <h3 className="text-xl font-semibold mb-4">Detalles del Dispositivo</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Estado Actual</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getStatusIcon(selectedDevice.status)}</span>
                    <span className={`font-medium ${getStatusColor(selectedDevice.status)}`}>
                      {selectedDevice.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Métricas en Tiempo Real</h4>
                  <div className="space-y-2">
                    {selectedDevice.metrics.powerOutput && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Potencia:</span>
                        <span className="font-semibold">{selectedDevice.metrics.powerOutput} kW</span>
                      </div>
                    )}
                    {selectedDevice.metrics.efficiency && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Eficiencia:</span>
                        <span className="font-semibold">{selectedDevice.metrics.efficiency}%</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Uptime:</span>
                      <span className="font-semibold">{selectedDevice.metrics.uptime}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Temperatura:</span>
                      <span className="font-semibold">{selectedDevice.metrics.temperature}°C</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Próximo Mantenimiento</h4>
                  <p className="text-sm text-gray-400">
                    {selectedDevice.maintenanceSchedule.next.toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-2">
                  <button className="dobi-button-primary w-full text-sm">
                    Ver Detalles Completos
                  </button>
                  <button className="dobi-button-secondary w-full text-sm">
                    Programar Mantenimiento
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tareas de Mantenimiento */}
          <div className="dobi-card p-6">
            <h3 className="text-xl font-semibold mb-4">Tareas de Mantenimiento</h3>
            
            <div className="space-y-3">
              {maintenanceTasks.map((task) => (
                <div key={task.id} className="p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{task.deviceId}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{task.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{task.scheduledDate.toLocaleDateString()}</span>
                    <span>{task.estimatedDuration}h</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="dobi-button-primary w-full mt-4 text-sm">
              Nueva Tarea
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DAMManager;
