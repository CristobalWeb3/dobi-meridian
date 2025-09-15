import React, { useState, useEffect } from 'react';

interface StellarAccount {
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

interface SorobanContract {
  contractId: string;
  name: string;
  type: 'rwa-validator' | 'dam-manager' | 'oracle' | 'custom';
  status: 'active' | 'inactive' | 'pending';
  functions: Array<{
    name: string;
    description: string;
    parameters: string[];
  }>;
  lastDeployed: Date;
}

interface Transaction {
  id: string;
  hash: string;
  type: 'payment' | 'contract' | 'asset' | 'trust';
  amount?: string;
  asset?: string;
  from: string;
  to: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: Date;
  fee: string;
}

const StellarIntegration: React.FC = () => {
  const [account, setAccount] = useState<StellarAccount | null>(null);
  const [contracts, setContracts] = useState<SorobanContract[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContract, setSelectedContract] = useState<SorobanContract | null>(null);

  // Mock data initialization
  useEffect(() => {
    const mockAccount: StellarAccount = {
      address: 'GABC1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      balance: '1000.0000000',
      sequence: '123456789',
      subentryCount: 5,
      flags: {
        authRequired: false,
        authRevocable: true,
        authImmutable: false
      },
      assets: [
        {
          code: 'USDC',
          issuer: 'GDUKMGUGDZQK6YHYA5Z6AY2G4XDSZPSZ3SW5UN3ARVMO6QSRDWP5YLEX',
          balance: '500.0000000',
          limit: '10000.0000000'
        },
        {
          code: 'DOBI',
          issuer: 'GABC1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
          balance: '10000.0000000'
        }
      ]
    };

    const mockContracts: SorobanContract[] = [
      {
        contractId: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAHHXCN3A3M',
        name: 'RWA Validator Contract',
        type: 'rwa-validator',
        status: 'active',
        functions: [
          {
            name: 'validate_asset',
            description: 'Valida un Real-World Asset',
            parameters: ['asset_id', 'metadata', 'value']
          },
          {
            name: 'mint_token',
            description: 'Emite tokens para un RWA validado',
            parameters: ['asset_id', 'amount', 'recipient']
          }
        ],
        lastDeployed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        contractId: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAHHXCN3A3N',
        name: 'DAM Manager Contract',
        type: 'dam-manager',
        status: 'active',
        functions: [
          {
            name: 'register_device',
            description: 'Registra un nuevo dispositivo DAM',
            parameters: ['device_id', 'location', 'specifications']
          },
          {
            name: 'update_metrics',
            description: 'Actualiza métricas del dispositivo',
            parameters: ['device_id', 'metrics']
          }
        ],
        lastDeployed: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      }
    ];

    const mockTransactions: Transaction[] = [
      {
        id: '1',
        hash: 'abc123def456ghi789jkl012mno345pqr678stu901vwx234yz',
        type: 'contract',
        from: 'GABC1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        to: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAHHXCN3A3M',
        status: 'success',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        fee: '0.0000100'
      },
      {
        id: '2',
        hash: 'def456ghi789jkl012mno345pqr678stu901vwx234yzabc123',
        type: 'payment',
        amount: '100.0000000',
        asset: 'USDC',
        from: 'GABC1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        to: 'GDEF9876543210ZYXWVUTSRQPONMLKJIHGFEDCBA',
        status: 'success',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        fee: '0.0000100'
      }
    ];

    setAccount(mockAccount);
    setContracts(mockContracts);
    setTransactions(mockTransactions);
  }, []);

  const connectWallet = async () => {
    setIsLoading(true);
    // Simulate wallet connection
    setTimeout(() => {
      setIsLoading(false);
      // In real implementation, this would connect to Freighter or other Stellar wallet
    }, 2000);
  };

  const deployContract = async (contractType: string) => {
    setIsLoading(true);
    // Simulate contract deployment
    setTimeout(() => {
      const newContract: SorobanContract = {
        contractId: `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAHHXCN3A3${Math.random().toString(36).substr(2, 1).toUpperCase()}`,
        name: `${contractType} Contract`,
        type: contractType as any,
        status: 'active',
        functions: [],
        lastDeployed: new Date()
      };
      setContracts(prev => [...prev, newContract]);
      setIsLoading(false);
    }, 3000);
  };

  const executeContractFunction = async (contractId: string, functionName: string, parameters: any[]) => {
    setIsLoading(true);
    // Simulate function execution
    setTimeout(() => {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        hash: Math.random().toString(36).substr(2, 64),
        type: 'contract',
        from: account?.address || '',
        to: contractId,
        status: 'success',
        timestamp: new Date(),
        fee: '0.0000100'
      };
      setTransactions(prev => [newTransaction, ...prev]);
      setIsLoading(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'inactive': return 'text-red-400';
      case 'pending': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🟢';
      case 'inactive': return '🔴';
      case 'pending': return '🟡';
      case 'success': return '✅';
      case 'failed': return '❌';
      default: return '⚪';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-900 text-white">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-4">Integración Stellar/Soroban</h2>
        <p className="text-gray-400">
          Gestiona tu cuenta Stellar y ejecuta contratos inteligentes Soroban
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cuenta Stellar */}
        <div className="dobi-card p-6">
          <h3 className="text-xl font-semibold mb-6">Cuenta Stellar</h3>
          
          {!account ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🔗</div>
              <p className="text-gray-400 mb-4">Conecta tu wallet para comenzar</p>
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="dobi-button-primary"
              >
                {isLoading ? 'Conectando...' : 'Conectar Wallet'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Dirección</label>
                <p className="font-mono text-sm break-all">{account.address}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Balance XLM</label>
                  <p className="text-lg font-semibold">{account.balance} XLM</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Secuencia</label>
                  <p className="text-lg font-semibold">{account.sequence}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400">Activos</label>
                <div className="space-y-2 mt-2">
                  {account.assets.map((asset, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-800 rounded">
                      <span className="font-medium">{asset.code}</span>
                      <span className="text-sm">{asset.balance}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contratos Soroban */}
        <div className="lg:col-span-2">
          <div className="dobi-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Contratos Soroban</h3>
              <div className="space-x-2">
                <button
                  onClick={() => deployContract('rwa-validator')}
                  disabled={isLoading}
                  className="dobi-button-secondary text-sm"
                >
                  Deploy RWA Validator
                </button>
                <button
                  onClick={() => deployContract('dam-manager')}
                  disabled={isLoading}
                  className="dobi-button-secondary text-sm"
                >
                  Deploy DAM Manager
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {contracts.map((contract) => (
                <div
                  key={contract.contractId}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedContract?.contractId === contract.contractId
                      ? 'border-purple-500 bg-purple-900/20'
                      : 'border-gray-700 bg-gray-800 hover:bg-gray-750'
                  }`}
                  onClick={() => setSelectedContract(contract)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{contract.name}</h4>
                      <p className="text-sm text-gray-400 font-mono">{contract.contractId}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getStatusIcon(contract.status)}</span>
                      <span className={`text-sm font-medium ${getStatusColor(contract.status)}`}>
                        {contract.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Tipo</p>
                      <p className="font-semibold">{contract.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Desplegado</p>
                      <p className="font-semibold">{contract.lastDeployed.toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm text-gray-400 mb-2">Funciones disponibles:</p>
                    <div className="flex flex-wrap gap-2">
                      {contract.functions.map((func, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-700 rounded text-xs"
                        >
                          {func.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detalles del Contrato Seleccionado */}
          {selectedContract && (
            <div className="dobi-card p-6 mt-6">
              <h3 className="text-xl font-semibold mb-4">Detalles del Contrato</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Funciones</h4>
                  <div className="space-y-3">
                    {selectedContract.functions.map((func, index) => (
                      <div key={index} className="p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{func.name}</span>
                          <button
                            onClick={() => executeContractFunction(selectedContract.contractId, func.name, [])}
                            disabled={isLoading}
                            className="dobi-button-primary text-xs px-3 py-1"
                          >
                            Ejecutar
                          </button>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{func.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {func.parameters.map((param, paramIndex) => (
                            <span
                              key={paramIndex}
                              className="px-2 py-1 bg-gray-700 rounded text-xs"
                            >
                              {param}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transacciones Recientes */}
      <div className="dobi-card p-6 mt-6">
        <h3 className="text-xl font-semibold mb-6">Transacciones Recientes</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2">Hash</th>
                <th className="text-left py-2">Tipo</th>
                <th className="text-left py-2">De</th>
                <th className="text-left py-2">Para</th>
                <th className="text-left py-2">Estado</th>
                <th className="text-left py-2">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-800">
                  <td className="py-2 font-mono text-sm">{tx.hash.substring(0, 16)}...</td>
                  <td className="py-2 text-sm">{tx.type}</td>
                  <td className="py-2 font-mono text-sm">{tx.from.substring(0, 8)}...</td>
                  <td className="py-2 font-mono text-sm">{tx.to.substring(0, 8)}...</td>
                  <td className="py-2">
                    <span className={`text-sm font-medium ${getStatusColor(tx.status)}`}>
                      {getStatusIcon(tx.status)} {tx.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2 text-sm">{tx.timestamp.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StellarIntegration;
