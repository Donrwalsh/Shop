export interface Slot {
    _id: string;
    type: string;
    subType?: string;
    slotNumber: number;
    stats?: {
        capacity: number;
    }
    upgrade?: {
        requiredMerchantLevel: number;
        upgradeTimeInSeconds?: number;
        goldCost: number;
        gemRush: number;
    }
}