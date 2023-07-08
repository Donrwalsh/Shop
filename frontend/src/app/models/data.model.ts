export interface Furniture {
  _id: string;
  type: string;
  level: number;
  stats: {
      size: string;
      energy?: number;
      storage?: number;
      hoardStorage?: number[];
      saleEnergy?: number;
      maxEnergyPct?: number;
      regenBonusPct?: number;
  }
  upgrade?: {
      goldCost: number;
      gemRush: number;
      dragonMarks?: number;
      upgradeTimeInSeconds: number;
      requiredMerchantLevel: number;
      requiredBuilding?: string;
      requiredBuildingLevel?: number;
  }
}

export interface Level {
  _id: string;
  level: number;
  highestMarketTier: number;
  upgrade?: {
    xpNeeded: number;
    gemRewards: 5;
  };
}

export interface Slot {
  _id: string;
  type: string;
  subType?: string;
  slotNumber: number;
  stats?: {
    capacity: number;
  };
  upgrade?: {
    requiredMerchantLevel: number;
    upgradeTimeInSeconds?: number;
    goldCost: number;
    gemRush: number;
  };
}
