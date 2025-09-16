// Web3 Configuration for DOBI Smart Contracts
// This file contains all the contract addresses and network configuration

export const CONTRACT_ADDRESSES = {
    DOBI_ORACLE: 'CDBGL47SEEVMCQAI43CCDYNLC5MRY2TM27PZY3TGYE7SZRQRX56JIUTE',
    DOBI_REWARDS: 'CCUB6RWU6563VVWT24V6HG45WZ6BQPH7PGYLS6JG7ZGDRGJBRWOICJ2U',
    PAYMENT_ASSET: 'XLM'
};

// Contract Status: DEPLOYED ✅
// - DobiOracle: https://stellar.expert/explorer/testnet/contract/CDBGL47SEEVMCQAI43CCDYNLC5MRY2TM27PZY3TGYE7SZRQRX56JIUTE
// - DobiRewards: https://stellar.expert/explorer/testnet/contract/CCUB6RWU6563VVWT24V6HG45WZ6BQPH7PGYLS6JG7ZGDRGJBRWOICJ2U

// Network Configuration
export const NETWORK_CONFIG = {
    TESTNET: {
        networkPassphrase: 'Test SDF Network ; September 2015',
        horizonUrl: 'https://horizon-testnet.stellar.org',
        sorobanRpcUrl: 'https://soroban-testnet.stellar.org'
    },
    MAINNET: {
        networkPassphrase: 'Public Global Stellar Network ; September 2015',
        horizonUrl: 'https://horizon.stellar.org',
        sorobanRpcUrl: 'https://soroban-mainnet.stellar.org'
    }
};

// Current network (change to MAINNET for production)
export const CURRENT_NETWORK = 'TESTNET';

// Next Steps:
// 1. Initialize Oracle contract with admin address
// 2. Initialize Rewards contract with Oracle contract address
// 3. Add validators to Oracle contract
// 4. Fund contracts with XLM for transaction fees
