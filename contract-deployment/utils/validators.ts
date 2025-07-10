// contract-deployment/utils/validators.ts
import * as fs from 'fs';
import * as path from 'path';

// Load compiled validators from plutus.json
export function loadValidators() {
  const plutusJsonPath = path.join(process.cwd(), 'contracts', 'plutus.json');
  const plutusJson = JSON.parse(fs.readFileSync(plutusJsonPath, 'utf8'));
  
  // Extract validators
  const validators = plutusJson.validators;
  
  // Extract the entity registry validator
  const entityRegistryValidator = validators.find(
    (v: any) => v.title === 'entity_registry/entity_registry.entity_registry.spend'
  );
  
  if (!entityRegistryValidator) {
    throw new Error('Entity registry validator not found in plutus.json');
  }
  
  // Extract the treasury validator
  const treasuryValidator = validators.find(
    (v: any) => v.title === 'treasury_management/treasury_management.treasury_management.spend'
  );
  
  if (!treasuryValidator) {
    throw new Error('Treasury validator not found in plutus.json');
  }
  
  // Extract the governance validator
  const governanceValidator = validators.find(
    (v: any) => v.title === 'governance/governance.governance.spend'
  );
  
  if (!governanceValidator) {
    throw new Error('Governance validator not found in plutus.json');
  }
  
  // Extract the member NFT policy - corrected title from your plutus.json
  const memberNFTValidator = validators.find(
    (v: any) => v.title === 'nft_policy/member_nft.member_nft_policy.mint'
  );
  
  if (!memberNFTValidator) {
    throw new Error('Member NFT policy not found in plutus.json');
  }
  
  return {
    entityRegistry: {
      compiledCode: entityRegistryValidator.compiledCode,
      hash: entityRegistryValidator.hash
    },
    treasury: {
      compiledCode: treasuryValidator.compiledCode,
      hash: treasuryValidator.hash
    },
    governance: {
      compiledCode: governanceValidator.compiledCode,
      hash: governanceValidator.hash
    },
    memberNFT: {
      compiledCode: memberNFTValidator.compiledCode,
      hash: memberNFTValidator.hash
    }
  };
}