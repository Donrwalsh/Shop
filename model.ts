export interface Blueprint {
  name: string;
  type: string;
  tier: number;
  unlockPrerequisite?: string;
  values: {
    gold: number;
  };
}
