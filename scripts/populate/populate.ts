import { Oracle } from "./helpers/oracle";
import * as utils from "./helpers/utils";
import { Blueprint, CraftUpgrade } from "./model/blueprint";
import fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const baseSpreadsheetURL =
  "https://docs.google.com/spreadsheets/d/1WLa7X8h3O0-aGKxeAlCL7bnN8-FhGd3t7pz2RCzSg8c";

const GIDs = [
  { fileName: "home", GID: "0" },
  { fileName: "blueprints", GID: "1558235212" },
  { fileName: "workers", GID: "1935922361" },
  { fileName: "workerLevels", GID: "370031681" },
  { fileName: "quests", GID: "1118047087" },
  { fileName: "questComponents", GID: "1893574363" },
  { fileName: "questLevels", GID: "1268805263" },
  { fileName: "heroes", GID: "525835005" },
  { fileName: "heroLevels", GID: "1921844007" },
  { fileName: "champions", GID: "256894468" },
  { fileName: "skills", GID: "1214352620" },
  { fileName: "enchantments", GID: "24042844" },
  { fileName: "slots", GID: "214440679" },
  { fileName: "merchantLevels", GID: "1602631852" },
  { fileName: "shopExpansions", GID: "788450752" },
  { fileName: "basementExpansions", GID: "2073268902" },
  { fileName: "racksCountersAndTrunks", GID: "348010505" },
  { fileName: "resourceBins", GID: "69438216" },
  { fileName: "guildPerks", GID: "229020017" },
  { fileName: "guildBoosts", GID: "1646781176" },
  { fileName: "friendshipLevels", GID: "303650781" },
  { fileName: "achievements", GID: "1060499774" },
  { fileName: "buildings", GID: "460010172" },
  { fileName: "buildingTicks", GID: "1688636929" },
  { fileName: "pets", GID: "28361090" },
  { fileName: "petLevels", GID: "1414683499" },
  { fileName: "fullMoonFusions", GID: "604614418" },
  { fileName: "collectionBook", GID: "805699567" },
  { fileName: "changelog", GID: "739208601" },
  { fileName: "legendKey", GID: "1970198360" },
];

async function main() {
  // Get the data
  let homeFileName = (await utils.downloadFile(
    `${baseSpreadsheetURL}/export?gid=${GIDs[0].GID}&exportFormat=csv`
  )) as string;

  let vFolder = `${homeFileName.split(" ")[6]}-${homeFileName.split(" ")[8]}`;
  let dataFolder = `./data/${vFolder}`;

  if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder);
  }

  fs.renameSync(
    `./${homeFileName}`,
    `${dataFolder}/${homeFileName.split(" ")[10].toLowerCase()}`
  );

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

  for (let i = 1; i < GIDs.length; i++) {
    console.log(
      (await fetchCsv(GIDs[i].GID, `${GIDs[i].fileName}.csv`))
        ? `NOT FOUND ${GIDs[i].fileName}.csv: processing download`
        : `found ${GIDs[i].fileName}.csv: skipping download`
    );
  }

  // Populate the database
  let blueprints = await utils.readCSVFile(`${dataFolder}/blueprints.csv`);

  let bpOracle = new Oracle(blueprints);

  let bpOutput = "";
  for (let i = 0; i < bpOracle.count(); i++) {
    bpOutput += JSON.stringify({
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
    } as Blueprint);
  }

  fs.writeFileSync(`${dataFolder}/blueprints.json`, bpOutput, "utf-8");

  async function execute(command) {
    const { stdout, stderr } = await exec(command);
    console.log("stdout:", stdout);
    console.log("stderr:", stderr);
  }

  await execute("mongosh shop --eval 'db.blueprints.deleteMany({})'");
  await execute("mongosh shop --eval 'db.blueprints.drop()'");
  await execute("mongosh shop < ./model/schema.js");
  await execute(
    `mongoimport --db shop --collection blueprints --type=json --file ${dataFolder}/blueprints.json`
  );
  await execute(
    `mongosh shop --eval 'printjson(db.blueprints.aggregate([{ "$sample": { size: 1 } }]))'`
  );

  console.log("success");
  process.exit(0);
}

main();
