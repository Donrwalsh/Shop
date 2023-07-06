db.createCollection("accounts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        level: {
          bsonType: "int",
        },
        xp: {
          bsonType: "int",
        },
        furnitureSlots: {
          bsonType: "int",
        },
        basementSlots: {
          bsonType: "int",
        },
        furniture: {
          bsonType: "object",
          properties: {
            counter: {
              bsonType: "int",
            },
            hoard: {
              bsonType: "int",
            },
            trunks: {
              bsonType: "array",
              items: {
                bsonType: "int",
              },
            },
            mannequins: {
              bsonType: "array",
              items: {
                bsonType: "int",
              },
            },
            shelves: {
              bsonType: "array",
              items: {
                bsonType: "int",
              },
            },
            tables: {
              bsonType: "array",
              items: {
                bsonType: "int",
              },
            },
            verticalRacks: {
              bsonType: "array",
              items: {
                bsonType: "int",
              },
            },
            ironBins: {
              bsonType: "array",
              items: {
                bsonType: "int",
              },
            },
            woodBins: {
              bsonType: "array",
              items: {
                bsonType: "int",
              },
            },
            leatherBins: {
              bsonType: "array",
              items: {
                bsonType: "int",
              },
            },
            herbDryers: {
              bsonType: "array",
              items: {
                bsonType: "int",
              },
            },
            steelBins: {
              bsonType: "array",
              items: {
                bsonType: "int",
              },
            },
            ironwoodBins: {
              bsonType: "array",
              items: {
                bsonType: "int",
              },
            },
            fabricBins: {
              bsonType: "array",
              items: {
                bsonType: "int",
              },
            },
            oilPots: {
              bsonType: "array",
              items: {
                bsonType: "int",
              },
            },
            jewelBins: {
              bsonType: "array",
              items: {
                bsonType: "int",
              },
            },
            etherBins: {
              bsonType: "array",
              items: {
                bsonType: "int",
              },
            },
            essenceBeacons: {
              bsonType: "array",
              items: {
                bsonType: "int",
              },
            },
          },
        },
      },
    },
  },
});
