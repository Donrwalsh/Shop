import fs = require("fs");
import csv = require("csv-parser");
import { Blueprint } from "./model";

const csvFileName =
  "Shop Titans Data Spreadsheet _ c_ v13.1.0 _ v1.0.2.067 - Blueprints.csv";

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
  //Get Blueprint data as csv
  //https://docs.google.com/spreadsheets/d/1WLa7X8h3O0-aGKxeAlCL7bnN8-FhGd3t7pz2RCzSg8c/export?gid=1558235212&exportFormat=csv

  let blueprints = await readCSVFile(`./${csvFileName}`);

  let headers = blueprints[0];

  // let bp = blueprints[1];
  let bp = blueprints[Math.floor(Math.random() * blueprints.length)];

  function getBpVal(rawBp: any, headers: any, field: string) {
    let result = [];
    Object.keys(headers).find((key) => {
      if (headers[key] === field) {
        result.push(
          /^[0-9,.]*$/.test(rawBp[key])
            ? parseInt(rawBp[key].split(",").join(""))
            : rawBp[key]
        );
      }
    });
    if (result.length == 1) {
      return result[0];
    }
  }

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
  };

  console.log(output);
}

main();
