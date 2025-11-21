# wallet-core

A modular, multi-chain wallet framework built for AI-driven interaction with blockchain networks. This project implements a unified wallet interface and chain-specific wallet implementations (Ethereum, Solana), along with utilities for smart contract interaction.

## IWallet Interface
- generateNewWallet()
- loadFromPrivateKey() / loadFromMnemonic()
- signMessage()signTransaction()
- sendTransaction()
- getBalance()
- getNetworkInfo()
- Optional: createTransactionData()


## Running Tests

Each test uses tsx for TypeScript execution.

Run wallet tests:

```
npx tsx test/ethereumContract.test.ts
npx tsx test/ethereumSwap.test.ts
npx tsx test/solanaWallet.test.ts
```

### TODO: 
- Implement Cosmos implementation
- Create Wallet Core containing all wallet implementations
- Complete a swap
- Connect to MCP
- Let MCP make a transfer/deploy