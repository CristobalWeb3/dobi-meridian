// Wallet Manager for DOBI Demo
// Handles Freighter wallet integration

class WalletManager {
    constructor() {
        this.isWalletConnected = false;
        this.publicKey = null;
        this.network = null;
        this.balance = 0;
        this.connectionCheckInterval = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.checkWalletConnection();
        this.setupConnectionMonitoring();
    }

    initializeElements() {
        this.connectBtn = document.getElementById('walletBtn');
        this.disconnectBtn = document.getElementById('disconnectBtn');
        this.walletInfo = document.getElementById('wallet-info');
        this.walletStatus = document.getElementById('wallet-status');
        this.addressText = document.getElementById('wallet-address-text');
        this.balanceText = document.getElementById('wallet-balance');
        this.copyBtn = document.getElementById('copy-address');
        
        // Debug: Check if buttons were found
        if (!this.connectBtn) {
            console.error('WalletManager: walletBtn not found in DOM');
        } else {
            console.log('WalletManager: walletBtn found and ready');
        }
        
        if (!this.disconnectBtn) {
            console.error('WalletManager: disconnectBtn not found in DOM');
        } else {
            console.log('WalletManager: disconnectBtn found and ready');
        }
    }

    attachEventListeners() {
        if (this.connectBtn) {
            this.connectBtn.addEventListener('click', () => this.connectWallet());
            console.log('WalletManager: Event listener attached to walletBtn');
        } else {
            console.error('WalletManager: Cannot attach event listener - connectBtn is null');
        }
        
        if (this.disconnectBtn) {
            this.disconnectBtn.addEventListener('click', () => this.disconnectWallet());
            console.log('WalletManager: Event listener attached to disconnectBtn');
        } else {
            console.error('WalletManager: Cannot attach event listener - disconnectBtn is null');
        }
        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', () => this.copyAddress());
        }
    }

    async checkWalletConnection() {
        try {
            // Check if we're in a secure context
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Check if Freighter is available
            const isAvailable = this.isFreighterAvailable();
            
            if (isAvailable) {
                this.showStatus('Freighter wallet detected! You can connect your wallet.', 'success');
                
                // Auto-connect if previously connected
                const savedConnection = localStorage.getItem('dobi-wallet-connected');
                if (savedConnection) {
                    await this.connectWallet();
                }
            } else {
                this.showStatus('Freighter wallet not detected. Please install Freighter extension and refresh the page.', 'error');
            }
        } catch (error) {
            this.showStatus('Ready to connect wallet. Click "Connect wallet" to proceed.', 'info');
        }
    }

    async isFreighterAvailable() {
        // Check for Freighter API (official way according to docs)
        if (typeof window.freighterApi !== 'undefined') {
            try {
                // Test if Freighter is actually available and responsive
                const isConnected = await window.freighterApi.isConnected();
                console.log('Freighter API available, isConnected:', isConnected);
                return true; // API is available regardless of connection status
            } catch (error) {
                console.log('Freighter API error:', error);
                return false;
            }
        }
        
        console.log('Freighter API not found. Please install Freighter extension from Chrome Web Store.');
        return false;
    }

    async connectWallet() {
        console.log('WalletManager: connectWallet called');
        try {
            this.showStatus('Connecting to Freighter...', 'loading');
            
            // Check if Freighter is available
            const isAvailable = await this.isFreighterAvailable();
            console.log('WalletManager: Freighter available:', isAvailable);
            
            if (!isAvailable) {
                this.showStatus('Freighter wallet not detected. Please install Freighter extension from Chrome Web Store.', 'error');
                return false;
            }

            let publicKey, network;
            
            // Use official Freighter API according to documentation
            console.log('Using Freighter API');
            
            // Check if already connected
            const isConnected = await window.freighterApi.isConnected();
            console.log('Freighter isConnected:', isConnected);
            
            if (isConnected) {
                const publicKeyResult = await window.freighterApi.getPublicKey();
                if (publicKeyResult && !publicKeyResult.error) {
                    publicKey = publicKeyResult.publicKey;
                    network = 'testnet';
                    this.showStatus('Wallet already connected!', 'success');
                } else {
                    this.showStatus('Failed to get public key from connected wallet', 'error');
                    return false;
                }
            } else {
                // Try to request connection if method is available
                if (typeof window.freighterApi.requestAccess === 'function') {
                    console.log('Requesting access to Freighter...');
                    const result = await window.freighterApi.requestAccess();
                    console.log('Freighter requestAccess result:', result);
                    
                    if (result && !result.error) {
                        const publicKeyResult = await window.freighterApi.getPublicKey();
                        if (publicKeyResult && !publicKeyResult.error) {
                            publicKey = publicKeyResult.publicKey;
                            network = 'testnet';
                            this.showStatus('Wallet connected successfully!', 'success');
                        } else {
                            this.showStatus('Failed to get public key after connection', 'error');
                            return false;
                        }
                    } else {
                        this.showStatus(`Wallet connection failed: ${result?.error || 'User cancelled or extension not available'}`, 'error');
                        return false;
                    }
                } else {
                    this.showStatus('Wallet not connected and requestAccess not available. Please connect manually in Freighter extension.', 'error');
                    return false;
                }
            }
            
            // Update state
            this.publicKey = publicKey;
            this.network = network;
            this.isWalletConnected = true;

            // Update UI
            await this.updateWalletUI();
            
            // Save connection state
            localStorage.setItem('dobi-wallet-connected', 'true');
            localStorage.setItem('dobi-wallet-address', this.publicKey);

            this.showStatus(`Wallet connected: ${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`, 'success');
            
            // Dispatch wallet connected event
            this.dispatchWalletEvent('walletConnected', {
                publicKey: this.publicKey,
                network: this.network
            });

            return true;

        } catch (error) {
            console.error('Wallet connection error:', error);
            // Handle specific error cases
            if (error.message?.includes('FREIGHTER_NOT_DETECTED')) {
                this.showStatus('Freighter wallet not detected. Please install Freighter extension.', 'error');
            } else if (error.message?.includes('message port closed')) {
                this.showStatus('Connection timeout. Please try again.', 'error');
            } else {
                this.showStatus(`Connection failed: ${error.message}`, 'error');
            }
            return false;
        }
    }

    async updateWalletUI() {
        if (!this.connectBtn || !this.disconnectBtn) return;
        
        // Update connect button text and style
        this.connectBtn.textContent = `${this.publicKey.slice(0, 6)}...${this.publicKey.slice(-4)}`;
        this.connectBtn.className = 'wallet-btn connected';
        this.connectBtn.style.display = 'none'; // Hide connect button
        
        // Show disconnect button
        this.disconnectBtn.style.display = 'inline-block';
        
        // Get and display balance
        await this.updateBalance();
    }

    async updateBalance() {
        try {
            // Get real balance from Stellar network
            if (this.publicKey) {
                // Check if StellarSdk is available
                if (typeof window.StellarSdk === 'undefined') {
                    throw new Error('StellarSdk not loaded');
                }
                
                const server = new window.StellarSdk.Server('https://horizon-testnet.stellar.org');
                const account = await server.loadAccount(this.publicKey);
                
                // Find XLM balance
                const xlmBalance = account.balances.find(balance => balance.asset_type === 'native');
                this.balance = xlmBalance ? parseFloat(xlmBalance.balance) : 0;
                
                if (this.balanceText) {
                    this.balanceText.textContent = `${this.balance.toFixed(7)} XLM`;
                }
            }
        } catch (error) {
            if (this.balanceText) {
                this.balanceText.textContent = 'Error loading balance';
            }
        }
    }

    disconnectWallet() {
        // Clear wallet data
        this.isWalletConnected = false;
        this.publicKey = null;
        this.network = null;
        this.balance = 0;

        // Update UI
        if (this.connectBtn) {
            this.connectBtn.textContent = 'Connect wallet';
            this.connectBtn.className = 'wallet-btn';
            this.connectBtn.style.display = 'inline-block'; // Show connect button
        }

        if (this.disconnectBtn) {
            this.disconnectBtn.style.display = 'none'; // Hide disconnect button
        }

        // Clear storage
        localStorage.removeItem('dobi-wallet-connected');
        localStorage.removeItem('dobi-wallet-address');

        this.showStatus('Wallet disconnected', 'info');
        
        // Dispatch wallet disconnected event
        this.dispatchWalletEvent('walletDisconnected');
    }

    setupConnectionMonitoring() {
        // Check connection status periodically
        this.connectionCheckInterval = setInterval(async () => {
            if (this.isWalletConnected) {
                try {
                    const isStillConnected = await window.freighterApi.isConnected();
                    if (!isStillConnected) {
                        this.showStatus('Wallet disconnected from extension', 'warning');
                        this.disconnectWallet();
                    }
                } catch (error) {
                    // Wallet might be disconnected
                    this.showStatus('Wallet connection lost', 'warning');
                    this.disconnectWallet();
                }
            }
        }, 2000); // Check every 2 seconds
    }

    destroy() {
        if (this.connectionCheckInterval) {
            clearInterval(this.connectionCheckInterval);
        }
    }

    copyAddress() {
        if (this.publicKey) {
            navigator.clipboard.writeText(this.publicKey).then(() => {
                this.showStatus('Address copied to clipboard', 'success');
                
                // Visual feedback
                if (this.copyBtn) {
                    this.copyBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        this.copyBtn.textContent = 'Copy';
                    }, 2000);
                }
            });
        }
    }

    showStatus(message, type) {
        // Create or update status element
        let statusElement = document.getElementById('wallet-status');
        if (!statusElement) {
            statusElement = document.createElement('div');
            statusElement.id = 'wallet-status';
            statusElement.className = 'wallet-status';
            document.body.appendChild(statusElement);
        }
        
        statusElement.textContent = message;
        statusElement.className = `wallet-status ${type}`;
        
        // Auto-hide success messages
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                statusElement.textContent = '';
                statusElement.className = 'wallet-status';
            }, 3000);
        }
    }

    dispatchWalletEvent(eventName, data = {}) {
        const event = new CustomEvent(eventName, { 
            detail: { 
                publicKey: this.publicKey, 
                network: this.network, 
                ...data 
            } 
        });
        document.dispatchEvent(event);
    }

    // Getter methods for external use
    getPublicKey() { return this.publicKey; }
    getNetwork() { return this.network; }
    isConnected() { return this.isWalletConnected; }
    getBalance() { return this.balance; }

    async fetchBalance() {
        if (!this.isWalletConnected || !this.publicKey) {
            return 0;
        }

        try {
            // Check if StellarSdk is available
            if (typeof window.StellarSdk === 'undefined') {
                throw new Error('StellarSdk not loaded');
            }
            
            // Use Stellar SDK to get real balance from network
            const server = new window.StellarSdk.Server('https://horizon-testnet.stellar.org');
            const account = await server.loadAccount(this.publicKey);
            
            // Find XLM balance
            const xlmBalance = account.balances.find(balance => balance.asset_type === 'native');
            const balance = xlmBalance ? parseFloat(xlmBalance.balance) : 0;
            
            this.balance = balance;
            await this.updateBalance();
            return balance;
        } catch (error) {
            return 0;
        }
    }

    // Method to sign transactions
    async signTransaction(xdr) {
        if (!this.isWalletConnected) {
            throw new Error('Wallet not connected');
        }

        try {
            // Use official Freighter API
            if (typeof window.freighterApi !== 'undefined') {
                const result = await window.freighterApi.signTransaction(xdr, 'testnet');
                return result;
            } else {
                // Fallback to alternative method
                const result = await window.freighter.signTransaction(xdr, 'testnet');
                return result;
            }
        } catch (error) {
            throw error;
        }
    }
}

// Export for use in other modules
export { WalletManager };

// Global instance
window.walletManager = new WalletManager();
