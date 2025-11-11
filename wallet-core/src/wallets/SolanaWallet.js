"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaWallet = void 0;
var web3_js_1 = require("@solana/web3.js");
var bs58_1 = require("bs58");
var node_buffer_1 = require("node:buffer");
var bip39 = require("bip39");
var ed25519_hd_key_1 = require("ed25519-hd-key");
var nacl = require("tweetnacl");
/**
 * SolanaWallet implements the IWallet interface for the Solana blockchain.
 * Provides key management, signing, balance retrieval, and transaction creation.
 */
var SolanaWallet = /** @class */ (function () {
    function SolanaWallet(rpcUrl) {
        /** Name of the blockchain */
        this.chain = "Solana";
        if (rpcUrl) {
            this.connection = new web3_js_1.Connection(rpcUrl, "confirmed");
            this.rpcUrl = rpcUrl;
        }
    }
    /** Returns the wallet’s public address (base58 format) */
    SolanaWallet.prototype.getAddress = function () {
        if (!this.keypair)
            throw new Error("Wallet not loaded");
        return this.keypair.publicKey.toBase58();
    };
    /** Generates a new random Solana keypair */
    SolanaWallet.prototype.generateNewWallet = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.keypair = web3_js_1.Keypair.generate();
                return [2 /*return*/];
            });
        });
    };
    /** Loads an existing wallet from a private key (JSON array, hex, or base58) */
    SolanaWallet.prototype.loadFromPrivateKey = function (privateKey) {
        return __awaiter(this, void 0, void 0, function () {
            var secret, buffer;
            return __generator(this, function (_a) {
                if (privateKey.startsWith("[")) {
                    // JSON array format
                    secret = Uint8Array.from(JSON.parse(privateKey));
                }
                else if (privateKey.startsWith("0x")) {
                    buffer = node_buffer_1.Buffer.from(privateKey.slice(2), "hex");
                    secret = new Uint8Array(buffer);
                }
                else {
                    // Base58-encoded string (default Solana export format)
                    secret = bs58_1.default.decode(privateKey);
                }
                this.keypair = web3_js_1.Keypair.fromSecretKey(secret);
                return [2 /*return*/];
            });
        });
    };
    /** Loads an existing wallet from a mnemonic phrase (BIP-39 standard) */
    SolanaWallet.prototype.loadFromMnemonic = function (mnemonic) {
        return __awaiter(this, void 0, void 0, function () {
            var seed, path, derivedSeed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bip39.mnemonicToSeed(mnemonic)];
                    case 1:
                        seed = _a.sent();
                        path = "m/44'/501'/0'/0'";
                        derivedSeed = (0, ed25519_hd_key_1.derivePath)(path, seed.toString("hex")).key;
                        this.keypair = web3_js_1.Keypair.fromSeed(derivedSeed);
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Exports the private key as a JSON-encoded Uint8Array string */
    SolanaWallet.prototype.exportPrivateKey = function () {
        if (!this.keypair)
            throw new Error("Wallet not loaded");
        return JSON.stringify(Array.from(this.keypair.secretKey));
    };
    /** Signs an arbitrary UTF-8 message and returns the base64-encoded signature */
    SolanaWallet.prototype.signMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var msgBytes, signature;
            return __generator(this, function (_a) {
                if (!this.keypair)
                    throw new Error("Wallet not loaded");
                msgBytes = node_buffer_1.Buffer.from(message);
                signature = nacl.sign.detached(msgBytes, this.keypair.secretKey);
                return [2 /*return*/, node_buffer_1.Buffer.from(signature).toString("base64")];
            });
        });
    };
    /** Signs a Solana transaction and returns the serialized bytes */
    SolanaWallet.prototype.signTransaction = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.keypair)
                    throw new Error("Wallet not loaded");
                tx.sign(this.keypair);
                return [2 /*return*/, tx.serialize()];
            });
        });
    };
    /** Broadcasts a signed transaction to the Solana network */
    SolanaWallet.prototype.sendTransaction = function (signedTx) {
        return __awaiter(this, void 0, void 0, function () {
            var txid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.connection)
                            throw new Error("No connection available");
                        return [4 /*yield*/, this.connection.sendRawTransaction(signedTx)];
                    case 1:
                        txid = _a.sent();
                        return [2 /*return*/, txid];
                }
            });
        });
    };
    /** Retrieves the wallet’s SOL balance (in SOL, not lamports) */
    SolanaWallet.prototype.getBalance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var balanceLamports;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.keypair || !this.connection)
                            throw new Error("Wallet not ready");
                        return [4 /*yield*/, this.connection.getBalance(this.keypair.publicKey)];
                    case 1:
                        balanceLamports = _a.sent();
                        return [2 /*return*/, (balanceLamports / 1e9).toFixed(9)]; // convert lamports → SOL
                }
            });
        });
    };
    /** Returns network info (cluster version + RPC URL) */
    SolanaWallet.prototype.getNetworkInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var version;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.connection)
                            throw new Error("No provider available");
                        return [4 /*yield*/, this.connection.getVersion()];
                    case 1:
                        version = _a.sent();
                        return [2 /*return*/, { chainId: version["solana-core"], rpcUrl: this.rpcUrl }];
                }
            });
        });
    };
    /**
     * Constructs a simple SOL transfer transaction.
     * Populates blockhash and fee payer automatically.
     */
    SolanaWallet.prototype.createTransactionData = function (to, amountSol) {
        return __awaiter(this, void 0, void 0, function () {
            var fromPubkey, toPubkey, lamports, tx, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.keypair || !this.connection)
                            throw new Error("Wallet not ready: connect a provider first");
                        fromPubkey = this.keypair.publicKey;
                        toPubkey = new web3_js_1.PublicKey(to);
                        lamports = Math.floor(parseFloat(amountSol) * 1e9);
                        tx = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.transfer({
                            fromPubkey: fromPubkey,
                            toPubkey: toPubkey,
                            lamports: lamports,
                        }));
                        tx.feePayer = fromPubkey;
                        _a = tx;
                        return [4 /*yield*/, this.connection.getLatestBlockhash()];
                    case 1:
                        _a.recentBlockhash = (_b.sent()).blockhash;
                        return [2 /*return*/, tx];
                }
            });
        });
    };
    return SolanaWallet;
}());
exports.SolanaWallet = SolanaWallet;
