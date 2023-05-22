import fs = require("fs");
import csv = require("csv-parser");
import { Blueprint } from "./model";
import { lookup } from "dns";

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

  //Basic impl. works for unique/present headers only
  function lookupFieldVal(field: string) {
    return Object.keys(headers).find((key) => {
      return headers[key] === field;
    });
  }

  let output: Blueprint = {
    name: bp[lookupFieldVal("Name")],
    type: bp[lookupFieldVal("Type")],
    tier: parseInt(bp[lookupFieldVal("Tier")]),
    ...(bp[lookupFieldVal("Unlock Prerequisite")] !== "---" && {
      unlockPrerequisite: bp[lookupFieldVal("Unlock Prerequisite")],
    }),
    values: {
      gold: parseInt(bp[lookupFieldVal("Value")].split(",").join("")),
      merchantXp: parseInt(
        bp[lookupFieldVal("Merchant XP")].split(",").join("")
      ),
      workerXp: parseInt(bp[lookupFieldVal("Worker XP")].split(",").join("")),
      fusionXp: parseInt(bp[lookupFieldVal("Fusion XP")].split(",").join("")),
      favor: parseInt(bp[lookupFieldVal("Favor")].split(",").join("")),
      airshipPower: parseInt(
        bp[lookupFieldVal("Airship Power")].split(",").join("")
      ),
      ...(bp[lookupFieldVal("Antique Tokens")] !== "---" && {
        antiqueTokens: parseInt(
          bp[lookupFieldVal("Antique Tokens")].split(",").join("")
        ),
      }),
      ...(bp[lookupFieldVal("Research Scrolls")] !== "---" && {
        researchScrolls: parseInt(
          bp[lookupFieldVal("Research Scrolls")].split(",").join("")
        ),
      }),
    },
  };

  console.log(output);
}

main();
