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
        stats: {
          bsonType: "object",
          required: [
            "capacity",
          ],
          properties: {
            capacity: {
              bsonType: "number"
            }
          }
        },
        upgrade: {
          bsonType: "object",
          required: [
            "goldCost",
            "gemRush",
            "requiredMerchantLevel",
          ],
          properties: {
            goldCost: {
              bsonType: "int",
            },
            gemRush: {
              bsonType: "int",
            },
            upgradeTimeInSeconds: {
              bsonType: "int",
            },
            requiredMerchantLevel: {
              bsonType: "int",
            },
            requiredBuilding: {
              bsonType: "string",
            },
            requiredBuildingLevel: {
              bsonType: "string",
            },
          },
        },
      },
    },
  },
});
