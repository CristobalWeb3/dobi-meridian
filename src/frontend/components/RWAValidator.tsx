import React, { useState } from 'react';

interface RWAValidationData {
  assetId: string;
  assetType: 'solar' | 'wind' | 'real-estate' | 'equipment' | 'other';
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

interface ValidationResult {
  isValid: boolean;
  confidence: number;
  issues: string[];
  recommendations: string[];
  estimatedValue: number;
  riskScore: number;
}

const RWAValidator: React.FC = () => {
  const [validationData, setValidationData] = useState<RWAValidationData>({
    assetId: '',
    assetType: 'solar',
    location: '',
    value: 0,
    currency: 'USD',
    documents: [],
    metadata: {}
  });

  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleInputChange = (field: keyof RWAValidationData, value: any) => {
    setValidationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setValidationData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const validateRWA = async () => {
    setIsValidating(true);
    
    // Simulate validation process
    setTimeout(() => {
      const mockResult: ValidationResult = {
        isValid: Math.random() > 0.3,
        confidence: Math.floor(Math.random() * 40) + 60,
        issues: [
          'Documentación de propiedad incompleta',
          'Falta certificación ambiental'
        ],
        recommendations: [
          'Obtener certificado de propiedad notarizado',
          'Completar evaluación ambiental',
          'Actualizar documentación técnica'
        ],
        estimatedValue: validationData.value * (0.8 + Math.random() * 0.4),
        riskScore: Math.floor(Math.random() * 30) + 20
      };
      
      setValidationResult(mockResult);
      setIsValidating(false);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-4">Validador de RWA</h2>
        <p className="text-gray-400">
          Valida y tokeniza Real-World Assets usando tecnología Stellar y Soroban
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario de Validación */}
        <div className="dobi-card p-6">
          <h3 className="text-xl font-semibold mb-6">Datos del Activo</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">ID del Activo</label>
              <input
                type="text"
                value={validationData.assetId}
                onChange={(e) => handleInputChange('assetId', e.target.value)}
                className="dobi-input w-full"
                placeholder="RWA-SOLAR-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Activo</label>
              <select
                value={validationData.assetType}
                onChange={(e) => handleInputChange('assetType', e.target.value)}
                className="dobi-input w-full"
              >
                <option value="solar">Energía Solar</option>
                <option value="wind">Energía Eólica</option>
                <option value="real-estate">Bienes Raíces</option>
                <option value="equipment">Equipamiento</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ubicación</label>
              <input
                type="text"
                value={validationData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="dobi-input w-full"
                placeholder="Ciudad, País"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Valor</label>
                <input
                  type="number"
                  value={validationData.value}
                  onChange={(e) => handleInputChange('value', parseFloat(e.target.value))}
                  className="dobi-input w-full"
                  placeholder="1000000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Moneda</label>
                <select
                  value={validationData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="dobi-input w-full"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="XLM">XLM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Documentos</label>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="dobi-input w-full"
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
              <p className="text-xs text-gray-400 mt-1">
                Sube documentos de propiedad, certificaciones, etc.
              </p>
            </div>

            <button
              onClick={validateRWA}
              disabled={isValidating || !validationData.assetId}
              className="dobi-button-primary w-full py-3"
            >
              {isValidating ? 'Validando...' : 'Validar Activo'}
            </button>
          </div>
        </div>

        {/* Resultados de Validación */}
        <div className="dobi-card p-6">
          <h3 className="text-xl font-semibold mb-6">Resultados de Validación</h3>
          
          {!validationResult ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-400">
                Completa el formulario y haz clic en "Validar Activo" para ver los resultados
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Estado de Validación */}
              <div className={`p-4 rounded-lg ${validationResult.isValid ? 'bg-green-900' : 'bg-red-900'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">
                    {validationResult.isValid ? '✅ Válido' : '❌ Requiere Revisión'}
                  </span>
                  <span className="text-sm">
                    Confianza: {validationResult.confidence}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${validationResult.isValid ? 'bg-green-400' : 'bg-red-400'}`}
                    style={{ width: `${validationResult.confidence}%` }}
                  ></div>
                </div>
              </div>

              {/* Valor Estimado */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Valor Estimado</h4>
                <p className="text-2xl font-bold text-green-400">
                  ${validationResult.estimatedValue.toLocaleString()} {validationData.currency}
                </p>
                <p className="text-sm text-gray-400">
                  Basado en análisis de mercado y datos del activo
                </p>
              </div>

              {/* Puntuación de Riesgo */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Puntuación de Riesgo</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        validationResult.riskScore < 30 ? 'bg-green-400' :
                        validationResult.riskScore < 60 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${validationResult.riskScore}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{validationResult.riskScore}/100</span>
                </div>
              </div>

              {/* Problemas Identificados */}
              {validationResult.issues.length > 0 && (
                <div className="bg-red-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-red-300">Problemas Identificados</h4>
                  <ul className="space-y-1">
                    {validationResult.issues.map((issue, index) => (
                      <li key={index} className="text-sm text-red-200">• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recomendaciones */}
              {validationResult.recommendations.length > 0 && (
                <div className="bg-blue-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-blue-300">Recomendaciones</h4>
                  <ul className="space-y-1">
                    {validationResult.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-blue-200">• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Acciones */}
              <div className="space-y-2">
                <button className="dobi-button-primary w-full">
                  {validationResult.isValid ? 'Tokenizar en Stellar' : 'Corregir Problemas'}
                </button>
                <button className="dobi-button-secondary w-full">
                  Generar Reporte Detallado
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RWAValidator;
