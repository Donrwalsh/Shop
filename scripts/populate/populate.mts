import { Oracle } from "./helpers/oracle.mjs";
import * as utils from "./helpers/utils.mjs";
import { Blueprint, CraftUpgrade } from "./model/blueprint.mjs";
import * as fs from "fs";
import { getLogger } from "./helpers/LogConfig.mjs";
import * as mongoDB from "mongodb";

const log = getLogger("script.populate");

const baseSpreadsheetURL =
  "https://docs.google.com/spreadsheets/d/1WLa7X8h3O0-aGKxeAlCL7bnN8-FhGd3t7pz2RCzSg8c";

async function main() {
  console.clear();
  log.info(() => `(1) Data Harvest (1)`);

  let scout = (await utils.downloadFile(
    `${baseSpreadsheetURL}/export?gid=${utils.GIDs[0].GID}&exportFormat=csv`
  )) as string;

  let version = `${scout.split(" ")[6]}-${scout.split(" ")[8]}`;
  let dataFolder = `./data/${version}`;

  if (!fs.existsSync(dataFolder)) {
    log.info(() => `Found new version: ${version}`);
    fs.mkdirSync(dataFolder);
  } else {
    log.info(() => `On latest version: ${version}`);
  }
  fs.renameSync(
    `./${scout}`,
    `${dataFolder}/${scout.split(" ")[10].toLowerCase()}`
  );

  console.log("");

  async function fetchCsv(gid: string, fileName: string) {
    if (!fs.existsSync(`${dataFolder}/${fileName}`)) {
      let csvFileName = (await utils.downloadFile(
        `${baseSpreadsheetURL}/export?gid=${gid}&exportFormat=csv`
      )) as string;
      fs.renameSync(
        `./${csvFileName.replace("/", "_")}`,
        `${dataFolder}/${fileName}`
      );
      return true;
    }
    return false;
  }

  for (let i = 1; i < utils.GIDs.length; i++) {
    console.log(
      (await fetchCsv(utils.GIDs[i].GID, `${utils.GIDs[i].fileName}.csv`))
        ? `NOT FOUND ${utils.GIDs[i].fileName}.csv: processing download`
        : `found ${utils.GIDs[i].fileName}.csv: skipping download`
    );
  }

  // ==== FURNITURE
  let furniture = await utils.readCSVFile(
    `${dataFolder}/racksCountersAndTrunks.csv`
  );
  let bins = await utils.readCSVFile(`${dataFolder}/resourceBins.csv`);

  let furnitureCursors = [];
  let binCursors = [];

  furniture.forEach((row, index) => {
    Object.keys(row).forEach((key) => {
      if (/[A-Z]+$/.test(row[key])) {
        furnitureCursors.push({
          name: row[key],
          x: parseInt(key),
          y: index,
        });
      }
    });
  });
  bins.forEach((row, index) => {
    Object.keys(row).forEach((key) => {
      if (/[A-Z]+$/.test(row[key])) {
        binCursors.push({
          name: row[key],
          x: parseInt(key),
          y: index,
        });
      }
    });
  });

  let furnitureOutput = "";
  let binOutput = "";

  furnitureCursors.forEach((cursor) => {
    let table = [];

    let i = 0;
    while (true) {
      let field = furniture[cursor.y + 2][`${cursor.x + 1 + i}`];
      if (field != "" && field != undefined) {
        let values = Array.from({ length: 20 }, (_, j) => {
          let output = furniture[cursor.y + 2 + 1 + j][`${cursor.x + 1 + i}`];
          let timeVals = [60, 3600, 86400];
          if (field == "Upgrade Time") {
            return output
              .split(",")
              .map((val) => {
                let base = val.trim().replace(/\D/g, "");
                let multiplier = [
                  val.indexOf("mins"),
                  val.indexOf("hour"),
                  val.indexOf("day"),
                ]
                  .map((result, i) => (result == -1 ? 0 : 1 * timeVals[i]))
                  .reduce((r, a) => {
                    return r + a;
                  });
                return base * multiplier;
              })
              .reduce((r, a) => {
                return r + a;
              });
          } else if (["Size"].includes(field)) {
            return output;
          } else {
            return output == "---"
              ? null
              : parseInt(output.split(",").join(""));
          }
        });
        table.push({
          field: field,
          values: values,
        });
        i++;
      } else {
        break;
      }
    }

    for (let i = 0; i < 20; i++) {
      furnitureOutput +=
        JSON.stringify({
          _id: `${cursor.name.replace(" ", "").toLowerCase()}-${i + 1}`,
          type: cursor.name
            .toLowerCase()
            .split(" ")
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" "),
          level: i + 1,
          stats: {
            ...(table.filter((entry) => entry.field == "Energy Cap").length >
              0 && {
              energy: table.filter((entry) => entry.field == "Energy Cap")[0]
                .values[i],
            }),
            ...(table.filter((entry) => entry.field == "Storage Cap").length >
              0 && {
              storage: table.filter((entry) => entry.field == "Storage Cap")[0]
                .values[i],
            }),
            ...(table.filter((entry) => entry.field == "Inventory Cap").length >
              0 && {
              storage: table.filter(
                (entry) => entry.field == "Inventory Cap"
              )[0].values[i],
            }),
            size: table.filter((entry) => entry.field == "Size")[0].values[i],
            ...(table.filter((entry) => entry.field == "Sale Energy").length >
              0 && {
              saleEnergy: table.filter(
                (entry) => entry.field == "Sale Energy"
              )[0].values[i],
            }),
            ...(table.filter((entry) => entry.field == "Max Energy (%)")
              .length > 0 &&
              table.filter((entry) => entry.field == "Max Energy (%)")[0]
                .values[i] != null && {
                maxEnergyPct: table.filter(
                  (entry) => entry.field == "Max Energy (%)"
                )[0].values[i],
              }),
          },
          ...(i != 19
            ? {
                upgrade: {
                  goldCost: table.filter(
                    (entry) => entry.field == "Gold Cost"
                  )[0].values[i + 1],
                  gemRush: table.filter((entry) => entry.field == "Gem Cost")[0]
                    .values[i + 1],
                  ...(table.filter((entry) => entry.field == "Dragonmarks")[0]
                    .values[i + 1] != null && {
                    dragonMarks: table.filter(
                      (entry) => entry.field == "Dragonmarks"
                    )[0].values[i + 1],
                  }),
                  upgradeTimeInSeconds: table.filter(
                    (entry) => entry.field == "Upgrade Time"
                  )[0].values[i + 1],
                  requiredMerchantLevel: table.filter(
                    (entry) => entry.field == "Merchant Level"
                  )[0].values[i + 1],
                },
              }
            : {}),
        }) + ",";
    }
  });

  binCursors.forEach((cursor) => {
    let table = [];
    // console.log(cursor);

    let i = 0;
    while (true) {
      let field = bins[cursor.y + 2][`${cursor.x + 1 + i}`];
      if (field != "" && field != undefined) {
        let values = Array.from({ length: 20 }, (_, j) => {
          let output = bins[cursor.y + 2 + 1 + j][`${cursor.x + 1 + i}`];
          let timeVals = [60, 3600, 86400];
          if (field == "Upgrade Time") {
            return output
              .split(",")
              .map((val) => {
                let base = val.trim().replace(/\D/g, "");
                let multiplier = [
                  val.indexOf("mins"),
                  val.indexOf("hour"),
                  val.indexOf("day"),
                ]
                  .map((result, i) => (result == -1 ? 0 : 1 * timeVals[i]))
                  .reduce((r, a) => {
                    return r + a;
                  });
                return base * multiplier;
              })
              .reduce((r, a) => {
                return r + a;
              });
          } else if (
            field == "Storage Cap" &&
            cursor.name === "DRAGON'S HOARD BIN"
          ) {
            return output;
          } else if (["Size", "Required Building"].includes(field)) {
            return output;
          } else {
            return output == "---"
              ? null
              : parseInt(output.split(",").join(""));
          }
        });
        table.push({
          field: field,
          values: values,
        });
        i++;
      } else {
        break;
      }
    }

    // console.log(table);

    for (let i = 0; i < 20; i++) {
      binOutput +=
        JSON.stringify({
          _id: `${cursor.name
            .replace(" ", "")
            .replace(" ", "")
            .replace("'", "")
            .toLowerCase()}-${i + 1}`,
          type: cursor.name
            .toLowerCase()
            .split(" ")
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" "),
          level: i + 1,
          stats: {
            ...(cursor.name === "DRAGON'S HOARD BIN"
              ? {
                  hoardStorage: table
                    .filter((entry) => entry.field == "Storage Cap")[0]
                    .values[i].split("/")
                    .map((val) => parseInt(val.trim())),
                }
              : {
                  storage: table.filter(
                    (entry) => entry.field == "Storage Cap"
                  )[0].values[i],
                }),
            ...(table.filter((entry) => entry.field == "Regen Bonus (%)")
              .length > 0 &&
              table.filter((entry) => entry.field == "Regen Bonus (%)")[0]
                .values[i] != null && {
                regenBonusPct: table.filter(
                  (entry) => entry.field == "Regen Bonus (%)"
                )[0].values[i],
              }),
            size: table.filter((entry) => entry.field == "Size")[0].values[i],
          },
          ...(i != 19
            ? {
                upgrade: {
                  goldCost: table.filter(
                    (entry) => entry.field == "Gold Cost"
                  )[0].values[i + 1],
                  gemRush: table.filter((entry) => entry.field == "Gem Cost")[0]
                    .values[i + 1],
                  ...(table.filter((entry) => entry.field == "Dragonmarks")[0]
                    .values[i + 1] != null && {
                    dragonMarks: table.filter(
                      (entry) => entry.field == "Dragonmarks"
                    )[0].values[i + 1],
                  }),
                  upgradeTimeInSeconds: table.filter(
                    (entry) => entry.field == "Upgrade Time"
                  )[0].values[i + 1],
                  requiredMerchantLevel: table.filter(
                    (entry) => entry.field == "Merchant Level"
                  )[0].values[i + 1],
                  ...(table.filter(
                    (entry) => entry.field == "Required Building"
                  )[0].values[i + 1] != "---" && {
                    requiredBuilding: table
                      .filter((entry) => entry.field == "Required Building")[0]
                      .values[i + 1].slice(
                        0,
                        table
                          .filter(
                            (entry) => entry.field == "Required Building"
                          )[0]
                          .values[i + 1].indexOf("Lv.") - 1
                      ),
                  }),
                  ...(table.filter(
                    (entry) => entry.field == "Required Building"
                  )[0].values[i + 1] != "---" && {
                    requiredBuildingLevel: parseInt(
                      table
                        .filter(
                          (entry) => entry.field == "Required Building"
                        )[0]
                        .values[i + 1].trim()
                        .replace(/\D/g, "")
                    ),
                  }),
                },
              }
            : {}),
        }) + ",";
    }
  });

  binOutput = binOutput.substring(0, binOutput.length - 1);

  fs.writeFileSync(
    `${dataFolder}/furniture.json`,
    `[${furnitureOutput} ${binOutput}]`,
    "utf-8"
  );

  // Populate the database
  let blueprints = await utils.readCSVFile(`${dataFolder}/blueprints.csv`);

  let bpOracle = new Oracle(blueprints);

  // const client: mongoDB.MongoClient = new mongoDB.MongoClient(
  //   "mongodb://mongodb:27017"
  // );
  // await client.connect();

  // const db: mongoDB.Db = client.db("shopData");

  // const blueprintsCollection: mongoDB.Collection = db.collection("blueprints");

  let bpOutput = "";
  for (let i = 0; i < bpOracle.count(); i++) {
    let thisBp = {
      name: bpOracle.getValue("Name", i),
      type: bpOracle.getValue("Type", i),
      tier: bpOracle.getValue("Tier", i),
      ...(bpOracle.getValue("Unlock Prerequisite", i) !== "---" && {
        unlockPrerequisite: bpOracle.getValue("Unlock Prerequisite", i),
      }),
      values: {
        gold: bpOracle.getValue("Value", i),
        merchantXp: bpOracle.getValue("Merchant XP", i),
        workerXp: bpOracle.getValue("Worker XP", i),
        fusionXp: bpOracle.getValue("Fusion XP", i),
        favor: bpOracle.getValue("Favor", i),
        airshipPower: bpOracle.getValue("Airship Power", i),

        ...(bpOracle.getValue("Antique Tokens", i) !== "---" && {
          antiqueTokens: bpOracle.getValue("Antique Tokens", i),
        }),

        ...(bpOracle.getValue("Research Scrolls", i) !== "---" && {
          researchScrolls: bpOracle.getValue("Research Scrolls", i),
        }),
      },
      ascensionUpgrades: [
        {
          upgrade: bpOracle.getValue("Ascension Upgrade 1", i),
          shards: bpOracle.getValue("Shards Needed", i)[0],
        },
        {
          upgrade: bpOracle.getValue("Ascension Upgrade 2", i),
          shards: bpOracle.getValue("Shards Needed", i)[1],
        },
        {
          upgrade: bpOracle.getValue("Ascension Upgrade 3", i),
          shards: bpOracle.getValue("Shards Needed", i)[2],
        },
      ],
      crafting: {
        timeInSeconds: bpOracle.getValue("Crafting Time (seconds)", i),
        timeFormatted: bpOracle.getValue("Crafting Time (formatted)", i),
        goldPerCraftingSecond: bpOracle
          .getValue("Value / Crafting Time", i)
          .toFixed(2),
        merchantXpPerCraftingSecond: bpOracle
          .getValue("Merchant XP / Crafting Time", i)
          .toFixed(2),
        materials: [
          ...bpOracle.getPossibleMaterial("Iron", i),
          ...bpOracle.getPossibleMaterial("Wood", i),
          ...bpOracle.getPossibleMaterial("Leather", i),
          ...bpOracle.getPossibleMaterial("Herbs", i),
          ...bpOracle.getPossibleMaterial("Steel", i),
          ...bpOracle.getPossibleMaterial("Ironwood", i),
          ...bpOracle.getPossibleMaterial("Fabric", i),
          ...bpOracle.getPossibleMaterial("Oil", i),
          ...bpOracle.getPossibleMaterial("Mana", i),
          ...bpOracle.getPossibleMaterial("Jewels", i),
          ...bpOracle.getPossibleMaterial("Essence", i),
          ...bpOracle.getPossibleComponent(0, i),
          ...bpOracle.getPossibleComponent(1, i),
        ],
        workers: [
          {
            worker: bpOracle.getValue("Required Worker ", i), // Note the space
            workerLevel: bpOracle.getValue("Worker Level", i)[0],
          },
          ...(bpOracle.getValue("Required Worker", i)[0] != "---"
            ? ([
                {
                  worker: bpOracle.getValue("Required Worker", i)[0],
                  workerLevel: bpOracle.getValue("Worker Level", i)[1],
                },
                // This casting as a const prevents ts2322 where typescript thinks this
                // array that is being spread may contain more than a single element and
                // thus violates the tuple requirement of no more than 3 workers. Cool
              ] as const)
            : ([] as const)),
          ...(bpOracle.getValue("Required Worker", i)[1] != "---"
            ? ([
                {
                  worker: bpOracle.getValue("Required Worker", i)[1],
                  workerLevel: bpOracle.getValue("Worker Level", i)[2],
                },
              ] as const)
            : ([] as const)),
        ],
        upgrades: [...Array(5).keys()].map((slot): CraftUpgrade => {
          return {
            upgrade: bpOracle.getValue(`Crafting Upgrade ${slot + 1}`, i),
            craftsNeeded: bpOracle.getValue("Crafts Needed", i)[slot],
          };
        }) as [
          CraftUpgrade,
          CraftUpgrade,
          CraftUpgrade,
          CraftUpgrade,
          CraftUpgrade
        ],
      },
      energy: {
        discount: bpOracle.getValue("Discount Energy", i),
        surcharge: bpOracle.getValue("Surcharge Energy", i),
        suggest: bpOracle.getValue("Suggest Energy", i),
        speedUp: bpOracle.getValue("Speed Up Energy", i),
      },
      stats: {
        ...(bpOracle.getValue("ATK", i) !== "---" && {
          ATK: bpOracle.getValue("ATK", i),
        }),
        ...(bpOracle.getValue("DEF", i) !== "---" && {
          DEF: bpOracle.getValue("DEF", i),
        }),
        ...(bpOracle.getValue("HP", i) !== "---" && {
          HP: bpOracle.getValue("HP", i),
        }),
        ...(bpOracle.getValue("EVA", i) !== "---" && {
          EVA: bpOracle.getValue("EVA", i),
        }),
        ...(bpOracle.getValue("CRIT", i) !== "---" && {
          CRIT: bpOracle.getValue("CRIT", i),
        }),
        ...(bpOracle.getValue("Elemental Affinity", i) !== "---" && {
          elementalAffinity: bpOracle.getValue("Elemental Affinity", i),
        }),
        ...(bpOracle.getValue("Spirit Affinity", i) !== "---" && {
          spiritAffinity: bpOracle.getValue("Spirit Affinity", i),
        }),
      },
    } as Blueprint;
    // await blueprintsCollection.insertOne(thisBp);
    bpOutput += JSON.stringify(thisBp);
  }

  fs.writeFileSync(`${dataFolder}/blueprints.json`, bpOutput, "utf-8");

  // return

  // async function execute(command) {
  //   const { stdout, stderr } = await exec(command);
  //   console.log("stdout:", stdout);
  //   console.log("stderr:", stderr);
  // }

  // await execute("mongosh shop --eval 'db.blueprints.deleteMany({})'");
  // await execute("mongosh shop --eval 'db.blueprints.drop()'");
  // await execute("mongosh shop < ./model/schema.js");
  // await execute(
  //   `mongoimport --db shop --collection blueprints --type=json --file ${dataFolder}/blueprints.json`
  // );
  // await execute(
  //   `mongosh shop --eval 'printjson(db.blueprints.aggregate([{ "$sample": { size: 1 } }]))'`
  // );

  console.log("success");
  process.exit(0);
}

await main();
