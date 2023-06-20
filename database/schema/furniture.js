db.createCollection("furniture", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "_id",
                "type",
                "level",
                "stats",
            ],
            properties: {
                _id: {
                    bsonType: "string",
                    description: "Furniture id (required)",
                },
                type: {
                    enum: [
                        "Counter",
                        "Dragon's Hoard Bin",
                        "Essence Beacon",
                        "Ether Bin",
                        "Fabric Bin",
                        "Herb Dryer",
                        "Iron Bin",
                        "Ironwood Bin",
                        "Jewel Bin",
                        "Leather Bin",
                        "Mannequin",
                        "Oil Pot",
                        "Shelves",
                        "Steel Bin",
                        "Table",
                        "Trunk",
                        "Vertical Rack",
                        "Wood Bin"
                    ],
                    description: "Furniture type (required)",
                },
                level: {
                    bsonType: "int",
                    minimum: 1,
                    maximum: 20,
                    description: "Furniture level (required)",
                },
                stats: {
                    bsonType: "object",
                    required: [
                        "size"
                    ],
                    description: "Furniture stats (required)",
                    properties: {
                        size: {
                            bsonType: "string",
                            description: "Amount of floor space taken up by furniture (required)"
                        },
                        energy: {
                            bsonType: "int",
                            description: "Furniture contribution to energy pool"
                        },
                        storage: {
                            bsonType: "int",
                            description: "Furniture contribution to inventory storage"
                        },
                        hoardStorage: {
                            bsonType: "array",
                            maxItems: 4,
                            minItems: 1,
                            description: "Dragon's Hoard Bin: Contribution to resource inventory by tier",
                            items: {
                                bsonType: "int"
                            }
                        },
                        saleEnergy: {
                            bsonType: "int",
                            description: "Counter: Amount of energy generated by successful sale"
                        },
                        maxEnergyPct: {
                            bsonType: "int",
                            description: "Counter: Overall energy pool increase by percentage amount"
                        },
                        regenBonusPct: {
                            bsonType: "int",
                            description: "Resource Bins: Furniture contribution to resource regeneration rate"
                        },
                    }
                },
                upgrade: {
                    bsonType: "object",
                    required: [
                        "goldCost",
                        "gemRush",
                        "upgradeTimeInSeconds",
                        "requiredMerchantLevel",
                    ],
                    description: "Furniture stats (required)",
                    properties: {
                        goldCost: {
                            bsonType: "int",
                            description: "Cost in gold to upgrade furniture to the next level (required)"
                        },
                        gemRush: {
                            bsonType: "int",
                            description: "Cost in gems to rush furniture to the next level (required)"
                        },
                        dragonMarks: {
                            bsonType: "int",
                            description: "Cost in dragon marks to upgrade or rush furniture to the next level"
                        },
                        upgradeTimeInSeconds: {
                            bsonType: "int",
                            description: "Duration in seconds that upgrading furniture to the next level takes (required)"
                        },
                        requiredMerchantLevel: {
                            bsonType: "int",
                            description: "Merchant Level required for upgrading furniture to the next level (required)"
                        },
                        requiredBuilding: {
                            bsonType: "string",
                            description: "Building that must be leveled appropriately in order to upgrade furniture to the next level"
                        },
                        requiredBuildingLevel: {
                            bsonType: "string",
                            description: "The required level of the building that is required in order to upgrade furniture to the next level"
                        },
                    }
                }
            }
        }
    }
})