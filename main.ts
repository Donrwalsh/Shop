import * as utils from "./helpers/utils";
import fs = require("fs");
import { Blueprint, CraftingMaterial } from "./model";
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const baseSpreadsheetURL =
  "https://docs.google.com/spreadsheets/d/1WLa7X8h3O0-aGKxeAlCL7bnN8-FhGd3t7pz2RCzSg8c";

const blueprintsGID = "1558235212";

const manualColumns = {
  "24": "Iron",
  "25": "Wood",
  "26": "Leather",
  "27": "Herbs",
  "28": "Steel",
  "29": "Ironwood",
  "30": "Fabric",
  "31": "Oil", // image says "Oils"
  "32": "Mana",
  "33": "Jewels", // image says "Gems"
  "34": "Essence",
};

async function main() {
  let bpFileName = await utils.downloadFile(
    `${baseSpreadsheetURL}/export?gid=${blueprintsGID}&exportFormat=csv`
  );

  let blueprints = await utils.readCSVFile(`./${bpFileName}`);

  let headers = { ...blueprints[0], ...manualColumns };

  // let bp = blueprints[135];
  let bp = blueprints[Math.floor(Math.random() * blueprints.length)];

  function getBpVal(rawBp: any, headers: any, field: string) {
    let result = [];
    Object.keys(headers).find((key) => {
      if (headers[key] === field) {
        if (/^[0-9,]*$/.test(rawBp[key])) {
          result.push(parseInt(rawBp[key].split(",").join("")));
        } else if (/^[0-9.]*$/.test(rawBp[key])) {
          result.push(parseFloat(rawBp[key]));
        } else {
          result.push(rawBp[key]);
        }
      }
    });
    if (result.length == 1) {
      return result[0];
    } else {
      return result;
    }
  }

  function conditionalMaterial(rawBp: any, field: string) {
    return getBpVal(rawBp, headers, field) !== "---"
      ? [{ resource: field, amount: getBpVal(rawBp, headers, field) }]
      : [];
  }

  function conditionalComponent(rawBp: any, index: number): CraftingMaterial[] {
    let output = [];
    if (getBpVal(rawBp, headers, "Component")[index] !== "---") {
      if (getBpVal(rawBp, headers, "Component Quality")[index] !== "---") {
        output.push({
          item: getBpVal(rawBp, headers, "Component")[index],
          quality: getBpVal(rawBp, headers, "Component Quality")[index],
          amount: getBpVal(rawBp, headers, "Amount Needed")[index],
        });
      } else {
        output.push({
          component: getBpVal(rawBp, headers, "Component")[index],
          amount: getBpVal(rawBp, headers, "Amount Needed")[index],
        });
      }
    }
    return output;
  }

  // Remove first array element (headers)
  blueprints.shift();

  let bpOutput = blueprints.reduce(
    (accumulator, bp) =>
      accumulator +
      JSON.stringify({
        name: getBpVal(bp, headers, "Name"),
        type: getBpVal(bp, headers, "Type"),
        tier: getBpVal(bp, headers, "Tier"),
        ...(getBpVal(bp, headers, "Unlock Prerequisite") !== "---" && {
          unlockPrerequisite: getBpVal(bp, headers, "Unlock Prerequisite"),
        }),
        values: {
          gold: getBpVal(bp, headers, "Value"),
          merchantXp: getBpVal(bp, headers, "Merchant XP"),
          workerXp: getBpVal(bp, headers, "Worker XP"),
          fusionXp: getBpVal(bp, headers, "Fusion XP"),
          favor: getBpVal(bp, headers, "Favor"),
          airshipPower: getBpVal(bp, headers, "Airship Power"),
          ...(getBpVal(bp, headers, "Antique Tokens") !== "---" && {
            antiqueTokens: getBpVal(bp, headers, "Antique Tokens"),
          }),
          ...(getBpVal(bp, headers, "Research Scrolls") !== "---" && {
            researchScrolls: getBpVal(bp, headers, "Research Scrolls"),
          }),
        },
        ascensionUpgrades: [
          {
            upgrade: getBpVal(bp, headers, "Ascension Upgrade 1"),
            shards: getBpVal(bp, headers, "Shards Needed")[0],
          },
          {
            upgrade: getBpVal(bp, headers, "Ascension Upgrade 2"),
            shards: getBpVal(bp, headers, "Shards Needed")[1],
          },
          {
            upgrade: getBpVal(bp, headers, "Ascension Upgrade 3"),
            shards: getBpVal(bp, headers, "Shards Needed")[2],
          },
        ],
        crafting: {
          timeInSeconds: getBpVal(bp, headers, "Crafting Time (seconds)"),
          timeFormatted: getBpVal(bp, headers, "Crafting Time (formatted)"),
          goldPerCraftingSecond: getBpVal(
            bp,
            headers,
            "Value / Crafting Time"
          ).toFixed(2),
          merchantXpPerCraftingSecond: getBpVal(
            bp,
            headers,
            "Merchant XP / Crafting Time"
          ).toFixed(2),
          materials: [
            ...conditionalMaterial(bp, "Iron"),
            ...conditionalMaterial(bp, "Wood"),
            ...conditionalMaterial(bp, "Leather"),
            ...conditionalMaterial(bp, "Herbs"),
            ...conditionalMaterial(bp, "Steel"),
            ...conditionalMaterial(bp, "Ironwood"),
            ...conditionalMaterial(bp, "Fabric"),
            ...conditionalMaterial(bp, "Oil"),
            ...conditionalMaterial(bp, "Mana"),
            ...conditionalMaterial(bp, "Jewels"),
            ...conditionalMaterial(bp, "Essence"),
            ...conditionalComponent(bp, 0),
            ...conditionalComponent(bp, 1),
          ],
          workers: [
            {
              worker: getBpVal(bp, headers, "Required Worker "), // Note the space
              workerLevel: getBpVal(bp, headers, "Worker Level")[0],
            },
            ...(getBpVal(bp, headers, "Required Worker")[0] !== "---"
              ? ([
                  {
                    worker: getBpVal(bp, headers, "Required Worker")[0],
                    workerLevel: getBpVal(bp, headers, "Worker Level")[1],
                  },
                  // This casting as a const prevents ts2322 where typescript thinks this
                  // array that is being spread may contain more than a single element and
                  // thus violates the tuple requirement of no more than 3 workers. Cool
                ] as const)
              : ([] as const)),
            ...(getBpVal(bp, headers, "Required Worker")[1] !== "---"
              ? ([
                  {
                    worker: getBpVal(bp, headers, "Required Worker")[1],
                    workerLevel: getBpVal(bp, headers, "Worker Level")[2],
                  },
                ] as const)
              : ([] as const)),
          ],
          upgrades: [
            {
              upgrade: getBpVal(bp, headers, "Crafting Upgrade 1"),
              craftsNeeded: getBpVal(bp, headers, "Crafts Needed")[0],
            },
            {
              upgrade: getBpVal(bp, headers, "Crafting Upgrade 2"),
              craftsNeeded: getBpVal(bp, headers, "Crafts Needed")[1],
            },
            {
              upgrade: getBpVal(bp, headers, "Crafting Upgrade 3"),
              craftsNeeded: getBpVal(bp, headers, "Crafts Needed")[2],
            },
            {
              upgrade: getBpVal(bp, headers, "Crafting Upgrade 4"),
              craftsNeeded: getBpVal(bp, headers, "Crafts Needed")[3],
            },
            {
              upgrade: getBpVal(bp, headers, "Crafting Upgrade 5"),
              craftsNeeded: getBpVal(bp, headers, "Crafts Needed")[4],
            },
          ],
        },
        energy: {
          discount: getBpVal(bp, headers, "Discount Energy"),
          surcharge: getBpVal(bp, headers, "Surcharge Energy"),
          suggest: getBpVal(bp, headers, "Suggest Energy"),
          speedUp: getBpVal(bp, headers, "Speed Up Energy"),
        },
        stats: {
          ...(getBpVal(bp, headers, "ATK") !== "---" && {
            ATK: getBpVal(bp, headers, "ATK"),
          }),
          ...(getBpVal(bp, headers, "DEF") !== "---" && {
            DEF: getBpVal(bp, headers, "DEF"),
          }),
          ...(getBpVal(bp, headers, "HP") !== "---" && {
            HP: getBpVal(bp, headers, "HP"),
          }),
          ...(getBpVal(bp, headers, "EVA") !== "---" && {
            EVA: getBpVal(bp, headers, "EVA"),
          }),
          ...(getBpVal(bp, headers, "CRIT") !== "---" && {
            CRIT: getBpVal(bp, headers, "CRIT"),
          }),
          ...(getBpVal(bp, headers, "Elemental Affinity") !== "---" && {
            elementalAffinity: getBpVal(bp, headers, "Elemental Affinity"),
          }),
          ...(getBpVal(bp, headers, "Spirit Affinity") !== "---" && {
            spiritAffinity: getBpVal(bp, headers, "Spirit Affinity"),
          }),
        },
      } as Blueprint) +
      "",
    ""
  );

  fs.writeFileSync("./scripts/blueprints.json", bpOutput, "utf-8");

  async function execute(command) {
    const { stdout, stderr } = await exec(command);
    console.log("stdout:", stdout);
    console.log("stderr:", stderr);
  }

  await execute("mongosh shop --eval 'db.blueprints.deleteMany({})'");
  await execute("mongosh shop --eval 'db.blueprints.drop()'");
  await execute("mongosh shop < ./scripts/schema.js");
  await execute(
    "mongoimport --db shop --collection blueprints --type=json --file ./scripts/blueprints.json"
  );
  await execute(
    `mongosh shop --eval 'printjson(db.blueprints.aggregate([{ "$sample": { size: 1 } }]))'`
  );

  console.log("success");
  process.exit(0);
}

main();
