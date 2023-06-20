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