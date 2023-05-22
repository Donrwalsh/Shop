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
}
