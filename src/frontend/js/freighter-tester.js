/**
 * Freighter Connection Tester
 * Comprehensive testing module for Freighter wallet integration
 * Based on official Freighter API documentation: https://docs.freighter.app/docs/
 */

class FreighterTester {
    constructor() {
        this.isConnected = false;
        this.publicKey = null;
        this.network = null;
        this.testResults = {
            extension: false,
            api: false,
            connection: false,
            wallet: false,
            transactions: false,
            network: false
        };
        
        this.initializeElements();
        this.attachEventListeners();
        this.runInitialTests();
    }

    initializeElements() {
        // Status indicators
        this.basicStatus = document.getElementById('basicStatus');
        this.walletStatus = document.getElementById('walletStatus');
        this.txStatus = document.getElementById('txStatus');
        this.networkTestStatus = document.getElementById('networkTestStatus');

        // Status displays
        this.extensionStatus = document.getElementById('extensionStatus');
        this.apiStatus = document.getElementById('apiStatus');
        this.networkStatus = document.getElementById('networkStatus');
        this.publicKeyStatus = document.getElementById('publicKeyStatus');
        this.isConnectedStatus = document.getElementById('isConnectedStatus');

        // Test buttons
        this.testExtensionBtn = document.getElementById('testExtensionBtn');
        this.testApiBtn = document.getElementById('testApiBtn');
        this.testConnectionBtn = document.getElementById('testConnectionBtn');
        this.testConnectBtn = document.getElementById('testConnectBtn');
        this.testDisconnectBtn = document.getElementById('testDisconnectBtn');
        this.testGetPublicKeyBtn = document.getElementById('testGetPublicKeyBtn');
        this.testIsConnectedBtn = document.getElementById('testIsConnectedBtn');
        this.testSignTxBtn = document.getElementById('testSignTxBtn');
        this.testSimulateTxBtn = document.getElementById('testSimulateTxBtn');
        this.testSubmitTxBtn = document.getElementById('testSubmitTxBtn');
        this.testNetworkBtn = document.getElementById('testNetworkBtn');
        this.testHorizonBtn = document.getElementById('testHorizonBtn');
        this.testSorobanBtn = document.getElementById('testSorobanBtn');

        // Results containers
        this.basicResults = document.getElementById('basicResults');
        this.walletResults = document.getElementById('walletResults');
        this.txResults = document.getElementById('txResults');
        this.networkResults = document.getElementById('networkResults');
        this.logContainer = document.getElementById('logContainer');
        this.clearLogBtn = document.getElementById('clearLogBtn');
    }

    attachEventListeners() {
        // Basic connection tests
        this.testExtensionBtn?.addEventListener('click', () => this.testExtensionDetection());
        this.testApiBtn?.addEventListener('click', () => this.testApiAvailability());
        this.testConnectionBtn?.addEventListener('click', () => this.testConnection());

        // Wallet operations
        this.testConnectBtn?.addEventListener('click', () => this.testConnectWallet());
        this.testDisconnectBtn?.addEventListener('click', () => this.testDisconnectWallet());
        this.testGetPublicKeyBtn?.addEventListener('click', () => this.testGetPublicKey());
        this.testIsConnectedBtn?.addEventListener('click', () => this.testIsConnected());

        // Transaction tests
        this.testSignTxBtn?.addEventListener('click', () => this.testSignTransaction());
        this.testSimulateTxBtn?.addEventListener('click', () => this.testSimulateTransaction());
        this.testSubmitTxBtn?.addEventListener('click', () => this.testSubmitTransaction());

        // Network tests
        this.testNetworkBtn?.addEventListener('click', () => this.testNetworkConnection());
        this.testHorizonBtn?.addEventListener('click', () => this.testHorizonAPI());
        this.testSorobanBtn?.addEventListener('click', () => this.testSorobanRPC());

        // Log management
        this.clearLogBtn?.addEventListener('click', () => this.clearLog());
    }

    async runInitialTests() {
        this.log('🚀 Starting initial Freighter tests...');
        await this.testExtensionDetection();
        await this.testApiAvailability();
        await this.testNetworkConnection();
        this.updateStatusDisplays();
    }

    // Logging system
    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logMessage = `[${timestamp}] ${message}\n`;
        
