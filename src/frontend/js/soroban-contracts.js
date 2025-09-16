// Soroban Smart Contracts Integration for DOBI
// Handles all interactions with deployed smart contracts

import { CONTRACT_ADDRESSES, NETWORK_CONFIG, CURRENT_NETWORK } from '../web3-config.js';

class SorobanContractManager {
    constructor() {
        this.initialized = false;
        this.sorobanServer = null;
        this.horizonServer = null;
        this.server = null; // Backward compatibility
        
        // Contract addresses
        this.oracleContractId = CONTRACT_ADDRESSES.DOBI_ORACLE;
        this.rewardsContractId = CONTRACT_ADDRESSES.DOBI_REWARDS;
        
        // Network configuration
        this.networkConfig = NETWORK_CONFIG[CURRENT_NETWORK];
        this.networkPassphrase = this.networkConfig.networkPassphrase;
        
        // Force real contracts by default
        this.forceRealContracts = true;
        
        console.log('🔍 SorobanContractManager initialized');
        console.log('🔍 Oracle Contract ID:', this.oracleContractId);
        console.log('🔍 Rewards Contract ID:', this.rewardsContractId);
    }

    async initialize() {
        if (this.initialized) return;
        
        console.log('🔍 Initializing StellarSdk for Soroban contracts...');
        console.log('🔍 StellarSdk available:', typeof window.StellarSdk);
        
        if (typeof window.StellarSdk === 'undefined') {
            throw new Error('StellarSdk not loaded');
        }
        
        try {
            // Initialize both servers for different purposes
            const sorobanRpcUrl = this.networkConfig.sorobanRpcUrl;
            const horizonUrl = this.networkConfig.horizonUrl;
            
            // SorobanRpc.Server for contract calls
            if (window.StellarSdk.SorobanRpc && window.StellarSdk.SorobanRpc.Server) {
                this.sorobanServer = new window.StellarSdk.SorobanRpc.Server(sorobanRpcUrl);
                console.log('✅ SorobanRpc.Server initialized successfully');
            } else {
                throw new Error('SorobanRpc.Server not available');
            }
            
            // Horizon.Server for account operations
            this.horizonServer = new window.StellarSdk.Server(horizonUrl);
            console.log('✅ Horizon.Server initialized successfully');
            
            // Keep backward compatibility
            this.server = this.horizonServer;
            
            console.log('🔍 Soroban RPC URL:', sorobanRpcUrl);
            console.log('🔍 Horizon URL:', horizonUrl);
            this.initialized = true;
        } catch (error) {
            console.error('❌ Failed to create StellarSdk Servers:', error);
            throw error;
        }
    }

    // Test if contracts actually exist on the network
    async testContractExistence() {
        try {
            // Test Oracle contract
            const oracleExists = await this.testContractExists(this.oracleContractId);
            console.log('Oracle contract exists:', oracleExists);
            
            // Test Rewards contract
            const rewardsExists = await this.testContractExists(this.rewardsContractId);
            console.log('Rewards contract exists:', rewardsExists);
            
            return oracleExists && rewardsExists;
        } catch (error) {
            console.error('Error testing contract existence:', error);
            return false;
        }
    }

    // Test if a specific contract exists
    async testContractExists(contractId) {
        try {
            // Use Soroban RPC to test contract existence
            const contract = new window.StellarSdk.Contract(contractId);
            const testAccount = new window.StellarSdk.Account('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', '0');
            
            // Try to call a simple read-only function
            const transaction = new window.StellarSdk.TransactionBuilder(testAccount, {
                fee: window.StellarSdk.BASE_FEE,
                networkPassphrase: this.networkPassphrase,
            })
            .addOperation(contract.call('get_admin'))
            .setTimeout(30)
            .build();
            
            try {
                await this.sorobanServer.simulateTransaction(transaction);
                return true;
            } catch (error) {
                console.log(`Contract ${contractId} not accessible:`, error.message);
                return false;
            }
        } catch (error) {
            console.error(`Error testing contract ${contractId}:`, error);
            return false;
        }
    }

