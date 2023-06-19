export interface Furniture {
    _id: string;
    type: string;
    level: number;
    stats: {
        energy?: number;
        hoardStorage?: number[];
        storage: number;
        size: string;
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
        requiredBuildingLevel: number;
    }
}