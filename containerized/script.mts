import * as mongoDB from "mongodb"

async function main() {
    console.log("Hello World!")

    const client: mongoDB.MongoClient = new mongoDB.MongoClient("mongodb://mongodb:27017");

    await client.connect();

    const db: mongoDB.Db = client.db("shopData");

    const blueprintsCollection: mongoDB.Collection = db.collection("blueprints");

    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${blueprintsCollection.collectionName}`);

    const cursor = blueprintsCollection.find({});

    for await (const doc of cursor) {
        console.log(doc);
    }

    // console.log(await blueprintsCollection.findOne({ name: 'Squire Sword' }));

    process.exit(0);
}

await main();