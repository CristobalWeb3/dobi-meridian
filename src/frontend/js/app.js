// Main Application Logic for DOBI Dashboard
// Handles UI interactions and orchestrates Web3 calls

import { WalletManager } from './wallet.js';

class DobiApp {
    constructor() {
        this.wallet = null;
        this.lastValidationResult = null; // Track last validation result
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
        
        // Header elements for RPC status
        this.rpcDot = document.getElementById('rpcDot');
        this.rpcStatus = document.getElementById('rpcStatus');
        this.walletBtn = document.getElementById('walletBtn');
        
        // Debug: Check if elements were found
    }

    attachEventListeners() {
        // Signal validation buttons
        if (this.validSignalBtn) {
            this.validSignalBtn.addEventListener('click', () => {
                this.validateSignal(true);
            });
        }
        
        if (this.invalidSignalBtn) {
            this.invalidSignalBtn.addEventListener('click', () => {
                this.validateSignal(false);
            });
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

    }

    async initializeApp() {
        try {
            // Wait a bit for DOM to be fully rendered
            await new Promise(resolve => setTimeout(resolve, 100));
            
            this.wallet = new WalletManager();
            window.walletManager = this.wallet;
            
            // Listen for wallet connection changes
            document.addEventListener('walletConnected', () => {
                this.checkWalletStatus();
            });
            
            document.addEventListener('walletDisconnected', () => {
                this.checkWalletStatus();
            });
            
            // Initialize SorobanContractManager
            if (window.sorobanContractManager) {
                await window.sorobanContractManager.initialize();
            }
            
            await this.testAPIConnection();
            await this.updateRPCStatus();
            await this.checkWalletStatus();
            setInterval(() => this.updateRPCStatus(), 10000);
        } catch (error) {
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
                this.showToast('All systems ready', 'success');
        } else {
                this.showToast('Contracts not accessible, using mock mode', 'warning');
            }
        } catch (error) {
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

    async checkWalletStatus() {
        try {
            // Check if wallet is connected
            if (window.walletManager && window.walletManager.isConnected()) {
                // Update distribute rewards button state
                if (this.distributeRewardsBtn) {
                    this.distributeRewardsBtn.disabled = false;
                    this.distributeRewardsBtn.textContent = 'Validate on-chain & (auto) Pay';
                }
            } else {
                // Wallet not connected
                if (this.distributeRewardsBtn) {
                    this.distributeRewardsBtn.disabled = true;
                    this.distributeRewardsBtn.textContent = 'Please connect your wallet first';
                }
            }
        } catch (error) {
            // Error checking wallet status
            if (this.distributeRewardsBtn) {
                this.distributeRewardsBtn.disabled = true;
                this.distributeRewardsBtn.textContent = 'Please connect your wallet first';
            }
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
                
                // Store validation result for rewards distribution
                this.lastValidationResult = result;
                
                this.showToast(message, result.validated ? 'success' : 'warning');
                this.updateValidationResult(result);
                this.addEvent('Validation', signalData.device_id, status, result.reason, result.txHash);
                
                // Enable distribute rewards button if validation was successful
                if (result.validated && this.distributeRewardsBtn) {
                    this.distributeRewardsBtn.disabled = false;
                } else if (!result.validated && this.distributeRewardsBtn) {
                    this.distributeRewardsBtn.disabled = true;
                }
                
                // Add DOBI analysis for invalid signals
                if (!result.validated) {
                    this.addChatMessage('dobi', this.generateInvalidSignalAnalysis(signalData, result));
                    }
                } else {
                this.showToast('Validation failed', 'error');
                this.updateValidationResult({ validated: false, reason: 'Validation failed' });
                this.lastValidationResult = { validated: false, reason: 'Validation failed' };
            }
        } catch (error) {
            this.showToast(`Validation error: ${error.message}`, 'error');
            this.updateValidationResult({ validated: false, reason: error.message });
        }
    }

    async distributeRewards() {
        if (!window.walletManager || !window.walletManager.isConnected()) {
            this.showToast('Please connect your wallet first', 'error');
            return;
        }
        
        // Check if last validation was successful
        if (!this.lastValidationResult || !this.lastValidationResult.validated) {
            this.showToast('Cannot distribute rewards - Last validation was not successful', 'error');
            this.addChatMessage('dobi', '❌ **Rewards Distribution Blocked**\n\nCannot distribute rewards because the last signal validation was not successful. Please validate a signal first.');
            return;
        }

        try {
            this.showToast('Distributing rewards...', 'info');
            this.updateActivityDisplay('Processing payment...');
            
            // Use data from last validation
            const deviceId = this.lastValidationResult.deviceId || 'EV-001';
            const validationTimestamp = Math.floor(Date.now() / 1000);
            const energyKwh = this.lastValidationResult.energyValidated || 12.5;
            const publicKey = window.walletManager.getPublicKey();
            
            // Call Rewards contract
            const result = await window.sorobanContractManager.distributeRewards(
                deviceId, 
                validationTimestamp, 
                energyKwh, 
                publicKey
            );
            
            if (result.success) {
                const totalReward = parseFloat(result.amount);
                const operatorReward = parseFloat(result.operatorReward);
                const communityReward = parseFloat(result.communityReward);
                
                this.showToast(`Rewards distributed: ${totalReward} XLM (${operatorReward} to operator, ${communityReward} to community)`, 'success');
                this.addActivityItem('Distributed', result.txHash);
                this.addChatMessage('dobi', this.generateRewardsMessage(deviceId, result));
            } else {
                this.showToast('Rewards distribution failed', 'error');
                this.addActivityItem('Failed', null);
            }
        } catch (error) {
            this.showToast(`Rewards error: ${error.message}`, 'error');
            this.updateActivityDisplay('Payment error');
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
            this.addChatMessage('DOBI', randomResponse, 'assistant');
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
        const totalReward = parseFloat(result.amount);
        const operatorReward = parseFloat(result.operatorReward);
        const communityReward = parseFloat(result.communityReward);
        const energyKwh = result.energyKwh || 0;
        const rewardRate = result.rewardRate || 0.1;
        
        return `**Rewards Distributed**${mockIndicator}\n\n` +
               `**Device:** ${deviceId}\n` +
               `**Energy Validated:** ${energyKwh} kWh\n` +
               `**Reward Rate:** ${rewardRate} XLM per kWh\n` +
               `**Total Reward:** ${totalReward} XLM\n` +
               `**Operator (70%):** ${operatorReward} XLM\n` +
               `**Community (30%):** ${communityReward} XLM\n` +
               `**Transaction:** [${result.txHash}](${result.explorerUrl})\n\n` +
               `Rewards have been successfully distributed based on validated energy consumption.`;
    }

    generateInvalidSignalAnalysis(signalData, result) {
        const mockIndicator = result.isMock ? ' (Mock Analysis)' : '';
        
        // Analyze the specific issues with the signal
        let analysis = `**🔍 Signal Analysis${mockIndicator}**\n\n`;
        analysis += `**Device:** ${signalData.device_id}\n`;
        analysis += `**Timestamp:** ${new Date(signalData.timestamp).toLocaleString()}\n`;
        analysis += `**Energy:** ${signalData.energy_kwh} kWh\n`;
        analysis += `**Duration:** ${signalData.duration} seconds\n\n`;
        
        // Detailed analysis based on the validation result
        analysis += `**❌ Validation Failed**\n\n`;
        analysis += `**Reason:** ${result.reason}\n\n`;
        
        // Specific recommendations based on the type of error
        if (signalData.energy_kwh <= 0) {
            analysis += `**🔧 Recommendations:**\n`;
            analysis += `• Check device sensors for proper calibration\n`;
            analysis += `• Verify energy meter readings are within normal range\n`;
            analysis += `• Ensure device is properly connected and functioning\n`;
            analysis += `• Expected range: 0.1 - 50 kWh per session\n\n`;
        } else if (signalData.duration <= 0) {
            analysis += `**🔧 Recommendations:**\n`;
            analysis += `• Verify charging session duration is properly recorded\n`;
            analysis += `• Check timer functionality on the device\n`;
            analysis += `• Ensure session start/stop events are properly triggered\n`;
            analysis += `• Expected range: 1 - 1440 minutes per session\n\n`;
        } else if (!signalData.device_id || signalData.device_id.length < 3) {
            analysis += `**🔧 Recommendations:**\n`;
            analysis += `• Verify device ID is properly configured\n`;
            analysis += `• Check device registration in the system\n`;
            analysis += `• Ensure device ID follows naming conventions\n`;
            analysis += `• Expected format: EV-XXX (3+ characters)\n\n`;
            } else {
            analysis += `**🔧 Recommendations:**\n`;
            analysis += `• Review all signal parameters for anomalies\n`;
            analysis += `• Check data integrity and transmission quality\n`;
            analysis += `• Verify device is operating within specifications\n`;
            analysis += `• Contact technical support if issues persist\n\n`;
        }
        
        analysis += `**⚠️ Impact:** No rewards will be distributed for this invalid signal.\n`;
        analysis += `**✅ Next Steps:** Fix the identified issues and resubmit the signal.`;
        
        return analysis;
    }

    showToast(message, type = 'info') {
        // Remove existing toasts to prevent overlap
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 100);
        });
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Export DobiApp class
export { DobiApp };

// Initialize app when DOM is ready (fallback)
document.addEventListener('DOMContentLoaded', () => {
    if (!window.dobiApp) {
            window.dobiApp = new DobiApp();
    }
});
