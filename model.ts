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
  };
}

interface Material {
  amount: number;
}

interface ResourceMaterial extends Material {
  resource: string;
  component?: never;
}

interface ComponentMaterial extends Material {
  component: string;
  resource?: never;
}

export type CraftingMaterial = ResourceMaterial | ComponentMaterial;
