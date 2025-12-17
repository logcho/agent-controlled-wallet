import { EthereumWallet } from "./EthereumWallet";
import { SolanaWallet } from "./SolanaWallet";
import { CosmosWallet } from "./CosmosWallet";
import type { IWallet } from "../interfaces/IWallet";

/**
 * Configuration interface for MultiChainWallet
 */
export interface MultiChainConfig {
    ethRpcUrl?: string;
    solanaRpcUrl?: string;
    cosmosRpcUrl?: string;
    cosmosPrefix?: string;
}

/**
 * MultiChainWallet wraps specific chain implementations into a single manager.
 */
export class MultiChainWallet {
    public readonly ethereum: EthereumWallet;
    public readonly solana: SolanaWallet;
    public readonly cosmos: CosmosWallet;

    constructor(config: MultiChainConfig = {}) {
        this.ethereum = new EthereumWallet(config.ethRpcUrl);
        this.solana = new SolanaWallet(config.solanaRpcUrl);
        this.cosmos = new CosmosWallet(config.cosmosRpcUrl, config.cosmosPrefix);
    }

    /**
     * Generates new random wallets for all chains.
     * NOTE: This generates DISTINCT random keys for each chain.
     * They will NOT share a mnemonic.
     */
    async generateAll(): Promise<void> {
        await Promise.all([
            this.ethereum.generateNewWallet(),
            this.solana.generateNewWallet(),
            this.cosmos.generateNewWallet(),
        ]);
    }

    /**
     * Loads all wallets from a single mnemonic phrase.
     * This ensures all wallets are derived from the same seed (using their respective standard paths).
     */
    async loadFromMnemonic(mnemonic: string): Promise<void> {
        await Promise.all([
            this.ethereum.loadFromMnemonic(mnemonic),
            this.solana.loadFromMnemonic(mnemonic),
            this.cosmos.loadFromMnemonic(mnemonic),
        ]);
    }

    /**
     * Retrieves a wallet instance by chain name.
     */
    getWallet(chain: string): IWallet | undefined {
        switch (chain.toLowerCase()) {
            case "ethereum":
            case "eth":
                return this.ethereum;
            case "solana":
            case "sol":
                return this.solana;
            case "cosmos":
            case "atom":
                return this.cosmos;
            default:
                return undefined;
        }
    }

    /**
     * Returns a map of all wallet addresses.
     */
    getAllAddresses(): Record<string, string> {
        return {
            Ethereum: this.ethereum.getAddress(),
            Solana: this.solana.getAddress(),
            Cosmos: this.cosmos.getAddress(),
        };
    }
}
