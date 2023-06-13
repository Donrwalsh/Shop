db.createCollection("furniture", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "name"
            ],
            properties: {
                name: {
                    bsonType: "string",
                    description: "Furniture name (required)",
                },
                
            }
        }
    }
})