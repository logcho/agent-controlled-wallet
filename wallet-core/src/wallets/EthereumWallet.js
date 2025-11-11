"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.EthereumWallet = void 0;
var ethers_1 = require("ethers");
/**
 * EthereumWallet implements the IWallet interface for Ethereum-compatible chains.
 * Provides key management, signing, balance retrieval, and transaction handling.
 */
var EthereumWallet = /** @class */ (function () {
    function EthereumWallet(rpcUrl) {
        /** The name of the blockchain */
        this.chain = "Ethereum";
        if (rpcUrl) {
            this.provider = new ethers_1.ethers.JsonRpcProvider(rpcUrl);
            this.rpcUrl = rpcUrl;
        }
    }
    /** Generates a new wallet using secure random entropy */
    EthereumWallet.prototype.generateNewWallet = function () {
        return __awaiter(this, void 0, void 0, function () {
            var w;
            return __generator(this, function (_a) {
                w = ethers_1.ethers.Wallet.createRandom();
                this.wallet = this.provider ? w.connect(this.provider) : w;
                return [2 /*return*/];
            });
        });
    };
    /** Loads an existing wallet from a raw private key */
    EthereumWallet.prototype.loadFromPrivateKey = function (privateKey) {
        return __awaiter(this, void 0, void 0, function () {
            var w;
            return __generator(this, function (_a) {
                w = new ethers_1.ethers.Wallet(privateKey);
                this.wallet = this.provider ? w.connect(this.provider) : w;
                return [2 /*return*/];
            });
        });
    };
    /** Loads an existing wallet from a mnemonic phrase */
    EthereumWallet.prototype.loadFromMnemonic = function (mnemonic) {
        return __awaiter(this, void 0, void 0, function () {
            var w;
            return __generator(this, function (_a) {
                w = ethers_1.ethers.Wallet.fromPhrase(mnemonic);
                this.wallet = this.provider ? w.connect(this.provider) : w;
                return [2 /*return*/];
            });
        });
    };
    /** Returns the wallet’s public address */
    EthereumWallet.prototype.getAddress = function () {
        if (!this.wallet)
            throw new Error("Wallet not loaded");
        return this.wallet.address;
    };
    /** Exports the private key (if supported) */
    EthereumWallet.prototype.exportPrivateKey = function () {
        if (!this.wallet)
            throw new Error("Wallet not loaded");
        return this.wallet.privateKey;
    };
    /** Signs an arbitrary UTF-8 message */
    EthereumWallet.prototype.signMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.wallet)
                    throw new Error("Wallet not loaded");
                return [2 /*return*/, this.wallet.signMessage(message)];
            });
        });
    };
    /** Signs a raw Ethereum transaction request */
    EthereumWallet.prototype.signTransaction = function (txData) {
        return __awaiter(this, void 0, void 0, function () {
            var network;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.wallet)
                            throw new Error("Wallet not loaded");
                        if (!(this.provider && !txData.chainId)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.provider.getNetwork()];
                    case 1:
                        network = _a.sent();
                        txData.chainId = Number(network.chainId);
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.wallet.signTransaction(txData)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /** Broadcasts a signed transaction to the network */
    EthereumWallet.prototype.sendTransaction = function (signedTx) {
        return __awaiter(this, void 0, void 0, function () {
            var resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.provider)
                            throw new Error("No provider available");
                        return [4 /*yield*/, this.provider.broadcastTransaction(signedTx)];
                    case 1:
                        resp = _a.sent();
                        return [2 /*return*/, resp.hash];
                }
            });
        });
    };
    /** Retrieves the wallet’s balance in native ETH */
    EthereumWallet.prototype.getBalance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var wei;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.wallet || !this.provider)
                            throw new Error("Wallet not ready");
                        return [4 /*yield*/, this.provider.getBalance(this.wallet.address)];
                    case 1:
                        wei = _a.sent();
                        return [2 /*return*/, ethers_1.ethers.formatEther(wei)];
                }
            });
        });
    };
    /** Returns network information such as chainId and RPC URL */
    EthereumWallet.prototype.getNetworkInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var net;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.provider)
                            throw new Error("No provider available");
                        return [4 /*yield*/, this.provider.getNetwork()];
                    case 1:
                        net = _a.sent();
                        return [2 /*return*/, { chainId: net.chainId.toString(), rpcUrl: this.rpcUrl }];
                }
            });
        });
    };
    /**
     * Constructs a transaction object with populated gas fees, nonce, and chainId.
     * Used as a helper before signing or sending.
     */
    EthereumWallet.prototype.createTransactionData = function (to, amountEth, overrides) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, feeData, nonce, network, tx;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!this.wallet || !this.provider)
                            throw new Error("Wallet not ready: connect a provider first");
                        return [4 /*yield*/, Promise.all([
                                this.provider.getFeeData(),
                                this.provider.getTransactionCount(this.wallet.address),
                                this.provider.getNetwork(),
                            ])];
                    case 1:
                        _a = _d.sent(), feeData = _a[0], nonce = _a[1], network = _a[2];
                        tx = __assign({ to: to, value: ethers_1.ethers.parseEther(amountEth), gasLimit: 21000n, maxFeePerGas: (_b = feeData.maxFeePerGas) !== null && _b !== void 0 ? _b : ethers_1.ethers.parseUnits("20", "gwei"), maxPriorityFeePerGas: (_c = feeData.maxPriorityFeePerGas) !== null && _c !== void 0 ? _c : ethers_1.ethers.parseUnits("1", "gwei"), nonce: nonce, chainId: Number(network.chainId) }, overrides);
                        return [2 /*return*/, tx];
                }
            });
        });
    };
    return EthereumWallet;
}());
exports.EthereumWallet = EthereumWallet;
