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
        
    }

    attachEventListeners() {
        if (this.connectBtn && this.connectBtn.parentNode) {
            // Remove any existing listeners first by cloning the element
            const newBtn = this.connectBtn.cloneNode(true);
            this.connectBtn.parentNode.replaceChild(newBtn, this.connectBtn);
            this.connectBtn = newBtn;
            
            // Add the appropriate listener based on connection state
            if (this.isWalletConnected) {
                this.connectBtn.addEventListener('click', () => this.disconnectWallet());
            } else {
                this.connectBtn.addEventListener('click', () => this.connectWallet());
            }
        }
        
        if (this.disconnectBtn) {
            this.disconnectBtn.addEventListener('click', () => this.disconnectWallet());
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
                
                // Force UI update after checking connection
                this.updateWalletUI();
            } else {
                this.showStatus('Freighter wallet not detected. Please install Freighter extension and refresh the page.', 'error');
            }
        } catch (error) {
            this.showStatus('Ready to connect wallet. Click "Connect wallet" to proceed.', 'info');
        }
    }

    isFreighterAvailable() {
        // Check for Freighter API (official way according to docs)
        if (typeof window.freighterApi !== 'undefined') {
            return true; // API is available
        }
        
        // Also check for the older freighter object as fallback
        if (typeof window.freighter !== 'undefined') {
            return true;
        }
        return false;
    }

    async connectWallet() {
        try {
            this.showStatus('Connecting to Freighter...', 'loading');
            
            // Check if Freighter is available
            const isAvailable = this.isFreighterAvailable();
            
            if (!isAvailable) {
                this.showStatus('Freighter wallet not detected. Please install Freighter extension from Chrome Web Store.', 'error');
                return false;
            }

            let publicKey, network;
            
            // Use official Freighter API according to documentation
            
            try {
                // Use the official Freighter API with fallback
                let freighterApi = null;
                let apiSource = '';
                
                if (typeof window.freighterApi !== 'undefined') {
                    freighterApi = window.freighterApi;
                    apiSource = 'window.freighterApi';
                } else if (typeof window.freighter !== 'undefined') {
                    freighterApi = window.freighter;
                    apiSource = 'window.freighter';
                } else {
                    this.showStatus('Freighter API not available. Please install Freighter extension.', 'error');
                    return false;
                }
                
                
                   // Check if already connected
                   const isConnected = await freighterApi.isConnected();
                   
                   if (isConnected) {
                       // Get public key from connected wallet
                       const publicKeyResult = await freighterApi.getPublicKey();
                       
                       // Extract public key using helper method
                       const extractedPublicKey = this.extractPublicKey(publicKeyResult);
                       
                       if (extractedPublicKey && !publicKeyResult?.error) {
                           publicKey = extractedPublicKey;
                           network = 'testnet';
                           this.showStatus('Wallet connected!', 'success');
                       } else {
                           this.showStatus('Please create/import an account in Freighter extension.', 'error');
                           return false;
                       }
                } else {
                    // Try to request access if available
                    if (typeof freighterApi.requestAccess === 'function') {
                        const result = await freighterApi.requestAccess();
                        
                       if (result && !result.error) {
                           const publicKeyResult = await freighterApi.getPublicKey();
                           
                           // Extract public key using helper method
                           const extractedPublicKey = this.extractPublicKey(publicKeyResult);
                           
                           if (extractedPublicKey && !publicKeyResult?.error) {
                               publicKey = extractedPublicKey;
                               network = 'testnet';
                               this.showStatus('Wallet connected successfully!', 'success');
                           } else {
                               this.showStatus('Please create/import an account in Freighter extension.', 'error');
                               return false;
                           }
                        } else {
                            this.showStatus('Please connect manually in Freighter extension.', 'error');
                            return false;
                        }
                    } else {
                        // requestAccess not available, try direct connection
                           try {
                               const publicKeyResult = await freighterApi.getPublicKey();
                               
                               // Extract public key using helper method
                               const extractedPublicKey = this.extractPublicKey(publicKeyResult);
                               
                               if (extractedPublicKey && !publicKeyResult?.error) {
                                   publicKey = extractedPublicKey;
                                   network = 'testnet';
                                   this.showStatus('Wallet connected!', 'success');
                               } else {
                                   this.showStatus('Please open Freighter extension and create/import an account.', 'error');
                                   return false;
                               }
                        } catch (error) {
                            this.showStatus('Please open Freighter extension and create/import an account.', 'error');
                            return false;
                        }
                    }
                }
            } catch (error) {
                this.showStatus('Please open Freighter extension and create/import an account.', 'error');
                return false;
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
        if (!this.connectBtn) return;
        
        // Check if wallet is connected
        if (this.isWalletConnected && this.publicKey) {
            // Update connect button text and style for connected state
            this.connectBtn.textContent = `${this.publicKey.slice(0, 6)}...${this.publicKey.slice(-4)}`;
            this.connectBtn.className = 'wallet-btn connected';
            
            // Reattach event listeners with the correct state
            this.attachEventListeners();
            
            // Get and display balance
            await this.updateBalance();
        } else {
            // Update connect button text and style for disconnected state
            this.connectBtn.textContent = 'Connect wallet';
            this.connectBtn.className = 'wallet-btn';
            
            // Reattach event listeners with the correct state
            this.attachEventListeners();
        }
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
            this.connectBtn.removeAttribute('data-disconnect-handler');
        }
        
        // Reattach event listeners (this will handle the button replacement)
        this.attachEventListeners();

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

    // Helper method to extract public key from different response formats
    extractPublicKey(publicKeyResult) {
        if (!publicKeyResult) return null;
        
        // Try different possible formats
        if (publicKeyResult.publicKey) {
            return publicKeyResult.publicKey;
        } else if (typeof publicKeyResult === 'string') {
            return publicKeyResult;
        } else if (publicKeyResult.key) {
            return publicKeyResult.key;
        } else if (publicKeyResult.address) {
            return publicKeyResult.address;
        }
        
        return null;
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
            // Use the official Freighter API with fallback
            let freighterApi = null;
            
            if (typeof window.freighterApi !== 'undefined') {
                freighterApi = window.freighterApi;
            } else if (typeof window.freighter !== 'undefined') {
                freighterApi = window.freighter;
            } else {
                throw new Error('Freighter API not available');
            }
            
            const result = await freighterApi.signTransaction(xdr, 'testnet');
            return result;
        } catch (error) {
            throw error;
        }
    }
}

// Export for use in other modules
export { WalletManager };

// Global instance
window.walletManager = new WalletManager();
