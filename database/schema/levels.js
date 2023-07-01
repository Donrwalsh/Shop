db.createCollection("levels", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "level",
                "highestMarketTier"
            ],
            properties: {
                level: {
                    bsonType: "int",
                },
                highestMarketTier: {
                    bsonType: "int",
                },
                upgrade: {
                    bsonType: "object",
                    required: [
                        "xpNeeded",
                        "gemReward"
                    ],
                    properties: {
                        xpNeeded: {
                            bsonType: "int",
                        },
                        gemReward: {
                            bsonType: "int",
                        }
                    }
                }
            }
        }
    }
})