    // Call DOBI Oracle contract to validate data
    async validateDataWithOracle(signalData, publicKey) {
        // Initialize StellarSdk first
        await this.initialize();
        
        if (!window.walletManager || !window.walletManager.isConnected()) {
            throw new Error('Wallet not connected');
        }

        if (!this.forceRealContracts) {
            console.log('⚠️ Using mock contract validation (real contracts disabled)');
            return this.mockOracleValidation(signalData);
        }

        console.log('✅ Using real contract validation');

        try {
            // Validate signal data first
            const isValid = this.validateSignalData(signalData);
            const statusSymbol = isValid ? 'Valid' : 'Rejected';
            
            // Get account for transaction
            const account = await this.horizonServer.getAccount(publicKey);
            
            // Create contract address
            const contractAddress = window.StellarSdk.Address.contract(this.oracleContractId);
            
            // Prepare arguments for register_validation
            const args = [
                window.StellarSdk.scVal.scvAddress(window.StellarSdk.Address.fromString(publicKey)), // validator
                window.StellarSdk.scVal.scvString(signalData.device_id), // device_id
                window.StellarSdk.scVal.scvSymbol(statusSymbol), // ValidationStatus::Valid or Rejected
                window.StellarSdk.scVal.scvString(this.calculateDataHash(signalData)), // data_hash (64 chars)
                window.StellarSdk.scVal.scvU64(Math.floor(signalData.energy_kwh * 1000)) // energy_kwh (in stroops)
            ];

            // Build transaction
        const transaction = new window.StellarSdk.TransactionBuilder(account, {
            fee: window.StellarSdk.BASE_FEE,
            networkPassphrase: this.networkPassphrase,
        });

            // Add contract call operation
            const contractCallOp = window.StellarSdk.Operation.invokeContract({
                contract: contractAddress,
            function: 'register_validation',
                args: args
        });

        transaction.addOperation(contractCallOp);
        transaction.setTimeout(30);

            // Build and sign transaction
        const builtTransaction = transaction.build();
        const signedTransaction = await window.walletManager.signTransaction(builtTransaction.toXDR());
        
            // Submit transaction using Horizon server
            const result = await this.horizonServer.submitTransaction(signedTransaction);
        
        if (result.successful) {
            return {
                success: true,
                txHash: result.hash,
                explorerUrl: `https://stellar.expert/explorer/testnet/tx/${result.hash}`,
                validated: isValid,
                reason: isValid ? 'Data integrity confirmed' : 'Anomalies detected in signal data',
                isMock: false
            };
        } else {
            throw new Error('Transaction failed');
            }

        } catch (error) {
            console.error('❌ Real contract call failed, falling back to mock:', error);
            return this.mockOracleValidation(signalData);
        }
    }

    // Call DOBI Rewards contract to distribute rewards
    async distributeRewards(deviceId, validationTimestamp, energyKwh, publicKey) {
        await this.initialize();

        if (!window.walletManager || !window.walletManager.isConnected()) {
            throw new Error('Wallet not connected');
        }

        if (!this.forceRealContracts) {
            console.log('⚠️ Using mock rewards distribution (real contracts disabled)');
            return this.mockRewardsDistribution(deviceId, energyKwh);
        }

        console.log('✅ Using real rewards distribution');
        
        try {
            // Get account for transaction
            const account = await this.horizonServer.getAccount(publicKey);
            
            // Create contract address
            const contractAddress = window.StellarSdk.Address.contract(this.rewardsContractId);
            
            // Prepare arguments for distribute_rewards
            const args = [
                window.StellarSdk.scVal.scvAddress(window.StellarSdk.Address.fromString(publicKey)), // caller
                window.StellarSdk.scVal.scvString(deviceId), // device_id
                window.StellarSdk.scVal.scvU64(validationTimestamp), // validation_timestamp
                window.StellarSdk.scVal.scvU64(Math.floor(energyKwh * 1000)) // energy_kwh (in stroops)
            ];

            // Build transaction
            const transaction = new window.StellarSdk.TransactionBuilder(account, {
                fee: window.StellarSdk.BASE_FEE,
                networkPassphrase: this.networkPassphrase,
            });

            // Add contract call operation
            const contractCallOp = window.StellarSdk.Operation.invokeContract({
                contract: contractAddress,
                function: 'distribute_rewards',
                args: args
            });

            transaction.addOperation(contractCallOp);
            transaction.setTimeout(30);

            // Build and sign transaction
            const builtTransaction = transaction.build();
            const signedTransaction = await window.walletManager.signTransaction(builtTransaction.toXDR());

            // Submit transaction using Horizon server
            const result = await this.horizonServer.submitTransaction(signedTransaction);

            if (result.successful) {
                return {
                    success: true,
                    txHash: result.hash,
                    explorerUrl: `https://stellar.expert/explorer/testnet/tx/${result.hash}`,
                    distributed: true,
                    amount: energyKwh * 0.1, // 0.1 XLM per kWh
                    isMock: false
                };
            } else {
                throw new Error('Transaction failed');
            }

        } catch (error) {
            console.error('❌ Real rewards distribution failed, falling back to mock:', error);
            return this.mockRewardsDistribution(deviceId, energyKwh);
        }
    }