        if (this.logContainer) {
            this.logContainer.textContent += logMessage;
            this.logContainer.scrollTop = this.logContainer.scrollHeight;
        }
        
        console.log(`[FreighterTester] ${message}`);
    }

    clearLog() {
        if (this.logContainer) {
            this.logContainer.textContent = 'Log cleared...\n';
        }
    }

    // Update status displays
    updateStatusDisplays() {
        if (this.extensionStatus) {
            this.extensionStatus.textContent = this.testResults.extension ? '✅ Available' : '❌ Not Available';
            this.extensionStatus.style.color = this.testResults.extension ? '#22c55e' : '#ef4444';
        }

        if (this.apiStatus) {
            this.apiStatus.textContent = this.testResults.api ? '✅ Available' : '❌ Not Available';
            this.apiStatus.style.color = this.testResults.api ? '#22c55e' : '#ef4444';
        }

        if (this.networkStatus) {
            this.networkStatus.textContent = this.network || 'Unknown';
            this.networkStatus.style.color = this.network ? '#22c55e' : '#ef4444';
        }

        if (this.publicKeyStatus) {
            this.publicKeyStatus.textContent = this.publicKey ? `${this.publicKey.slice(0, 8)}...` : 'Not connected';
            this.publicKeyStatus.style.color = this.publicKey ? '#22c55e' : '#ef4444';
        }

        if (this.isConnectedStatus) {
            this.isConnectedStatus.textContent = this.isConnected ? 'True' : 'False';
            this.isConnectedStatus.style.color = this.isConnected ? '#22c55e' : '#ef4444';
        }
    }

    // Update status indicators
    updateStatusIndicator(element, status) {
        if (element) {
            element.className = `status-indicator ${status}`;
        }
    }

    // Update test results
    updateTestResults(container, message, type = 'info') {
        if (container) {
            container.textContent = message;
            container.className = `test-results ${type}`;
        }
    }

    // Test 1: Extension Detection
    async testExtensionDetection() {
        this.log('🔍 Testing Freighter extension detection...');
        
        try {
            // Check if Freighter extension is available
            // According to official docs, the API should be available as window.freighterApi
            if (typeof window.freighterApi !== 'undefined') {
                this.testResults.extension = true;
                this.updateTestResults(this.basicResults, '✅ Freighter extension detected via freighterApi', 'success');
                this.updateStatusIndicator(this.basicStatus, 'connected');
                this.log('✅ Freighter extension detected via freighterApi');
            } else {
                this.testResults.extension = false;
                this.updateTestResults(this.basicResults, '❌ Freighter extension not detected. Please install Freighter extension from Chrome Web Store.', 'error');
                this.updateStatusIndicator(this.basicStatus, '');
                this.log('❌ Freighter extension not detected');
                this.log('💡 Make sure Freighter extension is installed and enabled in your browser');
            }
        } catch (error) {
            this.testResults.extension = false;
            this.updateTestResults(this.basicResults, `❌ Error detecting extension: ${error.message}`, 'error');
            this.log(`❌ Error detecting extension: ${error.message}`);
        }
    }

    // Test 2: API Availability
    async testApiAvailability() {
        this.log('🔍 Testing Freighter API availability...');
        
        try {
            if (typeof window.freighterApi !== 'undefined') {
                // Test if API methods are available according to official documentation
                const methods = ['isConnected', 'getPublicKey', 'requestAccess', 'signTransaction'];
                let availableMethods = 0;
                let methodDetails = [];
                
                for (const method of methods) {
                    if (typeof window.freighterApi[method] === 'function') {
                        availableMethods++;
                        methodDetails.push(`✅ ${method}`);
                    } else {
                        methodDetails.push(`❌ ${method}`);
                    }
                }
                
                // Check for optional methods
                const optionalMethods = ['simulateTransaction', 'submitTransaction'];
                for (const method of optionalMethods) {
                    if (typeof window.freighterApi[method] === 'function') {
                        availableMethods++;
                        methodDetails.push(`✅ ${method} (optional)`);
                    } else {
                        methodDetails.push(`⚠️ ${method} (not available)`);
                    }
                }
                
                // Only require essential methods (isConnected, getPublicKey, signTransaction)
                const essentialMethods = ['isConnected', 'getPublicKey', 'signTransaction'];
                let essentialAvailable = 0;
                
                for (const method of essentialMethods) {
                    if (typeof window.freighterApi[method] === 'function') {
                        essentialAvailable++;
                    }
                }
                
                if (essentialAvailable === essentialMethods.length) {
                    this.testResults.api = true;
                    this.updateTestResults(this.basicResults, '✅ Essential Freighter API methods available', 'success');
                    this.log('✅ Essential Freighter API methods available');
                    this.log(`Method status:\n${methodDetails.join('\n')}`);
                } else {
                    this.testResults.api = false;
                    this.updateTestResults(this.basicResults, `❌ Missing essential API methods (${essentialAvailable}/${essentialMethods.length})`, 'error');
                    this.log(`❌ Missing essential API methods (${essentialAvailable}/${essentialMethods.length})`);
                    this.log(`Method status:\n${methodDetails.join('\n')}`);
                }
            } else {
                this.testResults.api = false;
                this.updateTestResults(this.basicResults, '❌ Freighter API not available. Check if extension is installed.', 'error');
                this.log('❌ Freighter API not available');
                this.log('💡 Install Freighter extension from Chrome Web Store');
            }
        } catch (error) {
            this.testResults.api = false;
            this.updateTestResults(this.basicResults, `❌ Error testing API: ${error.message}`, 'error');
            this.log(`❌ Error testing API: ${error.message}`);
        }
    }

    // Test 3: Connection Test
    async testConnection() {
        this.log('🔍 Testing Freighter connection...');
        
        try {
            if (typeof window.freighterApi !== 'undefined') {
                const isConnected = await window.freighterApi.isConnected();
                this.testResults.connection = isConnected;
                
                if (isConnected) {
                    this.updateTestResults(this.basicResults, '✅ Freighter is connected', 'success');
                    this.log('✅ Freighter is connected');
                } else {
                    this.updateTestResults(this.basicResults, '⚠️ Freighter is not connected (this is normal if not connected yet)', 'info');
                    this.log('⚠️ Freighter is not connected (this is normal if not connected yet)');
                }
            } else {
                this.testResults.connection = false;
                this.updateTestResults(this.basicResults, '❌ Cannot test connection - API not available', 'error');
                this.log('❌ Cannot test connection - API not available');
            }
        } catch (error) {
            this.testResults.connection = false;
            this.updateTestResults(this.basicResults, `❌ Error testing connection: ${error.message}`, 'error');
            this.log(`❌ Error testing connection: ${error.message}`);
        }
    }

    // Test 4: Connect Wallet
    async testConnectWallet() {
        this.log('🔍 Testing wallet connection...');
        
        try {
            if (typeof window.freighterApi === 'undefined') {
                this.updateTestResults(this.walletResults, '❌ Freighter API not available. Install Freighter extension.', 'error');
                this.log('❌ Freighter API not available. Install Freighter extension.');
                return;
            }

            // Check if already connected first
            const isConnected = await window.freighterApi.isConnected();
            
            if (isConnected) {
                this.log('🔑 Wallet already connected, getting public key...');
                const publicKeyResult = await window.freighterApi.getPublicKey();
                
                if (publicKeyResult && !publicKeyResult.error) {
                    this.publicKey = publicKeyResult.publicKey;
                    this.isConnected = true;
                    this.network = 'testnet';
                    
                    this.testResults.wallet = true;
                    this.updateTestResults(this.walletResults, `✅ Wallet already connected!\nPublic Key: ${this.publicKey}`, 'success');
                    this.updateStatusIndicator(this.walletStatus, 'connected');
                    
                    // Enable transaction buttons
                    this.testDisconnectBtn.disabled = false;
                    this.testGetPublicKeyBtn.disabled = false;
                    this.testIsConnectedBtn.disabled = false;
                    this.testSignTxBtn.disabled = false;
                    this.testSimulateTxBtn.disabled = false;
                    this.testSubmitTxBtn.disabled = false;
                    
                    this.log(`✅ Wallet already connected! Public Key: ${this.publicKey}`);
                    this.log(`🌐 Network: ${this.network}`);
                } else {
                    this.testResults.wallet = false;
                    this.updateTestResults(this.walletResults, `❌ Failed to get public key: ${publicKeyResult?.error || 'Unknown error'}`, 'error');
                    this.log(`❌ Failed to get public key: ${publicKeyResult?.error || 'Unknown error'}`);
                }
            } else {
                // Try to request access if method is available
                if (typeof window.freighterApi.requestAccess === 'function') {
                    this.log('📱 Requesting access to Freighter wallet...');
                    const accessResult = await window.freighterApi.requestAccess();
                    
                    if (accessResult && !accessResult.error) {
                        this.log('🔑 Getting public key from Freighter...');
                        const publicKeyResult = await window.freighterApi.getPublicKey();
                        
                        if (publicKeyResult && !publicKeyResult.error) {
                            this.publicKey = publicKeyResult.publicKey;
                            this.isConnected = true;
                            this.network = 'testnet';
                            
                            this.testResults.wallet = true;
                            this.updateTestResults(this.walletResults, `✅ Wallet connected successfully!\nPublic Key: ${this.publicKey}`, 'success');
                            this.updateStatusIndicator(this.walletStatus, 'connected');
                            
                            // Enable transaction buttons
                            this.testDisconnectBtn.disabled = false;
                            this.testGetPublicKeyBtn.disabled = false;
                            this.testIsConnectedBtn.disabled = false;
                            this.testSignTxBtn.disabled = false;
                            this.testSimulateTxBtn.disabled = false;
                            this.testSubmitTxBtn.disabled = false;
                            
                            this.log(`✅ Wallet connected successfully! Public Key: ${this.publicKey}`);
                            this.log(`🌐 Network: ${this.network}`);
                        } else {
                            this.testResults.wallet = false;
                            this.updateTestResults(this.walletResults, `❌ Failed to get public key: ${publicKeyResult?.error || 'Unknown error'}`, 'error');
                            this.log(`❌ Failed to get public key: ${publicKeyResult?.error || 'Unknown error'}`);
                        }
                    } else {
                        this.testResults.wallet = false;
                        this.updateTestResults(this.walletResults, `❌ Failed to request access: ${accessResult?.error || 'User cancelled or extension not available'}`, 'error');
                        this.log(`❌ Failed to request access: ${accessResult?.error || 'User cancelled or extension not available'}`);
                        this.log('💡 Make sure Freighter extension is installed and unlocked');
                    }
                } else {
                    this.testResults.wallet = false;
                    this.updateTestResults(this.walletResults, '❌ Wallet not connected and requestAccess not available. Please connect manually in Freighter.', 'error');
                    this.log('❌ Wallet not connected and requestAccess not available');
                    this.log('💡 Please open Freighter extension and connect manually, then refresh this page');
                }
            }
        } catch (error) {
            this.testResults.wallet = false;
            this.updateTestResults(this.walletResults, `❌ Error connecting wallet: ${error.message}`, 'error');
            this.log(`❌ Error connecting wallet: ${error.message}`);
            this.log('💡 Check if Freighter extension is properly installed and enabled');
        }
        
        this.updateStatusDisplays();
    }

    // Test 5: Disconnect Wallet
    async testDisconnectWallet() {
        this.log('🔍 Testing wallet disconnection...');
        
        try {
            // Freighter doesn't have a disconnect method, so we just clear our state
            this.publicKey = null;
            this.isConnected = false;
            this.network = null;
            
            this.testResults.wallet = false;
            this.updateTestResults(this.walletResults, '✅ Wallet disconnected (state cleared)', 'success');
            this.updateStatusIndicator(this.walletStatus, '');
            
            // Disable transaction buttons
            this.testDisconnectBtn.disabled = true;
            this.testGetPublicKeyBtn.disabled = true;
            this.testIsConnectedBtn.disabled = true;
            this.testSignTxBtn.disabled = true;
            this.testSimulateTxBtn.disabled = true;
            this.testSubmitTxBtn.disabled = true;
            
            this.log('✅ Wallet disconnected (state cleared)');
        } catch (error) {
            this.updateTestResults(this.walletResults, `❌ Error disconnecting wallet: ${error.message}`, 'error');
            this.log(`❌ Error disconnecting wallet: ${error.message}`);
        }
        
        this.updateStatusDisplays();
    }

    // Test 6: Get Public Key
    async testGetPublicKey() {
        this.log('🔍 Testing get public key...');
        
        try {
            if (typeof window.freighterApi === 'undefined') {
                this.updateTestResults(this.walletResults, '❌ Freighter API not available', 'error');
                return;
            }

            const result = await window.freighterApi.getPublicKey();
            
            if (result && !result.error) {
                this.publicKey = result.publicKey;
                this.updateTestResults(this.walletResults, `✅ Public key retrieved: ${this.publicKey}`, 'success');
                this.log(`✅ Public key retrieved: ${this.publicKey}`);
            } else {
                this.updateTestResults(this.walletResults, `❌ Failed to get public key: ${result?.error || 'Unknown error'}`, 'error');
                this.log(`❌ Failed to get public key: ${result?.error || 'Unknown error'}`);
            }
        } catch (error) {
            this.updateTestResults(this.walletResults, `❌ Error getting public key: ${error.message}`, 'error');
            this.log(`❌ Error getting public key: ${error.message}`);
        }
        
        this.updateStatusDisplays();
    }

    // Test 7: Check Connection Status
    async testIsConnected() {
        this.log('🔍 Testing connection status...');
        
        try {
            if (typeof window.freighterApi === 'undefined') {
                this.updateTestResults(this.walletResults, '❌ Freighter API not available', 'error');
                return;
            }

            const result = await window.freighterApi.isConnected();
            
            this.isConnected = result;
            this.updateTestResults(this.walletResults, `✅ Connection status: ${result ? 'Connected' : 'Not Connected'}`, 'success');
            this.log(`✅ Connection status: ${result ? 'Connected' : 'Not Connected'}`);
        } catch (error) {
            this.updateTestResults(this.walletResults, `❌ Error checking connection status: ${error.message}`, 'error');
            this.log(`❌ Error checking connection status: ${error.message}`);
        }
        
        this.updateStatusDisplays();
    }

    // Test 8: Sign Transaction
    async testSignTransaction() {
        this.log('🔍 Testing transaction signing...');
        
        try {
            if (typeof window.freighterApi === 'undefined') {
                this.updateTestResults(this.txResults, '❌ Freighter API not available', 'error');
                return;
            }

            if (!this.publicKey) {
                this.updateTestResults(this.txResults, '❌ No public key available. Connect wallet first.', 'error');
                return;
            }

            // Create a simple test transaction
            const server = new window.StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
            const account = await server.loadAccount(this.publicKey);
            
            const transaction = new window.StellarSdk.TransactionBuilder(account, {
                fee: window.StellarSdk.BASE_FEE,
                networkPassphrase: window.StellarSdk.Networks.TESTNET,
            })
            .addOperation(window.StellarSdk.Operation.manageData({
                name: 'freighter_test',
                value: 'test_data'
            }))
            .setTimeout(30)
            .build();

            const xdr = transaction.toXDR();
            
            // Sign the transaction
            const signResult = await window.freighterApi.signTransaction(xdr, {
                network: 'TESTNET',
                accountToSign: this.publicKey
            });
            
            if (signResult && !signResult.error) {
                this.testResults.transactions = true;
                this.updateTestResults(this.txResults, '✅ Transaction signed successfully!', 'success');
                this.updateStatusIndicator(this.txStatus, 'connected');
                this.log('✅ Transaction signed successfully!');
            } else {
                this.testResults.transactions = false;
                this.updateTestResults(this.txResults, `❌ Failed to sign transaction: ${signResult?.error || 'Unknown error'}`, 'error');
                this.log(`❌ Failed to sign transaction: ${signResult?.error || 'Unknown error'}`);
            }
        } catch (error) {
            this.testResults.transactions = false;
            this.updateTestResults(this.txResults, `❌ Error signing transaction: ${error.message}`, 'error');
            this.log(`❌ Error signing transaction: ${error.message}`);
        }
    }

    // Test 9: Simulate Transaction
    async testSimulateTransaction() {
        this.log('🔍 Testing transaction simulation...');
        
        try {
            if (typeof window.freighterApi === 'undefined') {
                this.updateTestResults(this.txResults, '❌ Freighter API not available', 'error');
                return;
            }

            if (!this.publicKey) {
                this.updateTestResults(this.txResults, '❌ No public key available. Connect wallet first.', 'error');
                return;
            }

            // Create a simple test transaction
            const server = new window.StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
            const account = await server.loadAccount(this.publicKey);
            
            const transaction = new window.StellarSdk.TransactionBuilder(account, {
                fee: window.StellarSdk.BASE_FEE,
                networkPassphrase: window.StellarSdk.Networks.TESTNET,
            })
            .addOperation(window.StellarSdk.Operation.manageData({
                name: 'freighter_simulate_test',
                value: 'simulate_data'
            }))
            .setTimeout(30)
            .build();

            const xdr = transaction.toXDR();
            
            // Simulate the transaction
            const simulateResult = await window.freighterApi.simulateTransaction(xdr);
            
            if (simulateResult && !simulateResult.error) {
                this.updateTestResults(this.txResults, '✅ Transaction simulated successfully!', 'success');
                this.log('✅ Transaction simulated successfully!');
            } else {
                this.updateTestResults(this.txResults, `❌ Failed to simulate transaction: ${simulateResult?.error || 'Unknown error'}`, 'error');
                this.log(`❌ Failed to simulate transaction: ${simulateResult?.error || 'Unknown error'}`);
            }
        } catch (error) {
            this.updateTestResults(this.txResults, `❌ Error simulating transaction: ${error.message}`, 'error');
            this.log(`❌ Error simulating transaction: ${error.message}`);
        }
    }

    // Test 10: Submit Transaction
    async testSubmitTransaction() {
        this.log('🔍 Testing transaction submission...');
        
        try {
            if (typeof window.freighterApi === 'undefined') {
                this.updateTestResults(this.txResults, '❌ Freighter API not available', 'error');
                return;
            }

            if (!this.publicKey) {
                this.updateTestResults(this.txResults, '❌ No public key available. Connect wallet first.', 'error');
                return;
            }

            // Create a simple test transaction
            const server = new window.StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
            const account = await server.loadAccount(this.publicKey);
            
            const transaction = new window.StellarSdk.TransactionBuilder(account, {
                fee: window.StellarSdk.BASE_FEE,
                networkPassphrase: window.StellarSdk.Networks.TESTNET,
            })
            .addOperation(window.StellarSdk.Operation.manageData({
                name: 'freighter_submit_test',
                value: 'submit_data'
            }))
            .setTimeout(30)
            .build();

            const xdr = transaction.toXDR();
            
            // Sign the transaction first
            const signResult = await window.freighterApi.signTransaction(xdr, {
                network: 'TESTNET',
                accountToSign: this.publicKey
            });
            
            if (signResult && !signResult.error) {
                // Submit the signed transaction
                const submitResult = await window.freighterApi.submitTransaction(signResult.signedTxXdr);
                
                if (submitResult && !submitResult.error) {
                    this.updateTestResults(this.txResults, `✅ Transaction submitted successfully!\nTxHash: ${submitResult.txHash}`, 'success');
                    this.log(`✅ Transaction submitted successfully! TxHash: ${submitResult.txHash}`);
                } else {
                    this.updateTestResults(this.txResults, `❌ Failed to submit transaction: ${submitResult?.error || 'Unknown error'}`, 'error');
                    this.log(`❌ Failed to submit transaction: ${submitResult?.error || 'Unknown error'}`);
                }
            } else {
                this.updateTestResults(this.txResults, `❌ Failed to sign transaction for submission: ${signResult?.error || 'Unknown error'}`, 'error');
                this.log(`❌ Failed to sign transaction for submission: ${signResult?.error || 'Unknown error'}`);
            }
        } catch (error) {
            this.updateTestResults(this.txResults, `❌ Error submitting transaction: ${error.message}`, 'error');
            this.log(`❌ Error submitting transaction: ${error.message}`);
        }
    }

    // Test 11: Network Connection
    async testNetworkConnection() {
        this.log('🔍 Testing network connection...');
        
        try {
            if (typeof window.StellarSdk === 'undefined') {
                this.updateTestResults(this.networkResults, '❌ StellarSdk not available', 'error');
                return;
            }

            // Test Horizon connection
            const horizonServer = new window.StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
            const ledgerInfo = await horizonServer.ledgers().order('desc').limit(1).call();
            
            if (ledgerInfo.records && ledgerInfo.records.length > 0) {
                this.testResults.network = true;
                this.network = 'testnet';
                this.updateTestResults(this.networkResults, '✅ Network connection successful!\nHorizon API is responding', 'success');
                this.updateStatusIndicator(this.networkTestStatus, 'connected');
                this.log('✅ Network connection successful! Horizon API is responding');
            } else {
                this.testResults.network = false;
                this.updateTestResults(this.networkResults, '❌ Network connection failed - No ledger data received', 'error');
                this.log('❌ Network connection failed - No ledger data received');
            }
        } catch (error) {
            this.testResults.network = false;
            this.updateTestResults(this.networkResults, `❌ Network connection error: ${error.message}`, 'error');
            this.log(`❌ Network connection error: ${error.message}`);
        }
        
        this.updateStatusDisplays();
    }

    // Test 12: Horizon API
    async testHorizonAPI() {
        this.log('🔍 Testing Horizon API...');
        
        try {
            if (typeof window.StellarSdk === 'undefined') {
                this.updateTestResults(this.networkResults, '❌ StellarSdk not available', 'error');
                return;
            }

            const horizonServer = new window.StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
            
            // Test multiple endpoints
            const tests = [
                { name: 'Ledgers', test: () => horizonServer.ledgers().order('desc').limit(1).call() },
                { name: 'Accounts', test: () => horizonServer.accounts().limit(1).call() },
                { name: 'Transactions', test: () => horizonServer.transactions().order('desc').limit(1).call() }
            ];
            
            let passedTests = 0;
            let results = [];
            
            for (const test of tests) {
                try {
                    const result = await test.test();
                    if (result.records) {
                        passedTests++;
                        results.push(`✅ ${test.name}: OK`);
                    } else {
                        results.push(`❌ ${test.name}: No records`);
                    }
                } catch (error) {
                    results.push(`❌ ${test.name}: ${error.message}`);
                }
            }
            
            if (passedTests === tests.length) {
                this.updateTestResults(this.networkResults, `✅ Horizon API tests passed!\n${results.join('\n')}`, 'success');
                this.log(`✅ Horizon API tests passed! ${passedTests}/${tests.length} tests successful`);
            } else {
                this.updateTestResults(this.networkResults, `⚠️ Horizon API partial success\n${results.join('\n')}`, 'error');
                this.log(`⚠️ Horizon API partial success ${passedTests}/${tests.length} tests successful`);
            }
        } catch (error) {
            this.updateTestResults(this.networkResults, `❌ Horizon API error: ${error.message}`, 'error');
            this.log(`❌ Horizon API error: ${error.message}`);
        }
    }

    // Test 13: Soroban RPC
    async testSorobanRPC() {
        this.log('🔍 Testing Soroban RPC...');
        
        try {
            if (typeof window.StellarSdk === 'undefined') {
                this.updateTestResults(this.networkResults, '❌ StellarSdk not available', 'error');
                return;
            }

            if (!window.StellarSdk.SorobanRpc) {
                this.updateTestResults(this.networkResults, '❌ SorobanRpc not available in StellarSdk', 'error');
                return;
            }

            const sorobanServer = new window.StellarSdk.SorobanRpc.Server('https://soroban-testnet.stellar.org');
            
            // Test Soroban RPC connection
            const healthCheck = await sorobanServer.getHealth();
            
            if (healthCheck && healthCheck.status === 'healthy') {
                this.updateTestResults(this.networkResults, '✅ Soroban RPC is healthy!\nStatus: ' + healthCheck.status, 'success');
                this.log('✅ Soroban RPC is healthy!');
            } else {
                this.updateTestResults(this.networkResults, '❌ Soroban RPC health check failed', 'error');
                this.log('❌ Soroban RPC health check failed');
            }
        } catch (error) {
            this.updateTestResults(this.networkResults, `❌ Soroban RPC error: ${error.message}`, 'error');
            this.log(`❌ Soroban RPC error: ${error.message}`);
        }
    }
}

// Initialize the tester when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.freighterTester = new FreighterTester();
    console.log('✅ Freighter Tester initialized');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FreighterTester;
}
