import * as utils from "./utils.mjs";

// I want my cursors to be like this so I don't have to worry about joining a cursor to a table when I'm building the objects.
interface Cursor {
  name: string;
  x: number;
  y: number;
  tables: {
    field: string;
    values: any[];
  }[];
}

export class Seeker {
  public racksCountersAndTrunksCursors;
  public binsCursors;

  constructor() {}

  getFurnitureCursors() {
    return this.racksCountersAndTrunksCursors.concat(this.binsCursors);
  }

  setRacksCountersAndTrunks(csvFile: object[]) {
    this.racksCountersAndTrunksCursors = this.cursorsFromCsv(csvFile);
  }

  setBins(csvFile: object[]) {
    this.binsCursors = this.cursorsFromCsv(csvFile);
  }

  getValue(cursor: Cursor, fieldName: string, i: number) {
    return (
      cursor.tables.filter((entry) => entry.field === fieldName).length > 0 &&
      cursor.tables.filter((entry) => entry.field == fieldName)[0].values[i] !=
        null &&
        cursor.tables.filter((entry) => entry.field == fieldName)[0].values[i] !=
        "---" &&
      cursor.tables.filter((entry) => entry.field == fieldName)[0].values[i]
    );
  }

  cursorsFromCsv(csvFile: object[]) {
    let cursors = [];
    csvFile.forEach((row, index) => {
      Object.keys(row).forEach((key) => {
        if (/[A-Z]+$/.test(row[key])) {
          cursors.push({
            name: row[key],
            x: parseInt(key),
            y: index,
          });
        }
      });
    });
    cursors.forEach((cursor) => {
      let tables = [];

      let i = 0;
      while (true) {
        let field = csvFile[cursor.y + 2][`${cursor.x + 1 + i}`];
        if (field != "" && field != undefined) {
          let values = Array.from({ length: 20 }, (_, j) => {
            let output = csvFile[cursor.y + 2 + 1 + j][`${cursor.x + 1 + i}`];
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
          tables.push({
            field: field,
            values: values,
          });
          i++;
        } else {
          break;
        }
      }
      cursor["tables"] = tables;
    });
    return cursors;
  }
}