    // Initialize Oracle contract
    async initializeOracle(adminAddress) {
        await this.initialize();

        if (!window.walletManager || !window.walletManager.isConnected()) {
            throw new Error('Wallet not connected');
        }

        try {
            // Get account for transaction
            const account = await this.horizonServer.getAccount(adminAddress);
            
            // Create contract address
            const contractAddress = window.StellarSdk.Address.contract(this.oracleContractId);
            
            // Prepare arguments for initialize
            const args = [
                window.StellarSdk.scVal.scvAddress(window.StellarSdk.Address.fromString(adminAddress)) // admin
            ];

            // Build transaction
            const transaction = new window.StellarSdk.TransactionBuilder(account, {
                fee: window.StellarSdk.BASE_FEE,
                networkPassphrase: this.networkPassphrase,
            });

            // Add contract call operation
            const contractCallOp = window.StellarSdk.Operation.invokeContract({
                contract: contractAddress,
                function: 'initialize',
                args: args
            });

            transaction.addOperation(contractCallOp);
            transaction.setTimeout(30);

            // Build and sign transaction
            const builtTransaction = transaction.build();
            const signedTransaction = await window.walletManager.signTransaction(builtTransaction.toXDR());

            // Submit transaction using Horizon server
            const result = await this.horizonServer.submitTransaction(signedTransaction);

            if (result.successful) {
                return {
                    success: true,
                    txHash: result.hash,
                    explorerUrl: `https://stellar.expert/explorer/testnet/tx/${result.hash}`,
                    initialized: true
                };
            } else {
                throw new Error('Transaction failed');
            }
            
        } catch (error) {
            console.error('❌ Oracle initialization failed:', error);
            throw error;
        }
    }

    // Initialize Rewards contract
    async initializeRewards(adminAddress) {
        await this.initialize();
        
        if (!window.walletManager || !window.walletManager.isConnected()) {
            throw new Error('Wallet not connected');
        }

        try {
            // Get account for transaction
            const account = await this.horizonServer.getAccount(adminAddress);
            
            // Create contract address
            const contractAddress = window.StellarSdk.Address.contract(this.rewardsContractId);
            
            // Prepare arguments for initialize
            const args = [
                window.StellarSdk.scVal.scvAddress(window.StellarSdk.Address.fromString(adminAddress)), // admin
                window.StellarSdk.scVal.scvAddress(window.StellarSdk.Address.contract(this.oracleContractId)) // oracle_contract
            ];

            // Build transaction
        const transaction = new window.StellarSdk.TransactionBuilder(account, {
            fee: window.StellarSdk.BASE_FEE,
            networkPassphrase: this.networkPassphrase,
        });

            // Add contract call operation
            const contractCallOp = window.StellarSdk.Operation.invokeContract({
                contract: contractAddress,
                function: 'initialize',
                args: args
        });

        transaction.addOperation(contractCallOp);
        transaction.setTimeout(30);

            // Build and sign transaction
        const builtTransaction = transaction.build();
        const signedTransaction = await window.walletManager.signTransaction(builtTransaction.toXDR());
        
            // Submit transaction using Horizon server
            const result = await this.horizonServer.submitTransaction(signedTransaction);
        
        if (result.successful) {
            return {
                success: true,
                txHash: result.hash,
                explorerUrl: `https://stellar.expert/explorer/testnet/tx/${result.hash}`,
                    initialized: true
            };
        } else {
            throw new Error('Transaction failed');
            }

        } catch (error) {
            console.error('❌ Rewards initialization failed:', error);
            throw error;
        }
    }

    // Add validator to Oracle contract
    async addValidator(adminAddress, validatorAddress) {
            await this.initialize();
            
            if (!window.walletManager || !window.walletManager.isConnected()) {
                throw new Error('Wallet not connected');
            }

        try {
            // Get account for transaction
            const account = await this.horizonServer.getAccount(adminAddress);
            
            // Create contract address
            const contractAddress = window.StellarSdk.Address.contract(this.oracleContractId);
            
            // Prepare arguments for add_validator
            const args = [
                window.StellarSdk.scVal.scvAddress(window.StellarSdk.Address.fromString(adminAddress)), // admin
                window.StellarSdk.scVal.scvAddress(window.StellarSdk.Address.fromString(validatorAddress)) // validator
            ];

            // Build transaction
            const transaction = new window.StellarSdk.TransactionBuilder(account, {
                fee: window.StellarSdk.BASE_FEE,
                networkPassphrase: this.networkPassphrase,
            });

            // Add contract call operation
            const contractCallOp = window.StellarSdk.Operation.invokeContract({
                contract: contractAddress,
                function: 'add_validator',
                args: args
            });

            transaction.addOperation(contractCallOp);
            transaction.setTimeout(30);

            // Build and sign transaction
            const builtTransaction = transaction.build();
            const signedTransaction = await window.walletManager.signTransaction(builtTransaction.toXDR());

            // Submit transaction using Horizon server
            const result = await this.horizonServer.submitTransaction(signedTransaction);
            
            if (result.successful) {
                return {
                    success: true,
                    txHash: result.hash,
                    explorerUrl: `https://stellar.expert/explorer/testnet/tx/${result.hash}`,
                    validatorAdded: true
                };
            } else {
                throw new Error('Transaction failed');
            }

        } catch (error) {
            console.error('❌ Add validator failed:', error);
            throw error;
        }
    }

