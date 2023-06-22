// db.shopData.blueprints (blueprints)

let merchantUnlockExamples = [
  {
    _id: "hero-slot-2",
    type: "Hero Slot",
    slotNumber: 2,

    //optional:
    requiredMerchantLevel: 3,
    goldCost: 500,
    gemCost: 10,
  },
  {
    _id: "shop-expansion-5",
    type: "Size & Furniture",
    slotNumber: 5,
    capacity: 40,
    goldCost: 10,
    gemCost: 12,
    upgradeTimeInSeconds: 24 * 60 * 60
  }
];

// dp.shopData.furniture (racks, counter & trunks, resourceBins)
let furnitureExample = {
  _id: "mannequin-7",
  type: "Mannequin",
  level: 7,
  stats: {
    energy: 30,
    size: "2x4",
    storage: 8,
    // hoardStorage: [102, 42, 23, 5],
    // regenBonusPct: 5,
    // resource: "Iron",
    // saleEnergy: 1,
    // maxEnergyPct: 5,
  },
  upgrade: { // All these values come from the next row in the sheet
    goldCost: 500000, 
    gemRush: 150, 
    // dragonmarks: 100,
    upgradeTimeInSeconds: 2880,
    requiredMerchantLevel: 12,
    // requiredBuilding: "Iron Mine",
    // requiredBuildingLevel: 20,
  }
}

// db.shopData.merchant (expansions, slots, merchantLevel)

let account = {
  merchantLevel: 80,
  furnitureSlots: 88, // - 7 for counter/trunks/hoard
  basementSlots: 44, // 5 trunks, 1 hoard, 44 total needed for crafting loadout

  furniture: {
    counter: 20,
    trunk: [20, 20, 20, 20, 20],
    hoard: 20,
    mannequin: [ // 9
      15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16,
      16, 20, 8
    ],
    shelves: [ // 9
      15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 16, 16, 16, 16, 17, 20,
      20, 10
    ],
    table: [ // 8
      15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 16, 16,
      20, 7
    ],
    verticalRack: [ // 9
      15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16, 20,
      20, 8
    ],
    ironBin: [15, 15, 15, 15, 15],
    woodBin: [14, 15, 15, 15, 15],
    leatherBin: [14, 15, 15, 15, 15],
    herbDryer: [14, 15, 15, 15, 17],
    steelBin: [15, 15, 15, 15],
    ironwoodBin: [14, 15, 15, 15],
    fabricBin: [14, 14, 14, 15],
    oilPot: [14, 15, 15, 15],
    jewelBin: [15, 15, 15],
    etherBin: [15, 15, 16],
    essenceBeacon: [7, 14],
  },
};


// These numbers feel a bit off.
// let items = account.mannequin.concat(
//   account.shelves,
//   account.table,
//   account.verticalRack
// );

// This number outputs 4,347 which is just shy of the true value of 4380, so just off by rounding.
let items = [15, 15, 16, 16, 16, 16, 16, 16, 20, 15, 15, 16, 16, 16, 16, 17, 20, 20, 15, 15, 15, 15, 15, 16, 16, 20, 15, 16, 16, 16, 16, 16, 16, 20, 20]
items.forEach((item, i) => {
  if (item === 15) items[i] = 90 + 14;
});
items.forEach((item, i) => {
  if (item === 16) items[i] = 99 + 14;
});
items.forEach((item, i) => {
  if (item === 17) items[i] = 110 + 14;
});
items.forEach((item, i) => {
  if (item === 18) items[i] = 121 + 14;
});
items.forEach((item, i) => {
  if (item === 19) items[i] = 132 + 14;
});
items.forEach((item, i) => {
  if (item === 20) items[i] = 143 + 14;
});
console.log(items);
const sum = items.reduce((partialSum, a) => partialSum + a, 0);
console.log(sum);
