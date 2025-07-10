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
  
  return {
    entityRegistry: {
      compiledCode: entityRegistryValidator.compiledCode,
      hash: entityRegistryValidator.hash
    },
    treasury: {
      compiledCode: treasuryValidator.compiledCode,
      hash: treasuryValidator.hash
    }
  };
}