    // Configure device in Oracle contract
    async configureDevice(adminAddress, deviceId, operatorWallet, communityWallet) {
        await this.initialize();

        if (!window.walletManager || !window.walletManager.isConnected()) {
            throw new Error('Wallet not connected');
        }

        try {
            // Get account for transaction
            const account = await this.horizonServer.getAccount(adminAddress);
            
            // Create contract address
            const contractAddress = window.StellarSdk.Address.contract(this.oracleContractId);
            
            // Prepare arguments for configure_device
            const args = [
                window.StellarSdk.scVal.scvAddress(window.StellarSdk.Address.fromString(adminAddress)), // admin
                window.StellarSdk.scVal.scvString(deviceId), // device_id
                window.StellarSdk.scVal.scvAddress(window.StellarSdk.Address.fromString(operatorWallet)), // operator_wallet
                window.StellarSdk.scVal.scvAddress(window.StellarSdk.Address.fromString(communityWallet)) // community_wallet
            ];

            // Build transaction
            const transaction = new window.StellarSdk.TransactionBuilder(account, {
                fee: window.StellarSdk.BASE_FEE,
                networkPassphrase: this.networkPassphrase,
            });

            // Add contract call operation
            const contractCallOp = window.StellarSdk.Operation.invokeContract({
                contract: contractAddress,
                function: 'configure_device',
                args: args
            });

            transaction.addOperation(contractCallOp);
            transaction.setTimeout(30);

            // Build and sign transaction
            const builtTransaction = transaction.build();
            const signedTransaction = await window.walletManager.signTransaction(builtTransaction.toXDR());

            // Submit transaction using Horizon server
            const result = await this.horizonServer.submitTransaction(signedTransaction);

            if (result.successful) {
                return {
                    success: true,
                    txHash: result.hash,
                    explorerUrl: `https://stellar.expert/explorer/testnet/tx/${result.hash}`,
                    deviceConfigured: true
                };
            } else {
                throw new Error('Transaction failed');
            }

        } catch (error) {
            console.error('❌ Configure device failed:', error);
            throw error;
        }
    }

    // Validate signal data (business logic)
    validateSignalData(signalData) {
        // Basic validation rules
        if (!signalData.device_id || signalData.device_id.length < 3) {
            return false;
        }
        
        if (!signalData.energy_kwh || signalData.energy_kwh <= 0) {
            return false;
        }
        
        if (!signalData.duration || signalData.duration <= 0) {
            return false;
        }
        
        // Additional validation rules can be added here
        return true;
    }

    // Calculate data hash for signal data
    calculateDataHash(signalData) {
        const dataString = `${signalData.device_id}-${signalData.energy_kwh}-${signalData.duration}-${Date.now()}`;
        // Simple hash calculation (in production, use a proper hash function)
        let hash = 0;
        for (let i = 0; i < dataString.length; i++) {
            const char = dataString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16).padStart(8, '0').repeat(8).substring(0, 64);
    }

    // Mock validation for testing
    mockOracleValidation(signalData) {
        const isValid = this.validateSignalData(signalData);
        return {
            success: true,
            txHash: 'mock-tx-' + Date.now(),
            explorerUrl: '#',
            validated: isValid,
            reason: isValid ? 'Data integrity confirmed (mock)' : 'Anomalies detected in signal data (mock)',
            isMock: true
        };
    }

    // Mock rewards distribution for testing
    mockRewardsDistribution(deviceId, energyKwh) {
        return {
            success: true,
            txHash: 'mock-rewards-' + Date.now(),
            explorerUrl: '#',
            distributed: true,
            amount: energyKwh * 0.1,
            isMock: true
        };
    }

    // Enable real contracts
    enableRealContracts() {
        this.forceRealContracts = true;
        console.log('✅ Real contracts enabled');
    }

    // Disable real contracts (use mocks)
    disableRealContracts() {
        this.forceRealContracts = false;
        console.log('⚠️ Real contracts disabled, using mocks');
    }

    // Test contract connectivity
    async testConnectivity() {
        try {
            await this.initialize();
            const contractsExist = await this.testContractExistence();
            
            if (contractsExist) {
                console.log('✅ Contracts are accessible');
                return true;
            } else {
                console.log('❌ Contracts not accessible');
                return false;
            }
        } catch (error) {
            console.error('❌ Connectivity test failed:', error);
            return false;
        }
    }
}

// Export for use in other modules
export { SorobanContractManager };

// Global instance
window.sorobanContractManager = new SorobanContractManager();
