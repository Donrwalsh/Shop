import csv = require("csv-parser");
import fs = require("fs");
import https = require("https");

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
