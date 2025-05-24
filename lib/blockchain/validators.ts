// lib/blockchain/validators.ts
// Browser-compatible validator loading

// Import the plutus.json file directly
import plutusJson from '../../contracts/plutus.json';

export interface ValidatorInfo {
  compiledCode: string;
  hash: string;
}

export interface Validators {
  entityRegistry: ValidatorInfo;
}

// Load validators from the imported JSON
export function loadValidators(): Validators {
  // Extract validators
  const validators = plutusJson.validators;
  
  // Extract the entity registry validator - note the full path with forward slashes
  const entityRegistryValidator = validators.find(
    (v: any) => v.title === 'entity_registry/entity_registry.entity_registry.spend'
  );
  
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