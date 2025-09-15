# DOBI Frontend

Frontend moderno para el bot DOBI, especializado en Real-World Assets (RWA) y Decentralized Autonomous Machines (DAMs) en la red Stellar.

## 📁 Estructura del Proyecto

```
src/frontend/
├── components/           # Componentes React organizados por funcionalidad
│   ├── chat/            # Componentes del chat
│   │   ├── ChatInterface.tsx
│   │   ├── ChatMessage.tsx
│   │   └── ChatInput.tsx
│   ├── common/          # Componentes reutilizables
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── StatusBadge.tsx
│   ├── layout/          # Componentes de layout
│   │   └── Header.tsx
│   ├── RWAValidator.tsx # Validador de RWA
│   ├── DAMManager.tsx   # Gestor de DAMs
│   └── StellarIntegration.tsx # Integración Stellar/Soroban
├── hooks/               # Custom hooks
│   ├── useDobiChat.ts
│   └── useStellarAccount.ts
├── types/               # Definiciones de tipos TypeScript
│   └── index.ts
├── utils/               # Utilidades y helpers
│   ├── constants.ts
│   └── helpers.ts
├── index.tsx           # Punto de entrada principal
├── index.css           # Estilos globales
└── index.html          # Template HTML
```

## 🎯 Características Principales

### 1. **Chat Interface**
- Conversación inteligente con DOBI
- Respuestas contextuales sobre RWAs, DAMs y Stellar
- Interfaz moderna con animaciones

### 2. **Validador de RWA**
- Formulario completo para validar activos del mundo real
- Análisis de confianza y puntuación de riesgo
- Soporte para múltiples tipos de activos
- Generación de reportes

### 3. **Gestor de DAMs**
- Monitoreo en tiempo real de dispositivos
- Dashboard con métricas de rendimiento
- Sistema de mantenimiento programado
- Gestión de tareas y alertas

### 4. **Integración Stellar/Soroban**
- Conexión con wallet Stellar
- Gestión de contratos inteligentes
- Ejecución de funciones de contrato
- Historial de transacciones

## 🛠️ Tecnologías Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **TanStack Query** - Gestión de estado del servidor
- **Vite** - Build tool y dev server

## 📋 Convenciones de Código

### Estructura de Componentes
```typescript
// 1. Imports
import React from 'react';
import { ComponentProps } from '../types';

// 2. Interface del componente
interface ComponentProps {
  // props aquí
}

// 3. Componente principal
const Component: React.FC<ComponentProps> = ({ ...props }) => {
  // hooks
  // handlers
  // render
};

// 4. Export
export default Component;
```

### Naming Conventions
- **Componentes**: PascalCase (`ChatInterface`)
- **Hooks**: camelCase con prefijo `use` (`useDobiChat`)
- **Archivos**: PascalCase para componentes, camelCase para utilidades
- **Carpetas**: kebab-case (`chat-interface`)

### Estructura de Carpetas
- **components/**: Organizados por funcionalidad
- **hooks/**: Custom hooks reutilizables
- **types/**: Definiciones de tipos centralizadas
- **utils/**: Funciones de utilidad y constantes

## 🎨 Sistema de Diseño

### Colores
- **Primary**: Purple (#8B5CF6)
- **Secondary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Componentes Base
- **Button**: Variantes primary, secondary, outline, ghost, danger
- **Card**: Variantes default, elevated, outlined, filled
- **StatusBadge**: Indicadores de estado con colores y iconos
- **LoadingSpinner**: Indicadores de carga en diferentes tamaños

## 🔧 Desarrollo

### Instalación
```bash
npm install
```

### Desarrollo
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## 📝 Próximas Mejoras

1. **Integración Real con APIs**
   - Conectar con backend DOBI
   - Integrar con Stellar Horizon API
   - Implementar autenticación

2. **Funcionalidades Adicionales**
   - Dashboard de analytics
   - Notificaciones en tiempo real
   - Modo offline

3. **Optimizaciones**
   - Lazy loading de componentes
   - Memoización de componentes pesados
   - Optimización de bundle

## 🤝 Contribución

1. Sigue las convenciones de código establecidas
2. Añade tipos TypeScript para todas las props
3. Documenta componentes complejos
4. Escribe tests para nuevas funcionalidades
5. Mantén la estructura de carpetas organizada
