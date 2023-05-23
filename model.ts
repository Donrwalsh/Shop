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
    valuePerCraftingSecond: number;
    merchantXpPerCraftingSecond: number;
    materials: CraftingMaterial[];
    workers: [BlueprintWorker, BlueprintWorker?, BlueprintWorker?];
  };
}

interface Material {
  amount: number;
}

interface ResourceMaterial extends Material {
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

export interface BlueprintWorker {
  requiredWorker: string; //Also enum eligible
  workerLevel: number;
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
