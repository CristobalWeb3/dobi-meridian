// Main Application Logic for DOBI Dashboard
// Handles UI interactions and orchestrates Web3 calls

class DobiApp {
    constructor() {
        this.wallet = null;
        this.initializeElements();
        this.attachEventListeners();
        this.initializeApp();
    }
    
    initializeElements() {
        // Signal validation buttons
        this.validSignalBtn = document.getElementById('validSignalBtn');
        this.invalidSignalBtn = document.getElementById('invalidSignalBtn');
        this.distributeRewardsBtn = document.getElementById('distributeRewardsBtn');
        
        // Display elements
        this.signalDisplay = document.getElementById('signalDisplay');
        this.signalHash = document.getElementById('signalHash');
        this.validationResult = document.getElementById('validationResult');
        this.validationReason = document.getElementById('validationReason');
        this.validationTimestamp = document.getElementById('validationTimestamp');
        this.activityDisplay = document.getElementById('activityDisplay');
        this.eventsTableBody = document.getElementById('eventsTableBody');
        
        // Chat elements
        this.chatInput = document.getElementById('chatInput');
        this.chatSendBtn = document.getElementById('chatSendBtn');
        this.chatMessages = document.getElementById('chatMessages');
        
        // Debug: Check if elements were found
        console.log('🔍 Elements found:');
        console.log('  - validSignalBtn:', !!this.validSignalBtn);
        console.log('  - invalidSignalBtn:', !!this.invalidSignalBtn);
        console.log('  - distributeRewardsBtn:', !!this.distributeRewardsBtn);
        console.log('  - signalDisplay:', !!this.signalDisplay);
        console.log('  - validationResult:', !!this.validationResult);
    }

