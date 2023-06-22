import * as utils from "./utils.mjs";

// I want my cursors to be like this so I don't have to worry about joining a cursor to a table when I'm building the objects.
interface Cursor {
  name: string;
  x: number;
  y: number;
  tableHeight: number | null;
  tables: {
    field: string;
    values: any[];
  }[];
}

export class Seeker {
  public racksCountersAndTrunksCursors;
  public binsCursors;
  public slotsCursors;

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

  setSlots(csvFile: object[]) {
    this.slotsCursors = this.cursorsFromCsv(csvFile, false);
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

  cursorsFromCsv(csvFile: object[], largeTitle: boolean = true) {
    let cursors = [];
    csvFile.forEach((row, index) => {
      Object.keys(row).forEach((key) => {
        if (/[A-Z]+$/.test(row[key])) {
          cursors.push({
            name: row[key],
            x: parseInt(key),
            y: index,
            tableHeight: null,
          });
        }
      });
    });
    cursors.forEach((cursor) => {
      let tables = [];

      let i = 0;
      while (true) {
        let field =
          csvFile[cursor.y + (largeTitle ? 2 : 1)][
            `${cursor.x + (largeTitle ? 1 : 0) + i}`
          ];
        if (field != "" && field != undefined) {
          if (cursor.tableHeight === null) {
            let height = 0;
            while (true) {
              let yPos = cursor.y + (largeTitle ? 2 : 1) + height;
              if (yPos === csvFile.length) {
                cursor.tableHeight = height - 1;
                break;
              } else {
                let fieldVal =
                  csvFile[yPos][`${cursor.x + (largeTitle ? 1 : 0) + i}`];
                if (fieldVal != "" && fieldVal != undefined) {
                  height++;
                } else {
                  cursor.tableHeight = height - 1;
                  break;
                }
              }
            }
          }
          let values = Array.from({ length: cursor.tableHeight }, (_, j) => {
            let output = csvFile[cursor.y + (largeTitle ? 3 : 2) + j][`${cursor.x + (largeTitle ? 1 : 0) + i}`];
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
