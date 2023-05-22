import fs = require("fs");
import csv = require("csv-parser");

const csvFileName =
  "Shop Titans Data Spreadsheet _ c_ v13.1.0 _ v1.0.2.067 - Blueprints.csv";

async function readCSVFile(filePath: string): Promise<object[]> {
  const results: object[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

async function main() {
  //Get Blueprint data as csv
  //https://docs.google.com/spreadsheets/d/1WLa7X8h3O0-aGKxeAlCL7bnN8-FhGd3t7pz2RCzSg8c/export?gid=1558235212&exportFormat=csv

  let blueprints = await readCSVFile(`./${csvFileName}`);
  console.log(blueprints[0]);

  let exampleOfStructuredBlueprintData = {
    Name: "Squire Sword",
    Type: "Sword",
    "Unlock Prerequisite": "Blacksmith",
    "Research Scrolls": "---",
    "Antique Tokens": "---",
    Tier: "1",
    Value: "50",
    "Crafting Time (seconds)": "15",
    "Crafting Time (formatted)": "00:00:15",
    "Value / Crafting Time": "3.33",
    "Merchant XP": "135",
    "Merchant XP / Crafting Time": "9.00",
    "Worker XP": "2",
    "Fusion XP": "10",
    Favor: "1",
    "Airship Power": "13",
    "": "",
    "Required Worker ": "Blacksmith",
    "Worker Level": "---",
    "Required Worker": "---",
    Component: "---",
    "Component Quality": "---",
    "Amount Needed": "---",
    ATK: "16",
    DEF: "---",
    HP: "---",
    EVA: "---",
    CRIT: "---",
    "Elemental Affinity": "---",
    "Spirit Affinity": "---",
    "Crafting Upgrade 1": "Blueprint: Shiv",
    "Crafts Needed": "80", // These all have the same header, so we only see the last one.
    "Crafting Upgrade 2": "Blueprint: Arming Sword",
    "Crafting Upgrade 3": "x1.5 Value Increase",
    "Crafting Upgrade 4": "Quality Chance x2",
    "Crafting Upgrade 5": "Quality Chance x3",
    "Ascension Upgrade 1": "-4 Iron Spent",
    "Shards Needed": "5", // Same thing is happening here.
    "Ascension Upgrade 2": "+30% Multicraft Chance",
    "Ascension Upgrade 3": "Quality Chance x3",
    "Discount Energy": "5",
    "Surcharge Energy": "15",
    "Suggest Energy": "5",
    "Speed Up Energy": "15",
  };
}

main();
