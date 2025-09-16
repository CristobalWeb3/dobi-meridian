# DOBI Agent -

## Descripción

DOBI (Digital Object Business Intelligence) es un agente de IA innovador que integra tecnologías avanzadas para la validación de Real World Assets (RWAs), gestión de Digital Asset Managers (DAMs) y integración con la red Stellar/Soroban.

## Características Principales

- 🤖 **Agente de IA ElizaOS**: Integración completa con el framework ElizaOS
- 🏗️ **Validación de RWAs**: Sistema avanzado para validar activos del mundo real
- 🤖 **Gestión de DAMs**: Administración de Digital Asset Managers
- ⭐ **Integración Stellar/Soroban**: Conectividad con la blockchain Stellar
- 🎨 **Frontend Moderno**: Interfaz React con Tailwind CSS
- 🔒 **Seguridad**: Validación y autenticación robusta

## Tecnologías

- **Backend**: Bun + SQLite
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **Blockchain**: Stellar/Soroban
- **Testing**: Bun Test + Cypress
- **Build**: Vite + Bun

## Instalación

```bash
# Instalar dependencias
bun install

# Configurar variables de entorno
cp dobi.env.example dobi.env
# Editar dobi.env con tus configuraciones

# Ejecutar en modo desarrollo
bun run dev

# Ejecutar tests
bun test

# Construir para producción
bun run build
```

## Estructura del Proyecto

```
src/
├── frontend/           # Aplicación React frontend
│   ├── components/     # Componentes React
│   ├── hooks/         # Custom hooks
│   ├── types/         # Definiciones TypeScript
│   └── utils/         # Utilidades
├── character.ts       # Configuración del personaje DOBI
├── index.ts          # Punto de entrada principal
└── plugin.ts         # Plugin de ElizaOS
```

## Configuración

### Variables de Entorno

Copia `dobi.env.example` a `dobi.env` y configura:

```env
# Configuración del agente
AGENT_NAME=DOBI
AGENT_DESCRIPTION=Digital Object Business Intelligence Agent

# APIs y servicios
STELLAR_NETWORK=testnet
SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

# Configuración de base de datos
DATABASE_URL=sqlite:./eliza.db
```

## Desarrollo

### Comandos Disponibles

```bash
bun run dev          # Modo desarrollo
bun run build        # Construir proyecto
bun run test         # Ejecutar tests
bun run lint         # Linting
bun run type-check   # Verificación de tipos
```

### Testing

```bash
# Tests unitarios
bun test

# Tests E2E con Cypress
bun run cy:run

# Tests con coverage
bun run test:coverage
```

## Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

Para preguntas o soporte, contacta al equipo de desarrollo.

---

**DOBI** - Transformando la gestión de activos digitales a través de la inteligencia artificial.
