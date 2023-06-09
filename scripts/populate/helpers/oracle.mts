import { CraftingMaterial, ResourceMaterial } from "../model/blueprint.mjs";

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

export class Oracle {
  headers: object;
  data: object[];

  constructor(csvData: object[]) {
    this.headers = { ...csvData[0], ...manualColumns };
    csvData.shift();
    this.data = csvData;
  }

  // Generic, will probably be used everywhere
  getValue(field: string, index: number) {
    let result = [];
    let rawBp = this.data[index];
    Object.keys(this.headers).find((key) => {
      if (this.headers[key] === field) {
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

  count() {
    return this.data.length;
  }

  //Blueprint-specific
  getPossibleComponent(position: number, index: number): CraftingMaterial[] {
    let output = [];
    if (this.getValue("Component", index)[position] !== "---") {
      if (this.getValue("Component Quality", index)[position] !== "---") {
        output.push({
          item: this.getValue("Component", index)[position],
          quality: this.getValue("Component Quality", index)[position],
          amount: this.getValue("Amount Needed", index)[position],
        });
      } else {
        output.push({
          component: this.getValue("Component", index)[position],
          amount: this.getValue("Amount Needed", index)[position],
        });
      }
    }
    return output;
  }

  getPossibleMaterial(field: string, index: number): ResourceMaterial[] {
    return this.getValue(field, index) !== "---"
      ? [{ resource: field, amount: this.getValue(field, index) }]
      : [];
  }
}
