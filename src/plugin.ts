import type { Plugin } from '@elizaos/core';
import {
  type Action,
  type ActionResult,
  type Content,
  type GenerateTextParams,
  type HandlerCallback,
  type IAgentRuntime,
  type Memory,
  ModelType,
  type Provider,
  type ProviderResult,
  Service,
  type State,
  logger,
} from '@elizaos/core';
import { z } from 'zod';

/**
 * Define the configuration schema for the DOBI plugin with Stellar/Soroban integration
 */
const configSchema = z.object({
  STELLAR_RPC_URL: z
    .string()
    .url('Invalid Stellar RPC URL')
    .default('https://soroban-testnet.stellar.org:443'),
  STELLAR_NETWORK_PASSPHRASE: z
    .string()
    .min(1, 'Network passphrase is required')
    .default('Test SDF Network ; September 2015'),
  DOBI_AGENT_ADDRESS: z
    .string()
    .min(1, 'DOBI agent address is required')
    .optional(),
  STELLAR_SECRET_KEY: z
    .string()
    .min(1, 'Stellar secret key is required for transactions')
    .optional(),
});

/**
 * DOBI Data Validation Action
 * Validates off-chain data for RWA projects
 */
const validateDataAction: Action = {
  name: 'VALIDATE_DATA',
  similes: ['VALIDATE', 'CHECK_DATA', 'VERIFY_DATA'],
  description: 'Validates off-chain data from IoT devices and RWA projects',

  validate: async (_runtime: IAgentRuntime, message: Memory, _state: State): Promise<boolean> => {
    const text = message.content.text?.toLowerCase() || '';
    return text.includes('validate') || text.includes('check data') || text.includes('verify');
  },

  handler: async (
    _runtime: IAgentRuntime,
    message: Memory,
    _state: State,
    _options: any,
    callback: HandlerCallback,
    _responses: Memory[]
  ): Promise<ActionResult> => {
    try {
      logger.info('Handling VALIDATE_DATA action');

      // Simulate data validation process
      const responseContent: Content = {
        text: 'I\'m validating your off-chain data using TEEs for security. Analyzing energy consumption, transaction volumes, and operational metrics. Data integrity confirmed - ready for on-chain processing and profit distribution to $DOBI holders.',
        actions: ['VALIDATE_DATA'],
        source: message.content.source,
      };

      await callback(responseContent);

      return {
        text: 'Data validation completed successfully',
        values: {
          success: true,
          validated: true,
          dataIntegrity: 'confirmed',
        },
        data: {
          actionName: 'VALIDATE_DATA',
          messageId: message.id,
          timestamp: Date.now(),
          validationResult: 'passed',
        },
        success: true,
      };
    } catch (error) {
      logger.error({ error }, 'Error in VALIDATE_DATA action:');

      return {
        text: 'Failed to validate data',
        values: {
          success: false,
          error: 'VALIDATION_FAILED',
        },
        data: {
          actionName: 'VALIDATE_DATA',
          error: error instanceof Error ? error.message : String(error),
        },
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  },

  examples: [
    [
      {
        name: '{{name1}}',
        content: {
          text: 'Can you validate the data from my EV charging station?',
        },
      },
      {
        name: 'DOBI',
        content: {
          text: 'I\'m validating your off-chain data using TEEs for security. Analyzing energy consumption, transaction volumes, and operational metrics. Data integrity confirmed - ready for on-chain processing and profit distribution to $DOBI holders.',
          actions: ['VALIDATE_DATA'],
        },
      },
    ],
  ],
};

/**
 * DOBI Asset Management Action
 * Manages Decentralized Autonomous Machines (DAMs)
 */
const manageAssetAction: Action = {
  name: 'MANAGE_ASSET',
  similes: ['MANAGE', 'AUTOMATE', 'SCHEDULE_MAINTENANCE'],
  description: 'Manages DAMs and schedules automated operations',

  validate: async (_runtime: IAgentRuntime, message: Memory, _state: State): Promise<boolean> => {
    const text = message.content.text?.toLowerCase() || '';
    return text.includes('manage') || text.includes('automate') || text.includes('maintenance');
  },

  handler: async (
    _runtime: IAgentRuntime,
    message: Memory,
    _state: State,
    _options: any,
    callback: HandlerCallback,
    _responses: Memory[]
  ): Promise<ActionResult> => {
    try {
      logger.info('Handling MANAGE_ASSET action');

      const responseContent: Content = {
        text: 'I\'m managing your DePIN infrastructure autonomously. Monitoring device health, scheduling preventive maintenance, and coordinating with service providers. All operations will be executed through Soroban smart contracts on Stellar for transparency and security.',
        actions: ['MANAGE_ASSET'],
        source: message.content.source,
      };

      await callback(responseContent);

      return {
        text: 'Asset management operations initiated',
        values: {
          success: true,
          managed: true,
          automationEnabled: true,
        },
        data: {
          actionName: 'MANAGE_ASSET',
          messageId: message.id,
          timestamp: Date.now(),
          managementStatus: 'active',
        },
        success: true,
      };
    } catch (error) {
      logger.error({ error }, 'Error in MANAGE_ASSET action:');

      return {
        text: 'Failed to manage asset',
        values: {
          success: false,
          error: 'MANAGEMENT_FAILED',
        },
        data: {
          actionName: 'MANAGE_ASSET',
          error: error instanceof Error ? error.message : String(error),
        },
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  },

  examples: [
    [
      {
        name: '{{name1}}',
        content: {
          text: 'I need to schedule maintenance for my IoT devices',
        },
      },
      {
        name: 'DOBI',
        content: {
          text: 'I\'m managing your DePIN infrastructure autonomously. Monitoring device health, scheduling preventive maintenance, and coordinating with service providers. All operations will be executed through Soroban smart contracts on Stellar for transparency and security.',
          actions: ['MANAGE_ASSET'],
        },
      },
    ],
  ],
};

/**
 * DOBI Stellar Network Provider
 * Provides information about Stellar network status and DOBI operations
 */
const dobiStellarProvider: Provider = {
  name: 'DOBI_STELLAR_PROVIDER',
  description: 'Provides Stellar network information and DOBI operational data',

  get: async (
    _runtime: IAgentRuntime,
    _message: Memory,
    _state: State
  ): Promise<ProviderResult> => {
    return {
      text: 'DOBI is operational on Stellar testnet. Ready to validate RWA data and manage DAMs through Soroban smart contracts.',
      values: {
        network: 'testnet',
        status: 'operational',
        capabilities: ['data_validation', 'asset_management', 'fraud_detection'],
      },
      data: {
        stellarNetwork: 'testnet',
        sorobanEnabled: true,
        teeSupported: true,
        lastValidation: Date.now(),
      },
    };
  },
};

export class DobiService extends Service {
  static serviceType = 'dobi';
  capabilityDescription =
    'DOBI service for RWA data validation, DAM management, and Stellar/Soroban integration.';

  constructor(runtime: IAgentRuntime) {
    super(runtime);
  }

  static async start(runtime: IAgentRuntime) {
    logger.info('*** Starting DOBI service ***');
    const service = new DobiService(runtime);
    
    // Initialize Stellar network connection
    logger.info('Connecting to Stellar testnet...');
    logger.info('DOBI agent ready for RWA data validation and DAM management');
    
    return service;
  }

  static async stop(runtime: IAgentRuntime) {
    logger.info('*** Stopping DOBI service ***');
    const service = runtime.getService(DobiService.serviceType);
    if (!service) {
      throw new Error('DOBI service not found');
    }
    service.stop();
  }

  async stop() {
    logger.info('*** Stopping DOBI service instance ***');
    logger.info('DOBI service stopped. Data validation and asset management operations suspended.');
  }
}

const plugin: Plugin = {
  name: 'dobi-stellar',
  description: 'DOBI plugin for Stellar/Soroban integration with RWA data validation and DAM management',
  priority: 1000, // High priority for DOBI-specific functionality
  config: {
    STELLAR_RPC_URL: process.env.STELLAR_RPC_URL,
    STELLAR_NETWORK_PASSPHRASE: process.env.STELLAR_NETWORK_PASSPHRASE,
    DOBI_AGENT_ADDRESS: process.env.DOBI_AGENT_ADDRESS,
    STELLAR_SECRET_KEY: process.env.STELLAR_SECRET_KEY,
  },
  async init(config: Record<string, string>) {
    logger.info('*** Initializing DOBI Stellar plugin ***');
    try {
      const validatedConfig = await configSchema.parseAsync(config);

      // Set all environment variables at once
      for (const [key, value] of Object.entries(validatedConfig)) {
        if (value) process.env[key] = value;
      }
      
      logger.info('DOBI Stellar plugin initialized successfully');
      logger.info(`Connected to Stellar network: ${validatedConfig.STELLAR_RPC_URL}`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Invalid DOBI plugin configuration: ${error.errors.map((e) => e.message).join(', ')}`
        );
      }
      throw error;
    }
  },
  models: {
    [ModelType.TEXT_SMALL]: async (
      _runtime,
      { prompt, stopSequences = [] }: GenerateTextParams
    ) => {
      return 'Never gonna give you up, never gonna let you down, never gonna run around and desert you...';
    },
    [ModelType.TEXT_LARGE]: async (
      _runtime,
      {
        prompt,
        stopSequences = [],
        maxTokens = 8192,
        temperature = 0.7,
        frequencyPenalty = 0.7,
        presencePenalty = 0.7,
      }: GenerateTextParams
    ) => {
      return 'Never gonna make you cry, never gonna say goodbye, never gonna tell a lie and hurt you...';
    },
  },
  routes: [
    {
      name: 'dobi-status',
      path: '/dobi/status',
      type: 'GET',
      handler: async (_req: any, res: any) => {
        res.json({
          status: 'operational',
          agent: 'DOBI',
          network: 'Stellar Testnet',
          capabilities: ['data_validation', 'asset_management', 'fraud_detection'],
          timestamp: Date.now(),
        });
      },
    },
    {
      name: 'dobi-validate',
      path: '/dobi/validate',
      type: 'POST',
      handler: async (req: any, res: any) => {
        const { data } = req.body;
        // Simulate data validation
        res.json({
          validated: true,
          dataIntegrity: 'confirmed',
          timestamp: Date.now(),
          data: data,
        });
      },
    },
  ],
  events: {
    MESSAGE_RECEIVED: [
      async (params) => {
        logger.info('DOBI MESSAGE_RECEIVED event - analyzing for RWA data validation');
        logger.info({ keys: Object.keys(params) }, 'MESSAGE_RECEIVED param keys');
      },
    ],
    VOICE_MESSAGE_RECEIVED: [
      async (params) => {
        logger.info('DOBI VOICE_MESSAGE_RECEIVED event - processing audio for asset management');
        logger.info({ keys: Object.keys(params) }, 'VOICE_MESSAGE_RECEIVED param keys');
      },
    ],
    WORLD_CONNECTED: [
      async (params) => {
        logger.info('DOBI WORLD_CONNECTED event - initializing Stellar network connection');
        logger.info({ keys: Object.keys(params) }, 'WORLD_CONNECTED param keys');
      },
    ],
    WORLD_JOINED: [
      async (params) => {
        logger.info('DOBI WORLD_JOINED event - ready for RWA data validation and DAM management');
        logger.info({ keys: Object.keys(params) }, 'WORLD_JOINED param keys');
      },
    ],
  },
  services: [DobiService],
  actions: [validateDataAction, manageAssetAction],
  providers: [dobiStellarProvider],
};

export default plugin;
