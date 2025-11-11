import { ethers } from "ethers";
import type { IWallet } from "../interfaces/IWallet";

/**
 * EthereumWallet implements the IWallet interface for Ethereum-compatible chains.
 * Provides key management, signing, balance retrieval, and transaction handling.
 */
export class EthereumWallet implements IWallet {
  /** The name of the blockchain */
  readonly chain = "Ethereum";

  /** Ethers.js wallet instance (secp256k1 keypair) */
  private wallet?: ethers.Wallet | ethers.HDNodeWallet;

  /** RPC provider connected to the Ethereum network */
  private provider?: ethers.AbstractProvider;

  /** The RPC URL used to connect this wallet */
  private rpcUrl?: string;

  constructor(rpcUrl?: string) {
    if (rpcUrl) {
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      this.rpcUrl = rpcUrl;
    }
  }

  /** Generates a new wallet using secure random entropy */
  async generateNewWallet(): Promise<void> {
    const w = ethers.Wallet.createRandom();
    this.wallet = this.provider ? w.connect(this.provider) : w;
  }

  /** Loads an existing wallet from a raw private key */
  async loadFromPrivateKey(privateKey: string): Promise<void> {
    const w = new ethers.Wallet(privateKey);
    this.wallet = this.provider ? w.connect(this.provider) : w;
  }

  /** Loads an existing wallet from a mnemonic phrase */
  async loadFromMnemonic(mnemonic: string): Promise<void> {
    const w = ethers.Wallet.fromPhrase(mnemonic);
    this.wallet = this.provider ? w.connect(this.provider) : w;
  }

  /** Returns the wallet’s public address */
  getAddress(): string {
    if (!this.wallet) throw new Error("Wallet not loaded");
    return this.wallet.address;
  }

  /** Exports the private key (if supported) */
  exportPrivateKey(): string {
    if (!this.wallet) throw new Error("Wallet not loaded");
    return this.wallet.privateKey;
  }

  /** Signs an arbitrary UTF-8 message */
  async signMessage(message: string): Promise<string> {
    if (!this.wallet) throw new Error("Wallet not loaded");
    return this.wallet.signMessage(message);
  }

  /** Signs a raw Ethereum transaction request */
  async signTransaction(txData: any): Promise<string> {
    if (!this.wallet) throw new Error("Wallet not loaded");

    // Ensure chainId is included when provider is available
    if (this.provider && !txData.chainId) {
      const network = await this.provider.getNetwork();
      txData.chainId = Number(network.chainId);
    }

    return await this.wallet.signTransaction(txData);
  }

  /** Broadcasts a signed transaction to the network */
  async sendTransaction(signedTx: string): Promise<string> {
    if (!this.provider) throw new Error("No provider available");
    const resp = await this.provider.broadcastTransaction(signedTx);
    return resp.hash;
  }

  /** Retrieves the wallet’s balance in native ETH */
  async getBalance(): Promise<string> {
    if (!this.wallet || !this.provider)
      throw new Error("Wallet not ready");
    const wei = await this.provider.getBalance(this.wallet.address);
    return ethers.formatEther(wei);
  }

  /** Returns network information such as chainId and RPC URL */
  async getNetworkInfo(): Promise<{ chainId: string; rpcUrl?: string }> {
    if (!this.provider) throw new Error("No provider available");
    const net = await this.provider.getNetwork();
    return { chainId: net.chainId.toString(), rpcUrl: this.rpcUrl };
  }

  /**
   * Constructs a transaction object with populated gas fees, nonce, and chainId.
   * Used as a helper before signing or sending.
   */
  async createTransactionData(
    to: string,
    amountEth: string,
    overrides?: Partial<ethers.TransactionRequest>
  ): Promise<ethers.TransactionRequest> {
    if (!this.wallet || !this.provider)
      throw new Error("Wallet not ready: connect a provider first");

    // Fetch current fee data, nonce, and network info concurrently
    const [feeData, nonce, network] = await Promise.all([
      this.provider.getFeeData(),
      this.provider.getTransactionCount(this.wallet.address),
      this.provider.getNetwork(),
    ]);

    // Construct a populated transaction
    const tx: ethers.TransactionRequest = {
      to,
      value: ethers.parseEther(amountEth),
      gasLimit: 21_000n, // default for simple transfers
      maxFeePerGas:
        feeData.maxFeePerGas ?? ethers.parseUnits("20", "gwei"),
      maxPriorityFeePerGas:
        feeData.maxPriorityFeePerGas ?? ethers.parseUnits("1", "gwei"),
      nonce,
      chainId: Number(network.chainId),
      ...overrides, // allow user-specified overrides
    };

    return tx;
  }
}
