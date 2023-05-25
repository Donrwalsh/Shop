import fs = require("fs");
import csv = require("csv-parser");
import { Blueprint, BlueprintWorker, CraftingMaterial } from "./model";

const csvFileName =
  "Shop Titans Data Spreadsheet _ c_ v13.1.0 _ v1.0.2.067 - Blueprints.csv";

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

async function readCSVFile(filePath: string): Promise<object[]> {
  const results: object[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ headers: false }))
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

async function main() {
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

  function conditionalMaterial(field: string) {
    return getBpVal(bp, headers, field) !== "---"
      ? [{ resource: field, amount: getBpVal(bp, headers, field) }]
      : [];
  }

  function conditionalComponent(index: number): CraftingMaterial[] {
    let output = [];
    if (getBpVal(bp, headers, "Component")[index] !== "---") {
      if (getBpVal(bp, headers, "Component Quality")[index] !== "---") {
        output.push({
          item: getBpVal(bp, headers, "Component")[index],
          quality: getBpVal(bp, headers, "Component Quality")[index],
          amount: getBpVal(bp, headers, "Amount Needed")[index],
        });
      } else {
        output.push({
          component: getBpVal(bp, headers, "Component")[index],
          amount: getBpVal(bp, headers, "Amount Needed")[index],
        });
      }
    }
    return output;
  }

  //Get Blueprint data as csv
  //https://docs.google.com/spreadsheets/d/1WLa7X8h3O0-aGKxeAlCL7bnN8-FhGd3t7pz2RCzSg8c/export?gid=1558235212&exportFormat=csv

  let blueprints = await readCSVFile(`./${csvFileName}`);

  let headers = { ...blueprints[0], ...manualColumns };

  // Remove first array element (headers)
  blueprints.shift();

  let bpOutput =
    "db.blueprints.insertMany([" +
    blueprints.reduce(
      (accumulator, bp) =>
        accumulator +
        JSON.stringify({
          name: getBpVal(bp, headers, "Name"),
          type: getBpVal(bp, headers, "Type"),
          tier: getBpVal(bp, headers, "Tier"),
          ...(getBpVal(bp, headers, "Unlock Prerequisite") !== "---" && {
            unlockPrerequisite: getBpVal(bp, headers, "Unlock Prerequisite"),
          }),
        } as Partial<Blueprint>) +
        ",",
      ""
    ) +
    "]);";

  fs.writeFileSync("./scripts/blueprints.js", bpOutput, "utf-8");

  process.exit(0);

  // let bp = blueprints[135];
  let bp = blueprints[Math.floor(Math.random() * blueprints.length)];

  let output: Blueprint = {
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
      valuePerCraftingSecond: getBpVal(bp, headers, "Value / Crafting Time"),
      merchantXpPerCraftingSecond: getBpVal(
        bp,
        headers,
        "Merchant XP / Crafting Time"
      ),
      materials: [
        ...conditionalMaterial("Iron"),
        ...conditionalMaterial("Wood"),
        ...conditionalMaterial("Leather"),
        ...conditionalMaterial("Herbs"),
        ...conditionalMaterial("Steel"),
        ...conditionalMaterial("Ironwood"),
        ...conditionalMaterial("Fabric"),
        ...conditionalMaterial("Oil"),
        ...conditionalMaterial("Mana"),
        ...conditionalMaterial("Jewels"),
        ...conditionalMaterial("Essence"),
        ...conditionalComponent(0),
        ...conditionalComponent(1),
      ],
      workers: [
        {
          requiredWorker: getBpVal(bp, headers, "Required Worker "), // Note the space
          workerLevel: getBpVal(bp, headers, "Worker Level")[0],
        },
        ...(getBpVal(bp, headers, "Required Worker")[0] !== "---"
          ? ([
              {
                requiredWorker: getBpVal(bp, headers, "Required Worker")[0],
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
                requiredWorker: getBpVal(bp, headers, "Required Worker")[1],
                workerLevel: getBpVal(bp, headers, "Worker Level")[2],
              },
            ] as const)
          : ([] as const)),
      ],
    },
  };

  console.log(JSON.stringify(output, null, 2));
}

main();
