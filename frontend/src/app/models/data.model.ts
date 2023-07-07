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
