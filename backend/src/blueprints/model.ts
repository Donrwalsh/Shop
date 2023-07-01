export interface Blueprint {
    name: string;
    type: string;
    tier: number;
    unlockPrerequisite?: string;
    values: {
      gold: number;
      merchantXp: number;
      workerXp: number;
      fusionXp: number;
      favor: number;
      airshipPower: number;
      antiqueTokens?: number;
      researchScrolls?: number;
    };
    ascensionUpgrades: [
      { upgrade: string; shards: number },
      { upgrade: string; shards: number },
      { upgrade: string; shards: number }
    ];
    crafting: {
      timeInSeconds: number;
      timeFormatted: string;
      goldPerCraftingSecond: Number;
      merchantXpPerCraftingSecond: number;
      materials: CraftingMaterial[];
      workers: [BlueprintWorker, BlueprintWorker?, BlueprintWorker?];
      upgrades: [
        CraftUpgrade,
        CraftUpgrade,
        CraftUpgrade,
        CraftUpgrade,
        CraftUpgrade
      ];
    };
    energy: {
      discount: number;
      surcharge: number;
      suggest: number;
      speedUp: number;
    };
    stats: {
      ATK?: number;
      DEF?: number;
      HP?: number;
      EVA?: number;
      CRIT?: number;
      elementalAffinity?: string;
      spiritAffinity?: string;
    };
  }
  
  export interface CraftUpgrade {
    upgrade: string;
    craftsNeeded: number;
  }
  
  interface Material {
    amount: number;
  }
  
  export interface ResourceMaterial extends Material {
    resource: string;
    component?: never;
    item?: never;
    quality?: never;
  }
  
  interface ComponentMaterial extends Material {
    component: string;
    resource?: never;
    item?: never;
    quality?: never;
  }
  
  interface ItemMaterial extends Material {
    item: string;
    quality: string; //probably switch to enum at some point
    resource?: never;
    component?: never;
  }
  
  export type CraftingMaterial =
    | ResourceMaterial
    | ComponentMaterial
    | ItemMaterial;
  
  export interface BlueprintWorker {
    worker: string; //Also enum eligible
    workerLevel: number;
  }
  