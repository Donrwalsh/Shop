db.createCollection("blueprints", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "tier", "type"],
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
      },
    },
  },
});