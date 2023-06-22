export interface Slot {
    _id: string;
    type: string;
    subType?: string;
    slotNumber: number;
    requiredMerchantLevel?: number;
    goldCost?: number;
    gemCost?: number;
    capacity?: number;
    upgradeTimeInSeconds?: number;
}