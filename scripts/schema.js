db.createCollection("blueprints", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "tier", "type", "values", "ascensionUpgrades"],
      properties: {
        name: {
          bsonType: "string",
          description: "Blueprint name (required)",
        },
        type: {
          enum: [
            "Amulet",
            "Axe",
            "Bow",
            "Cloak",
            "Clothes",
            "Crossbow",
            "Dagger",
            "Dessert",
            "Enchantment",
            "Familiar",
            "Gauntlets",
            "Gloves",
            "Gun",
            "Heavy Armor",
            "Heavy Footwear",
            "Herbal Medicine",
            "Helmet",
            "Light Armor",
            "Light Footwear",
            "Mace",
            "Magician Hat",
            "Meal",
            "Moonstone",
            "Potion",
            "Ring",
            "Rogue Hat",
            "Runestone",
            "Shield",
            "Spear",
            "Spell",
            "Staff",
            "Sword",
            "Wand",
          ],
          description: "Blueprint type (required)",
        },
        tier: {
          bsonType: "int",
          minimum: 1,
          maximum: 13,
          description: "Blueprint tier (required)",
        },
        unlockPrerequisite: {
          bsonType: "string",
          description: "Details on how to unlock (optional)",
        },
        values: {
          bsonType: "object",
          required: [
            "gold",
            "merchantXp",
            "workerXp",
            "fusionXp",
            "favor",
            "airshipPower",
          ],
          description: "Blueprint values and costs (required)",
          properties: {
            gold: {
              bsonType: "int",
              description: "Blueprint base gold value (required)",
            },
            merchantXp: {
              bsonType: "int",
              description: "Blueprint base merchant XP value (required)",
            },
            workerXp: {
              bsonType: "int",
              description: "Blueprint base worker XP value (required)",
            },
            fusionXp: {
              bsonType: "int",
              description: "Blueprint base fusion XP value (required)",
            },
            favor: {
              bsonType: "int",
              description: "Blueprint base favor value (required)",
            },
            airshipPower: {
              bsonType: "int",
              description: "Blueprint base airship power value (required)",
            },
            antiqueTokens: {
              bsonType: "int",
              description: "Blueprint cost in antique tokens (optional)",
            },
            researchScrolls: {
              bsonType: "int",
              description: "Blueprint cost in research scrolls (optional)",
            },
          },
        },
        ascensionUpgrades: {
          bsonType: "array",
          maxItems: 3,
          minItems: 3,
          description:
            "Blueprint ascension upgrade details and shard costs (required)",
          items: {
            bsonType: "object",
            properties: {
              upgrade: {
                type: "string",
              },
              shards: {
                type: "int",
              },
            },
          },
        },
      },
    },
  },
});
