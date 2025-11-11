export interface IWallet {
  /** The blockchain this wallet belongs to, e.g. "Ethereum", "Solana", "Cosmos" */
  readonly chain: string;

  /** Return the wallet's public address in chain-specific format */
  getAddress(): string;

  /** Generate a new wallet with secure randomness */
  generateNewWallet(): Promise<void>;

  /** Load an existing wallet from private key or mnemonic */
  loadFromPrivateKey(privateKey: string): Promise<void>;
  loadFromMnemonic(mnemonic: string): Promise<void>;

  /** Export the wallet's private key (if applicable) */
  exportPrivateKey(): string | null;

  /** Sign an arbitrary message (off-chain) */
  signMessage(message: string | Uint8Array): Promise<string>;

  /**
   * Sign a chain-specific transaction or instruction.
   * Each chain can define its own transaction data shape.
   */
  signTransaction(txData: unknown): Promise<string | Uint8Array>;

  /**
   * Broadcast a signed transaction to the network.
   * Input can be a signed payload (string/bytes) and output should be a tx hash/id.
   */
  sendTransaction(signedTx: string | Uint8Array): Promise<string>;

  /** Retrieve the wallet's native balance as a stringified amount */
  getBalance(): Promise<string>;

  /** Get network information (chainId, cluster, RPC URL, etc.) */
  getNetworkInfo(): Promise<Record<string, string | number | undefined>>;

  /** Optional helper: build a valid transaction skeleton for this chain */
  createTransactionData?(
    to: string,
    amount: string,
    extra?: Record<string, any>
  ): Promise<unknown>;
}
