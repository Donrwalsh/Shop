import { Oracle } from "./helpers/oracle.mjs";
import * as utils from "./helpers/utils.mjs";
import { Blueprint, CraftUpgrade } from "./model/blueprint.mjs";
import * as fs from "fs";
import { getLogger } from "./helpers/LogConfig.mjs";
import * as mongoDB from "mongodb";
import { Seeker } from "./helpers/seeker.mjs";
import { Furniture } from "./model/furniture.mjs";
import { Slot } from "./model/slot.mjs";

const log = getLogger("script.gather");

const baseSpreadsheetURL =
  "https://docs.google.com/spreadsheets/d/1WLa7X8h3O0-aGKxeAlCL7bnN8-FhGd3t7pz2RCzSg8c";

async function main() {
  console.clear();
  log.info(() => `--===-- Data Harvest --===--`);

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

  let seeker = new Seeker();

  // ==== SLOTS
  seeker.setSlots(await utils.readCSVFile(`${dataFolder}/slots.csv`));
  seeker.setShopExpansionCursor(
    await utils.readCSVFile(`${dataFolder}/shopExpansions.csv`)
  );
  seeker.setBasementExpansionCursor(
    await utils.readCSVFile(`${dataFolder}/basementExpansions.csv`)
  );

  let slotOutput = "";
  seeker.getFullSlotsCursors().forEach((cursor) => {
    for (let i = 0; i < cursor.tableHeight; i++) {
      slotOutput +=
        JSON.stringify({
          _id: `${cursor.name
            .replace(" ", "-")
            .toLowerCase()
            .substring(0, cursor.name.length - 1)}-${i + 1}`,

          type: `${cursor.name
            .toLowerCase()
            .split(" ")
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" ")
            .substring(0, cursor.name.length - 1)}`,
          ...(seeker.getValue(cursor, "Expansion Type", i) && {
            subType: seeker.getValue(cursor, "Expansion Type", i),
          }),
          ...(seeker.getValue(cursor, "Capacity", i) && {
            stats: { capacity: seeker.getValue(cursor, "Capacity", i) },
          }),
          ...(i != cursor.tableHeight - 1
            ? {
                upgrade: {
                  goldCost: seeker.getValue(cursor, "Gold Cost", i + 1),
                  gemRush: seeker.getValue(cursor, "Gem Cost", i + 1),
                  ...(seeker.getValue(cursor, "Completion Time", i) && {
                    upgradeTimeInSeconds: seeker.getValue(
                      cursor,
                      "Completion Time",
                      i + 1
                    ),
                  }),
                  requiredMerchantLevel: seeker.getValue(
                    cursor,
                    "Level Required",
                    i + 1
                  ),
                },
              }
            : {}),

          slotNumber: seeker.getValue(cursor, "#", i),
        } as Partial<Slot>) + ",";
    }
  });

  fs.writeFileSync(
    `../../database/data/slots.json`,
    `[${slotOutput.substring(0, slotOutput.length - 1)}]`,
    "utf-8"
  );

  // ==== FURNITURE
  let racksCountersAndTrunks = await utils.readCSVFile(
    `${dataFolder}/racksCountersAndTrunks.csv`
  );

  seeker.setRacksCountersAndTrunks(racksCountersAndTrunks);

  let bins = await utils.readCSVFile(`${dataFolder}/resourceBins.csv`);

  seeker.setBins(bins);

  let furnitureOutput = "";
  seeker.getFurnitureCursors().forEach((cursor, index) => {
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
            ...(seeker.getValue(cursor, "Energy Cap", i) && {
              energy: seeker.getValue(cursor, "Energy Cap", i),
            }),
            ...(cursor.name === "DRAGON'S HOARD BIN"
              ? {
                  hoardStorage: seeker
                    .getValue(cursor, "Storage Cap", i)
                    .split("/")
                    .map((val) => parseInt(val.trim())),
                }
              : seeker.getValue(cursor, "Storage Cap", i) && {
                  storage: seeker.getValue(cursor, "Storage Cap", i),
                }),
            ...(seeker.getValue(cursor, "Inventory Cap", i) && {
              storage: seeker.getValue(cursor, "Inventory Cap", i),
            }),
            size: seeker.getValue(cursor, "Size", i),
            ...(seeker.getValue(cursor, "Sale Energy", i) && {
              saleEnergy: seeker.getValue(cursor, "Sale Energy", i),
            }),
            ...(seeker.getValue(cursor, "Max Energy (%)", i) && {
              maxEnergyPct: seeker.getValue(cursor, "Max Energy (%)", i),
            }),
            ...(seeker.getValue(cursor, "Regen Bonus (%)", i) && {
              regenBonusPct: seeker.getValue(cursor, "Regen Bonus (%)", i),
            }),
          },
          ...(i != 19
            ? {
                upgrade: {
                  goldCost: seeker.getValue(cursor, "Gold Cost", i + 1),
                  gemRush: seeker.getValue(cursor, "Gem Cost", i + 1),
                  ...(seeker.getValue(cursor, "Dragonmarks", i + 1) && {
                    dragonMarks: seeker.getValue(cursor, "Dragonmarks", i + 1),
                  }),
                  upgradeTimeInSeconds: seeker.getValue(
                    cursor,
                    "Upgrade Time",
                    i + 1
                  ),
                  requiredMerchantLevel: seeker.getValue(
                    cursor,
                    "Merchant Level",
                    i + 1
                  ),
                  ...(seeker.getValue(cursor, "Required Building", i + 1) && {
                    requiredBuilding: seeker
                      .getValue(cursor, "Required Building", i + 1)
                      .slice(
                        0,
                        seeker
                          .getValue(cursor, "Required Building", i + 1)
                          .indexOf("Lv.") - 1
                      ),
                  }),
                  ...(seeker.getValue(cursor, "Required Building", i + 1) && {
                    requiredBuildingLevel: parseInt(
                      seeker
                        .getValue(cursor, "Required Building", i + 1)
                        .trim()
                        .replace(/\D/g, "")
                    ),
                  }),
                },
              }
            : {}),
        } as Furniture) + ",";
    }
  });

  fs.writeFileSync(
    `../../database/data/furniture.json`,
    `[${furnitureOutput.substring(0, furnitureOutput.length - 1)}]`,
    "utf-8"
  );

  // ==== MERCHANT LEVELS

  let merchantLevels = await utils.readCSVFile(
    `${dataFolder}/merchantLevels.csv`
  );

  let mlOracle = new Oracle(merchantLevels);

  let mlOutput = "";
  for (let i = 0; i < mlOracle.count(); i++) {
    let thisLevel = {
      level: mlOracle.getValue("Merchant Level", i),
      highestMarketTier: mlOracle.getValue("Market Item Tier Unlock", i),
      ...(i === mlOracle.count() - 1
        ? {}
        : {
            upgrade: {
              xpNeeded: mlOracle.getValue("XP Needed", i + 1),
              gemReward: mlOracle.getValue("Gem Reward", i + 1),
            },
          }),
    };

    mlOutput += JSON.stringify(thisLevel) + ",";
  }

  fs.writeFileSync(
    `../../database/data/levels.json`,
    `[${mlOutput.substring(0, mlOutput.length - 1)}]`,
    "utf-8"
  );

  // ==== BLUEPRINTS
  let blueprints = await utils.readCSVFile(`${dataFolder}/blueprints.csv`);

  let bpOracle = new Oracle(blueprints);

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

    bpOutput += JSON.stringify(thisBp) + ",";
  }

  fs.writeFileSync(
    `../../database/data/blueprints.json`,
    `[${bpOutput.substring(0, bpOutput.length - 1)}]`,
    "utf-8"
  );

  console.log("success");
  process.exit(0);
}

await main();
