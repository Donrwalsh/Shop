import * as https from "https";
import * as fs from "fs";
import csv from 'csv-parser';


//https://futurestud.io/tutorials/node-js-how-to-download-a-file
export async function downloadFile(url) {
  return await new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        const code = response.statusCode ?? 0;

        if (code >= 400) {
          return reject(new Error(response.statusMessage));
        }

        // handle redirects
        if (code > 300 && code < 400 && !!response.headers.location) {
          return resolve(downloadFile(response.headers.location));
        }

        let filename = decodeURIComponent(
          response.rawHeaders
            .find((rawHeader) =>
              rawHeader.includes("Shop%20Titans%20Data%20Spreadsheet")
            )
            .split("filename*=UTF-8''")[1]
        )
          .replace("|", "_")
          .replace(":", "_")
          .replace("/", "_");

        // save the file to disk
        const fileWriter = fs
          .createWriteStream(filename.replace("/", "_"))
          .on("finish", () => {
            resolve(filename);
          });

        response.pipe(fileWriter);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

export async function readCSVFile(filePath: string): Promise<object[]> {
  const results: object[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ headers: false }))
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

export const GIDs = [
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