    attachEventListeners() {
        // Signal validation buttons
        if (this.validSignalBtn) {
            this.validSignalBtn.addEventListener('click', () => this.validateSignal(true));
        }
        
        if (this.invalidSignalBtn) {
            this.invalidSignalBtn.addEventListener('click', () => this.validateSignal(false));
        }
        
        if (this.distributeRewardsBtn) {
            this.distributeRewardsBtn.addEventListener('click', () => this.distributeRewards());
        }

        // Chat functionality
        if (this.chatSendBtn) {
            this.chatSendBtn.addEventListener('click', () => this.sendChatMessage());
        }
        
        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendChatMessage();
            });
        }

        // Initialize contracts
        if (this.initContractsBtn) {
            this.initContractsBtn.addEventListener('click', () => this.initializeContracts());
        }
    }

    async initializeApp() {
        try {
            // Wait a bit for DOM to be fully rendered
            await new Promise(resolve => setTimeout(resolve, 100));
            
            this.wallet = new WalletManager();
            console.log('DobiApp: WalletManager initialized');
            
            // Initialize SorobanContractManager
            if (window.sorobanContractManager) {
                await window.sorobanContractManager.initialize();
                console.log('DobiApp: SorobanContractManager initialized');
            } else {
                console.error('DobiApp: SorobanContractManager not available');
            }
            
            await this.testAPIConnection();
            await this.updateRPCStatus();
            setInterval(() => this.updateRPCStatus(), 10000);
        } catch (error) {
            console.error('DobiApp initialization error:', error);
            this.showToast('App initialization failed', 'error');
        }
    }

    async testAPIConnection() {
        try {
            // Test StellarSdk availability
            if (typeof window.StellarSdk === 'undefined') {
                throw new Error('StellarSdk not loaded');
            }
            
            // Test SorobanContractManager
            if (!window.sorobanContractManager) {
                throw new Error('SorobanContractManager not available');
            }
            
            // Test contract connectivity
            const contractsAccessible = await window.sorobanContractManager.testConnectivity();
            
            if (contractsAccessible) {
                console.log('✅ All systems ready');
                this.showToast('All systems ready', 'success');
        } else {
                console.log('⚠️ Contracts not accessible, using mock mode');
                this.showToast('Contracts not accessible, using mock mode', 'warning');
            }
        } catch (error) {
            console.error('API connection test failed:', error);
            this.showToast('API connection test failed', 'error');
        }
    }

    async updateRPCStatus() {
        try {
            if (window.sorobanContractManager && window.sorobanContractManager.sorobanServer) {
                this.rpcDot.className = 'rpc-dot connected';
                this.rpcStatus.textContent = 'Connected to Stellar Testnet';
            } else {
                this.rpcDot.className = 'rpc-dot';
                this.rpcStatus.textContent = 'Disconnected from Stellar Testnet';
            }
        } catch (error) {
            this.rpcDot.className = 'rpc-dot';
            this.rpcStatus.textContent = 'Connection error';
        }
    }

    async validateSignal(isValid) {
        if (!window.walletManager || !window.walletManager.isConnected()) {
            this.showToast('Please connect your wallet first', 'error');
            return;
        }
        
        try {
            this.showToast('Validating signal...', 'info');
            
            // Generate sample signal data
            const signalData = this.generateSampleSignalData(isValid);
            
            // Update signal display
            this.updateSignalDisplay(signalData);
            
            // Get public key from wallet
            const publicKey = window.walletManager.getPublicKey();
            
            // Call Oracle contract
            const result = await window.sorobanContractManager.validateDataWithOracle(signalData, publicKey);
            
            if (result.success) {
                const status = result.validated ? 'Valid' : 'Invalid';
                const message = `Signal validation ${status}! ${result.reason}`;
                
                this.showToast(message, result.validated ? 'success' : 'warning');
                this.updateValidationResult(result);
                this.addEvent('Validation', signalData.device_id, status, result.reason, result.txHash);
                
                // Enable distribute rewards button if validation was successful
                if (result.validated && this.distributeRewardsBtn) {
                    this.distributeRewardsBtn.disabled = false;
                }
        } else {
                this.showToast('Validation failed', 'error');
                this.updateValidationResult({ validated: false, reason: 'Validation failed' });
            }
        } catch (error) {
            console.error('Validation error:', error);
            this.showToast(`Validation error: ${error.message}`, 'error');
            this.updateValidationResult({ validated: false, reason: error.message });
        }
    }

    async distributeRewards() {
        if (!window.walletManager || !window.walletManager.isConnected()) {
            this.showToast('Please connect your wallet first', 'error');
            return;
        }

        try {
            this.showToast('Distributing rewards...', 'info');
            this.updateActivityDisplay('Processing payment...');
            
            // Sample data for rewards distribution
            const deviceId = 'EV-001';
            const validationTimestamp = Math.floor(Date.now() / 1000);
            const energyKwh = 12.5;
            const publicKey = window.walletManager.getPublicKey();
            
            // Call Rewards contract
            const result = await window.sorobanContractManager.distributeRewards(
                deviceId, 
                validationTimestamp, 
                energyKwh, 
                publicKey
            );
            
            if (result.success) {
                this.showToast(`Rewards distributed: ${result.amount} XLM`, 'success');
                this.addActivityItem('Distributed', result.txHash);
                this.addChatMessage('dobi', this.generateRewardsMessage(deviceId, result));
                    } else {
                this.showToast('Rewards distribution failed', 'error');
                this.addActivityItem('Failed', null);
            }
        } catch (error) {
            console.error('Rewards distribution error:', error);
            this.showToast(`Rewards error: ${error.message}`, 'error');
            this.updateActivityDisplay('Payment error');
        }
    }

    async initializeContracts() {
        if (!window.walletManager || !window.walletManager.isConnected()) {
            this.showToast('Please connect your wallet first', 'error');
            return;
        }

        if (!window.sorobanContractManager) {
            this.showToast('Contract manager not initialized', 'error');
            return;
        }

        this.initContractsBtn.disabled = true;
        this.initContractsBtn.textContent = 'Initializing...';
        this.showToast('Initializing contracts...', 'info');

        try {
            const publicKey = window.walletManager.getPublicKey();
            
            this.addChatMessage('dobi', '🚀 **Contract Initialization Started**\n\nInitializing both Oracle and Rewards contracts...');
            
            // Initialize Oracle
            this.addChatMessage('dobi', '📋 Initializing DobiOracle contract...');
            const oracleResult = await window.sorobanContractManager.initializeOracle(publicKey);
            
            if (oracleResult.success) {
                this.addChatMessage('dobi', `✅ **Oracle Initialized Successfully!**\n\nTransaction: [${oracleResult.txHash}](${oracleResult.explorerUrl})`);
            } else {
                this.addChatMessage('dobi', '❌ **Oracle Initialization Failed**\n\nCheck the console for details.');
            }
            
            // Initialize Rewards
            this.addChatMessage('dobi', '💰 Initializing DobiRewards contract...');
            const rewardsResult = await window.sorobanContractManager.initializeRewards(publicKey);
            
            if (rewardsResult.success) {
                this.addChatMessage('dobi', `✅ **Rewards Initialized Successfully!**\n\nTransaction: [${rewardsResult.txHash}](${rewardsResult.explorerUrl})`);
                } else {
                this.addChatMessage('dobi', '❌ **Rewards Initialization Failed**\n\nCheck the console for details.');
            }
            
            // Add validator
            this.addChatMessage('dobi', '🔐 Adding wallet as validator...');
            const validatorResult = await window.sorobanContractManager.addValidator(publicKey, publicKey);
            
            if (validatorResult.success) {
                this.addChatMessage('dobi', `✅ **Validator Added Successfully!**\n\nTransaction: [${validatorResult.txHash}](${validatorResult.explorerUrl})`);
            } else {
                this.addChatMessage('dobi', '❌ **Validator Addition Failed**\n\nCheck the console for details.');
            }
            
            if (oracleResult.success && rewardsResult.success) {
                this.addChatMessage('dobi', '🎉 **All Contracts Initialized Successfully!**\n\nYour contracts are now ready to use. You can start validating signals and distributing rewards.');
                this.showToast('Contracts initialized successfully!', 'success');
            } else {
                this.addChatMessage('dobi', '⚠️ **Partial Initialization**\n\nSome contracts may not have been initialized properly. Check the individual results above.');
                this.showToast('Partial initialization completed', 'warning');
            }
        } catch (error) {
            this.addChatMessage('dobi', `❌ **Initialization Error**\n\nAn error occurred during initialization:\n\n${error.message}\n\nCheck the browser console for more details.`);
            this.showToast(`Initialization failed: ${error.message}`, 'error');
            console.error('Contract initialization error:', error);
        } finally {
            this.initContractsBtn.disabled = false;
            this.initContractsBtn.textContent = 'Initialize Contracts';
        }
    }

    sendChatMessage() {
        const input = this.chatInput;
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addChatMessage('You', message, 'user');
        
        // Simulate DOBI response
        setTimeout(() => {
            const responses = [
                'La última validación fue exitosa para el dispositivo EV-001.',
                'Balance del contrato: 1000 XLM. Listo para distribuir recompensas.',
                'Sistema operativo. Todas las validaciones están funcionando correctamente.',
                'Dispositivo EV-001 registrado. Energía: 12.5 kWh. Status: Válido.',
                'Smart contracts desplegados y funcionando en Stellar Testnet.',
                'Validación de señales IoT completada exitosamente.',
                'Recompensas distribuidas: 1.25 XLM para el operador.',
                'Sistema de validación RWA activo y monitoreando dispositivos.'
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            this.addChatMessage('DOBI', randomResponse, 'bot');
        }, 1000);
        
        input.value = '';
    }

    updateSignalDisplay(signalData) {
        if (this.signalDisplay) {
            const signalText = `{
  "device_id": "${signalData.device_id}",
  "timestamp": ${signalData.timestamp},
  "energy_kwh": ${signalData.energy_kwh},
  "duration_s": ${signalData.duration},
  "meter_delta_wh": ${Math.floor(signalData.energy_kwh * 1000)}
}`;
            this.signalDisplay.textContent = signalText;
        }
        
        if (this.signalHash) {
            const hash = this.calculateDataHash(signalData);
            this.signalHash.textContent = `Hash: ${hash.substring(0, 8).toUpperCase()}`;
        }
    }

    calculateDataHash(signalData) {
        const dataString = `${signalData.device_id}-${signalData.energy_kwh}-${signalData.duration}-${Date.now()}`;
        let hash = 0;
        for (let i = 0; i < dataString.length; i++) {
            const char = dataString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }

    updateValidationResult(result) {
        if (this.validationResult) {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            
            if (result.validated) {
            this.validationResult.textContent = 'VALID';
            this.validationResult.className = 'validation-result valid';
                if (this.validationReason) {
                    this.validationReason.textContent = 'Data integrity confirmed';
                }
        } else {
                this.validationResult.textContent = 'INVALID';
            this.validationResult.className = 'validation-result rejected';
                if (this.validationReason) {
                    this.validationReason.textContent = result.reason || 'Validation failed';
                }
            }
            
            if (this.validationTimestamp) {
                this.validationTimestamp.textContent = `Validated at ${timeString}`;
            }
        }
    }

    updateActivityDisplay(message) {
        if (this.activityDisplay) {
            if (typeof message === 'string') {
                this.activityDisplay.innerHTML = `<div class="activity-item"><span class="activity-tag">${message}</span></div>`;
            } else {
                this.activityDisplay.innerHTML = message;
            }
        }
    }

    addActivityItem(type, txid, time) {
        if (this.activityDisplay) {
            const now = new Date();
            const timeString = time || now.toLocaleTimeString();
            const txidShort = txid ? txid.substring(0, 8) + '...' : 'N/A';
            
            this.activityDisplay.innerHTML = `
                <div class="activity-item">
                    <span class="activity-type ${type.toLowerCase()}">${type}</span>
                    <span class="activity-link">${txidShort}</span>
                    <span class="activity-time">${timeString}</span>
                </div>
            `;
        }
    }

    addEvent(type, device, status, details, txHash) {
        if (this.eventsTableBody) {
            // Remove "No events yet" row if it exists
            const noEventsRow = this.eventsTableBody.querySelector('tr');
            if (noEventsRow && noEventsRow.textContent.includes('No events yet')) {
                noEventsRow.remove();
            }

            const row = document.createElement('tr');
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            
            row.innerHTML = `
                <td>${timeString}</td>
                <td>${device}</td>
                <td>${type}</td>
                <td>${details}</td>
                <td>${txHash ? txHash.substring(0, 8) + '...' : 'N/A'}</td>
            `;
            
            this.eventsTableBody.insertBefore(row, this.eventsTableBody.firstChild);
            
            // Keep only last 10 events
            while (this.eventsTableBody.children.length > 10) {
                this.eventsTableBody.removeChild(this.eventsTableBody.lastChild);
            }
        }
    }

    addChatMessage(sender, message, type) {
        if (this.chatMessages) {
            const messageElement = document.createElement('div');
            messageElement.className = `chat-message ${type}`;
            
            const formattedMessage = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            const linkFormattedMessage = formattedMessage.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #60a5fa;">$1</a>');
            
            messageElement.innerHTML = `<strong>${sender}:</strong> ${linkFormattedMessage}`;
            this.chatMessages.appendChild(messageElement);
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }

    generateSampleSignalData(isValid) {
        const baseData = {
            device_id: 'EV-001',
            energy_kwh: 12.5,
            duration: 30,
            timestamp: Date.now()
        };
        
        if (!isValid) {
            // Make data invalid
            baseData.energy_kwh = -5; // Negative energy (invalid)
            baseData.duration = 0; // Zero duration (invalid)
        }
        
        return baseData;
    }

    generateValidationMessage(signalData, result) {
        const status = result.validated ? '✅ Valid' : '❌ Invalid';
        const mockIndicator = result.isMock ? ' (Mock)' : '';
        
        return `**Signal Validation Complete**${mockIndicator}\n\n` +
               `**Device:** ${signalData.device_id}\n` +
               `**Energy:** ${signalData.energy_kwh} kWh\n` +
               `**Duration:** ${signalData.duration} minutes\n` +
               `**Status:** ${status}\n` +
               `**Reason:** ${result.reason}\n` +
               `**Transaction:** [${result.txHash}](${result.explorerUrl})`;
    }

    generateValidationFailureMessage(signalData, result) {
        return `**Validation Failed**\n\n` +
               `I was unable to record the validation on-chain for device ${signalData.device_id}.\n\n` +
               `**Reason:** ${result.reason || 'Unknown validation error'}\n\n` +
               `**Next Steps:** Please check your wallet connection and try again. If the issue persists, the smart contracts may not be properly deployed.`;
    }

    generateRewardsMessage(deviceId, result) {
        const mockIndicator = result.isMock ? ' (Mock)' : '';
        
        return `**Rewards Distributed**${mockIndicator}\n\n` +
               `**Device:** ${deviceId}\n` +
               `**Amount:** ${result.amount} XLM\n` +
               `**Transaction:** [${result.txHash}](${result.explorerUrl})\n\n` +
               `Rewards have been successfully distributed to the operator and community wallets.`;
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
            window.dobiApp = new DobiApp();
});
