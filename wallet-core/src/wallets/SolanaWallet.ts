import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
  } from "@solana/web3.js";
  import bs58 from "bs58";
  import { Buffer } from "node:buffer";
  import * as bip39 from "bip39";
  import { derivePath } from "ed25519-hd-key";
  import * as nacl from "tweetnacl";
  import type { IWallet } from "../interfaces/IWallet";
  
  /**
   * SolanaWallet implements the IWallet interface for the Solana blockchain.
   * Provides key management, signing, balance retrieval, and transaction creation.
   */
  export class SolanaWallet implements IWallet {
    /** Name of the blockchain */
    readonly chain = "Solana";
  
    /** Solana keypair (ed25519 keypair) */
    private keypair?: Keypair;
  
    /** RPC connection to a Solana cluster */
    private connection?: Connection;
  
    /** RPC URL used by this wallet */
    private rpcUrl?: string;
  
    constructor(rpcUrl?: string) {
      if (rpcUrl) {
        this.connection = new Connection(rpcUrl, "confirmed");
        this.rpcUrl = rpcUrl;
      }
    }
  
    /** Returns the wallet’s public address (base58 format) */
    getAddress(): string {
      if (!this.keypair) throw new Error("Wallet not loaded");
      return this.keypair.publicKey.toBase58();
    }
  
    /** Generates a new random Solana keypair */
    async generateNewWallet(): Promise<void> {
      this.keypair = Keypair.generate();
    }
  
    /** Loads an existing wallet from a private key (JSON array, hex, or base58) */
    async loadFromPrivateKey(privateKey: string): Promise<void> {
      let secret: Uint8Array;
  
      if (privateKey.startsWith("[")) {
        // JSON array format
        secret = Uint8Array.from(JSON.parse(privateKey));
      } else if (privateKey.startsWith("0x")) {
        // Hex-encoded string
        const buffer = Buffer.from(privateKey.slice(2), "hex");
        secret = new Uint8Array(buffer);
      } else {
        // Base58-encoded string (default Solana export format)
        secret = bs58.decode(privateKey);
      }
  
      this.keypair = Keypair.fromSecretKey(secret);
    }
  
    /** Loads an existing wallet from a mnemonic phrase (BIP-39 standard) */
    async loadFromMnemonic(mnemonic: string): Promise<void> {
      const seed = await bip39.mnemonicToSeed(mnemonic);
      const path = "m/44'/501'/0'/0'"; // Standard Solana derivation path
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      this.keypair = Keypair.fromSeed(derivedSeed);
    }
  
    /** Exports the private key as a JSON-encoded Uint8Array string */
    exportPrivateKey(): string {
      if (!this.keypair) throw new Error("Wallet not loaded");
      return JSON.stringify(Array.from(this.keypair.secretKey));
    }
  
    /** Signs an arbitrary UTF-8 message and returns the base64-encoded signature */
    async signMessage(message: string): Promise<string> {
      if (!this.keypair) throw new Error("Wallet not loaded");
      const msgBytes = Buffer.from(message);
      const signature = nacl.sign.detached(msgBytes, this.keypair.secretKey);
      return Buffer.from(signature).toString("base64");
    }
  
    /** Signs a Solana transaction and returns the serialized bytes */
    async signTransaction(tx: Transaction): Promise<Uint8Array> {
      if (!this.keypair) throw new Error("Wallet not loaded");
      tx.sign(this.keypair);
      return tx.serialize();
    }
  
    /** Broadcasts a signed transaction to the Solana network */
    async sendTransaction(signedTx: Uint8Array): Promise<string> {
      if (!this.connection) throw new Error("No connection available");
      const txid = await this.connection.sendRawTransaction(signedTx);
      return txid;
    }
  
    /** Retrieves the wallet’s SOL balance (in SOL, not lamports) */
    async getBalance(): Promise<string> {
      if (!this.keypair || !this.connection)
        throw new Error("Wallet not ready");
      const balanceLamports = await this.connection.getBalance(this.keypair.publicKey);
      return (balanceLamports / 1e9).toFixed(9); // convert lamports → SOL
    }
  
    /** Returns network info (cluster version + RPC URL) */
    async getNetworkInfo(): Promise<{ chainId: string; rpcUrl?: string }> {
      if (!this.connection) throw new Error("No provider available");
      const version = await this.connection.getVersion();
      return { chainId: version["solana-core"], rpcUrl: this.rpcUrl };
    }
  
    /**
     * Constructs a simple SOL transfer transaction.
     * Populates blockhash and fee payer automatically.
     */
    async createTransactionData(
      to: string,
      amountSol: string
    ): Promise<Transaction> {
      if (!this.keypair || !this.connection)
        throw new Error("Wallet not ready: connect a provider first");
  
      const fromPubkey = this.keypair.publicKey;
      const toPubkey = new PublicKey(to);
      const lamports = Math.floor(parseFloat(amountSol) * 1e9);
  
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports,
        })
      );
  
      tx.feePayer = fromPubkey;
      tx.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;
  
      return tx;
    }
  }
  