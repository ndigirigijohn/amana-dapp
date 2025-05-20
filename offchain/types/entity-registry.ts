// offchain/types/entity-registry.ts
export interface Entity {
    name: string;
    description: string;
    creation_time: number;
    founder: string; // Verification key hash as hex
    member_count: number;
  }
  
  export enum MemberStatus {
    Active = 0,
    Inactive = 1,
    Suspended = 2
  }
  
  export interface Member {
    name: string;
    verification_key_hash: string; // Verification key hash as hex
    join_time: number;
    status: MemberStatus;
  }
  
  export interface RegistryDatum {
    entity: Entity;
    members: Array<[string, Member]>; // Array of [vkh, Member] pairs
    admins: string[]; // Array of verification key hashes
  }
  
  export type CreateEntityAction = {
    constructor: 0; // CreateEntity constructor index
    fields: [
      string, // name
      string  // description
    ];
  };
  
  export type AddMemberAction = {
    constructor: 1; // AddMember constructor index
    fields: [
      Member // member
    ];
  };
  
  export type UpdateMemberStatusAction = {
    constructor: 2; // UpdateMemberStatus constructor index
    fields: [
      string,      // member_key (verification key hash)
      MemberStatus // new_status
    ];
  };
  
  export type AddAdminAction = {
    constructor: 3; // AddAdmin constructor index
    fields: [
      string // admin_key (verification key hash)
    ];
  };
  
  export type RemoveAdminAction = {
    constructor: 4; // RemoveAdmin constructor index
    fields: [
      string // admin_key (verification key hash)
    ];
  };
  
  export type RegistryAction = 
    | CreateEntityAction
    | AddMemberAction
    | UpdateMemberStatusAction
    | AddAdminAction
    | RemoveAdminAction;