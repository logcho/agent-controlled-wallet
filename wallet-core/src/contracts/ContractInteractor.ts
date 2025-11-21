import { ethers } from "ethers";
import type { IWallet } from "../interfaces/IWallet";

/**
 * Generic contract interactor for EVM-based chains (Ethereum, Polygon, etc.).
 * Uses the wallet's signer + provider to call smart contracts.
 */
export class ContractInteractor {
  
  /**
   * Perform a read-only contract call (no signing, no gas).
   */
  static async read(
    wallet: IWallet,
    contractAddress: string,
    abi: any[],
    method: string,
    args: any[] = []
  ): Promise<any> {
    // Only Ethereum wallet supports contract calls right now
    if (wallet.chain !== "Ethereum") {
      throw new Error(`Chain ${wallet.chain} does not support contract read calls yet.`);
    }

    // Get the underlying provider & signer
    const ethWallet = wallet as unknown as {
      provider?: ethers.Provider;
      wallet?: ethers.Wallet;
    };

    if (!ethWallet.provider) {
      throw new Error("Ethereum wallet has no provider attached.");
    }

    const contract = new ethers.Contract(contractAddress, abi, ethWallet.provider);
    return await contract[method](...args);
  }

  /**
   * Perform a write transaction (state-changing).
   */
  static async write(
    wallet: IWallet,
    contractAddress: string,
    abi: any[],
    method: string,
    args: any[] = [],
    overrides: Record<string, any> = {}
  ): Promise<string> {

    if (wallet.chain !== "Ethereum") {
      throw new Error(`Chain ${wallet.chain} does not support contract writes.`);
    }

    const ethWallet = wallet as any;
    if (!ethWallet.wallet) {
      throw new Error("Ethereum wallet not loaded.");
    }

    const signer = ethWallet.wallet;

    // Interface handles encoding in ethers v6
    const iface = new ethers.Interface(abi);

    // Ensure method exists
    const fn = iface.getFunction(method);
    if (!fn) {
      throw new Error(`Method "${method}" not found in ABI`);
    }

    // Encode ABI call properly
    const data = iface.encodeFunctionData(method, args);
    console.log("Encoded ABI data:", data);

    // Build tx
    const txRequest: ethers.TransactionRequest = {
      to: contractAddress,
      data,
      ...overrides,
    };

    // Send tx
    const tx = await signer.sendTransaction(txRequest);
    const receipt = await tx.wait();

    return receipt.hash;
  }
}  
