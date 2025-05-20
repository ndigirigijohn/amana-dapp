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
exports.loadValidators = void 0;
// offchain/utils/validators.ts
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Load compiled validators from plutus.json
function loadValidators() {
    const plutusJsonPath = path.join(process.cwd(), 'contracts', 'plutus.json');
    const plutusJson = JSON.parse(fs.readFileSync(plutusJsonPath, 'utf8'));
    // Extract validators
    const validators = plutusJson.validators;
    // Extract the entity registry validator
    const entityRegistryValidator = validators.find((v) => v.title === 'entity_registry/entity_registry.entity_registry.spend');
    if (!entityRegistryValidator) {
        throw new Error('Entity registry validator not found in plutus.json');
    }
    return {
        entityRegistry: {
            compiledCode: entityRegistryValidator.compiledCode,
            hash: entityRegistryValidator.hash
        }
    };
}
exports.loadValidators = loadValidators;
