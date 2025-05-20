"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectedNetwork = exports.networks = exports.env = void 0;
// offchain/config.ts
const dotenv = __importStar(require("ts-dotenv"));
// Load environment variables
exports.env = dotenv.load({
    PRIVATE_KEY: String,
    NETWORK: {
        type: String,
        default: 'preview'
    },
    BLOCKFROST_PROJECT_ID: String
});
// Network configurations
exports.networks = {
    preview: {
        url: 'https://cardano-preview.blockfrost.io/api/v0',
        projectId: exports.env.BLOCKFROST_PROJECT_ID
    },
    preprod: {
        url: 'https://cardano-preprod.blockfrost.io/api/v0',
        projectId: exports.env.BLOCKFROST_PROJECT_ID
    },
    mainnet: {
        url: 'https://cardano-mainnet.blockfrost.io/api/v0',
        projectId: exports.env.BLOCKFROST_PROJECT_ID
    }
};
exports.selectedNetwork = exports.networks[exports.env.NETWORK];
