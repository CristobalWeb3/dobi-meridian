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
        
    }

    async initialize() {
        if (this.initialized) return;
        
        
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
            } else {
                throw new Error('SorobanRpc.Server not available');
            }
            
            // Horizon.Server for account operations
            if (window.StellarSdk.Horizon && window.StellarSdk.Horizon.Server) {
                this.horizonServer = new window.StellarSdk.Horizon.Server(horizonUrl);
            } else {
                // Fallback to legacy API
                this.horizonServer = new window.StellarSdk.Server(horizonUrl);
            }
            
            // Keep backward compatibility
            this.server = this.horizonServer;
            
            this.initialized = true;
        } catch (error) {
            throw error;
        }
    }

    // Test if contracts actually exist on the network
    async testContractExistence() {
        try {
            // Test Oracle contract
            const oracleExists = await this.testContractExists(this.oracleContractId);
            
            // Test Rewards contract
            const rewardsExists = await this.testContractExists(this.rewardsContractId);
            
            return oracleExists && rewardsExists;
        } catch (error) {
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
                return false;
            }
        } catch (error) {
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
            return this.mockOracleValidation(signalData);
        }


        try {
            // Validate signal data first
            const isValid = this.validateSignalData(signalData);
            const statusSymbol = isValid ? 'Valid' : 'Rejected';
            
            // Get account for transaction
            const account = await this.horizonServer.loadAccount(publicKey);
            
            // Create contract address
            const contractAddress = window.StellarSdk.Address.fromString(this.oracleContractId);
            
            // Prepare arguments for register_validation
            const args = [
                window.StellarSdk.Address.fromString(publicKey).toScVal(), // validator
                window.StellarSdk.xdr.ScVal.scvString(signalData.device_id), // device_id
                window.StellarSdk.xdr.ScVal.scvSymbol(statusSymbol), // ValidationStatus::Valid or Rejected
                window.StellarSdk.xdr.ScVal.scvString(this.calculateDataHash(signalData)), // data_hash (64 chars)
                window.StellarSdk.xdr.ScVal.scvU64(Math.floor(signalData.energy_kwh * 1000)) // energy_kwh (in stroops)
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
            return this.mockRewardsDistribution(deviceId, energyKwh);
        }

        
        try {
            // Get account for transaction
            const account = await this.horizonServer.loadAccount(publicKey);
            
            // Create contract address
            const contractAddress = window.StellarSdk.Address.fromString(this.rewardsContractId);
            
            // Prepare arguments for distribute_rewards
            const args = [
                window.StellarSdk.Address.fromString(publicKey).toScVal(), // caller
                window.StellarSdk.xdr.ScVal.scvString(deviceId), // device_id
                window.StellarSdk.xdr.ScVal.scvU64(validationTimestamp), // validation_timestamp
                window.StellarSdk.xdr.ScVal.scvU64(Math.floor(energyKwh * 1000)) // energy_kwh (in stroops)
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
            const account = await this.horizonServer.loadAccount(adminAddress);
            
            // Create contract address
            const contractAddress = window.StellarSdk.Address.fromString(this.oracleContractId);
            
            // Prepare arguments for initialize
            const args = [
                window.StellarSdk.Address.fromString(adminAddress).toScVal() // admin
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
            const account = await this.horizonServer.loadAccount(adminAddress);
            
            // Create contract address
            const contractAddress = window.StellarSdk.Address.fromString(this.rewardsContractId);
            
            // Prepare arguments for initialize
            const args = [
                window.StellarSdk.Address.fromString(adminAddress).toScVal(), // admin
                window.StellarSdk.Address.fromString(this.oracleContractId).toScVal() // oracle_contract
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
            const account = await this.horizonServer.loadAccount(adminAddress);
            
            // Create contract address
            const contractAddress = window.StellarSdk.Address.fromString(this.oracleContractId);
            
            // Prepare arguments for add_validator
            const args = [
                window.StellarSdk.Address.fromString(adminAddress).toScVal(), // admin
                window.StellarSdk.Address.fromString(validatorAddress).toScVal() // validator
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
            const account = await this.horizonServer.loadAccount(adminAddress);
            
            // Create contract address
            const contractAddress = window.StellarSdk.Address.fromString(this.oracleContractId);
            
            // Prepare arguments for configure_device
            const args = [
                window.StellarSdk.Address.fromString(adminAddress).toScVal(), // admin
                window.StellarSdk.xdr.ScVal.scvString(deviceId), // device_id
                window.StellarSdk.Address.fromString(operatorWallet).toScVal(), // operator_wallet
                window.StellarSdk.Address.fromString(communityWallet).toScVal() // community_wallet
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

    // Generate realistic Stellar transaction hash (64 characters)
    generateRealisticTxHash() {
        const chars = '0123456789abcdef';
        let result = '';
        
        // Generate 64 random hexadecimal characters
        for (let i = 0; i < 64; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return result;
    }

    // Mock validation for testing
    mockOracleValidation(signalData) {
        const isValid = this.validateSignalData(signalData);
        const timestamp = Date.now();
        const txHash = this.generateRealisticTxHash();
        
        // Simulate realistic validation logic
        let reason = '';
        if (isValid) {
            reason = 'Data integrity confirmed - Energy consumption within normal parameters';
        } else {
            // More detailed reasons based on what's invalid
            if (signalData.energy_kwh <= 0) {
                reason = 'Invalid energy reading - Negative or zero energy consumption detected';
            } else if (signalData.duration <= 0) {
                reason = 'Invalid duration - Zero or negative charging duration detected';
            } else if (!signalData.device_id || signalData.device_id.length < 3) {
                reason = 'Invalid device ID - Device identifier is missing or too short';
            } else {
                reason = 'Data anomalies detected - Signal does not meet validation criteria';
            }
        }
        
        return {
            success: true,
            txHash: txHash,
            explorerUrl: `https://stellar.expert/explorer/testnet/tx/${txHash}`,
            validated: isValid,
            reason: reason,
            isMock: true,
            timestamp: new Date(timestamp).toISOString(),
            energyValidated: isValid ? signalData.energy_kwh : 0,
            deviceId: signalData.device_id
        };
    }

    // Mock rewards distribution for testing
    mockRewardsDistribution(deviceId, energyKwh) {
        const timestamp = Date.now();
        const txHash = this.generateRealisticTxHash();
        
        // Simulate realistic reward calculation
        const baseRewardRate = 0.1; // 0.1 XLM per kWh
        const operatorPercentage = 70; // 70% to operator
        const communityPercentage = 30; // 30% to community
        
        const totalReward = energyKwh * baseRewardRate;
        const operatorReward = totalReward * (operatorPercentage / 100);
        const communityReward = totalReward * (communityPercentage / 100);
        
        return {
            success: true,
            txHash: txHash,
            explorerUrl: `https://stellar.expert/explorer/testnet/tx/${txHash}`,
            distributed: true,
            amount: totalReward.toFixed(4),
            operatorReward: operatorReward.toFixed(4),
            communityReward: communityReward.toFixed(4),
            energyKwh: energyKwh,
            rewardRate: baseRewardRate,
            deviceId: deviceId,
            timestamp: new Date(timestamp).toISOString(),
            isMock: true
        };
    }

    // Enable real contracts
    enableRealContracts() {
        this.forceRealContracts = true;
    }

    // Disable real contracts (use mocks)
    disableRealContracts() {
        this.forceRealContracts = false;
    }

    // Test contract connectivity
    async testConnectivity() {
        try {
            await this.initialize();
            const contractsExist = await this.testContractExistence();
            
            if (contractsExist) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }
}

// Export for use in other modules
export { SorobanContractManager };

// Global instance
window.sorobanContractManager = new SorobanContractManager();
