db.createCollection("slots", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["type", "slotNumber"],
      properties: {
        type: {
          enum: [
            "Hero Slot",
            "Crafting Slot",
            "Questing Slot",
            "Trading Slot",
            "Pet Slot",
            "Shop Expansion",
            "Basement Expansion",
          ],
        },
        subType: {
          enum: ["Size & Furniture", "Furniture Only"],
        },
        slotNumber: {
          bsonType: "int",
        },
        requiredMerchantLevel: {
          bsonType: "int",
        },
        goldCost: {
          bsonType: "int",
        },
        gemCost: {
          bsonType: "int",
        },
        capacity: {
          bsonType: "int",
        },
        upgradeTimeInSeconds: {
          bsonType: "int",
        },
      },
    },
  },
});
