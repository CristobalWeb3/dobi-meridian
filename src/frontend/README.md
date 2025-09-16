# DOBI Frontend

Frontend para validación de señales de dispositivos y distribución automática de recompensas en la red Stellar usando contratos inteligentes Soroban.

## 🚀 Características

- **Conexión de Wallet**: Integración con Freighter Wallet
- **Validación de Señales**: Validación de señales de dispositivos usando contrato Oracle
- **Distribución de Recompensas**: Distribución automática de XLM usando contrato Rewards
- **Chat con DOBI**: Asistente de análisis para señales inválidas
- **Interfaz Moderna**: Diseño oscuro y responsivo

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Blockchain**: Stellar Network, Soroban Smart Contracts
- **Wallet**: Freighter Wallet API
- **Deploy**: Vercel

## 📋 Contratos Desplegados

- **DobiOracle**: `CDBGL47SEEVMCQAI43CCDYNLC5MRY2TM27PZY3TGYE7SZRQRX56JIUTE`
- **DobiRewards**: `CCUB6RWU6563VVWT24V6HG45WZ6BQPH7PGYLS6JG7ZGDRGJBRWOICJ2U`

## 🔧 Instalación

### Prerrequisitos
- Freighter Wallet instalado en el navegador
- Cuenta en Stellar Testnet con XLM para fees

### Desarrollo Local
```bash
# Clonar repositorio
git clone <tu-repo-url>
cd dobi-frontend

# Instalar dependencias (opcional)
npm install

# Servidor local
python -m http.server 8000

# Abrir en navegador
http://localhost:8000
```

## 🚀 Deploy en Vercel

### Opción 1: Deploy Automático
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Opción 2: Deploy Manual
1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Importa tu repositorio
4. Deploy

## 📁 Estructura del Proyecto

```
frontend/
├── js/
│   ├── app.js              # Lógica principal de la aplicación
│   ├── wallet.js           # Gestión de wallet Freighter
│   └── soroban-contracts.js # Interacciones con contratos
├── index.html              # Archivo principal
├── index.css               # Estilos
├── .env.example            # Variables de entorno (template)
├── vercel.json             # Configuración de Vercel
└── package.json            # Metadatos del proyecto
```

## 🔧 Configuración

### Variables de Entorno
Copia `.env.example` a `.env` y configura:

```env
# Red Stellar
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_RPC=https://soroban-testnet.stellar.org

# IDs de Contratos
NEXT_PUBLIC_ORACLE_ID=CDBGL47SEEVMCQAI43CCDYNLC5MRY2TM27PZY3TGYE7SZRQRX56JIUTE
NEXT_PUBLIC_REWARDS_ID=CCUB6RWU6563VVWT24V6HG45WZ6BQPH7PGYLS6JG7ZGDRGJBRWOICJ2U
```

## 🎯 Uso

### 1. Conectar Wallet
- Click en "Connect wallet"
- Autorizar en Freighter
- Verificar conexión

### 2. Enviar Señales
- **VALID**: Envía señal válida para validación
- **INVALID**: Envía señal inválida para testing

### 3. Distribuir Recompensas
- Botón se desbloquea tras validación exitosa
- Distribuye XLM automáticamente

### 4. Chat con DOBI
- Análisis automático de señales inválidas
- Recomendaciones y troubleshooting

## 🔍 Funcionalidades Técnicas

### Validación de Señales
- Hash de datos del dispositivo
- Validación en contrato Oracle
- Fallback a mock para testing

### Distribución de Recompensas
- Cálculo automático de recompensas
- Distribución a operador y comunidad
- Transacciones en Stellar testnet

### Gestión de Wallet
- Conexión/desconexión automática
- Monitoreo de estado
- Manejo de errores

## 🐛 Troubleshooting

### Wallet no conecta
- Verificar que Freighter esté instalado
- Verificar que esté en testnet
- Refrescar página

### Contratos no responden
- Verificar IDs en `.env`
- Verificar conectividad a Stellar
- Revisar consola del navegador

### Deploy falla
- Verificar `vercel.json`
- Verificar que no hay archivos sensibles
- Revisar logs de Vercel

## 📊 Estado del Proyecto

- ✅ **Frontend**: Completado
- ✅ **Wallet Integration**: Funcional
- ✅ **Smart Contracts**: Desplegados en testnet
- ✅ **Deploy**: Configurado para Vercel
- ✅ **Testing**: Mock mode disponible

## 🔗 Enlaces Útiles

- **Stellar Expert**: [Ver contratos](https://stellar.expert/explorer/testnet)
- **Freighter Wallet**: [Instalar](https://freighter.app)
- **Soroban Docs**: [Documentación](https://soroban.stellar.org)

## 📝 Licencia

MIT License - Ver archivo LICENSE para detalles.