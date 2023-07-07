export interface Account {
  id: string;
  level: number;
  xp: number;
  furnitureSlots: number;
  furniture: {
    counter: number;
    hoard: number;
    trunks: [number?, number?, number?, number?, number?];
  };
}
