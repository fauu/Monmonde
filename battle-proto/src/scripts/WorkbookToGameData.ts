import { writeFileSync } from "fs";

import * as XLSX from "xlsx";

const workbookFilePathRelative = process.env.WORKBOOK_PATH;
if (workbookFilePathRelative === undefined) {
  console.error("WORKBOOK_PATH must be set");
  process.exit(-1);
}

const workbook = XLSX.readFile(workbookFilePathRelative);
const movesSheet = workbook.Sheets["Moves"];
const movesSheetRawJson = XLSX.utils.sheet_to_json(movesSheet);
const movesJson = movesSheetRawJson
  .filter((rawMove: any) => Object.prototype.hasOwnProperty.call(rawMove, "COST"))
  .map((rawMove: any) => ({
    name: rawMove["MOVE"],
    cost: rawMove["COST"],
    power: rawMove["POWER"],
    accuracy: rawMove["ACCURACY"],
    castTime: rawMove["CAST TIME"] * 1000,
    requirements: rawMove["TYPES"].split(", ").map((rawType: string) => {
      const openingBracketIdx = rawType.indexOf("(");
      return {
        typeName: rawType.substring(0, openingBracketIdx),
        value: Number(rawType.substring(openingBracketIdx + 1, rawType.length - 1)),
      };
    }),
  }));

writeFileSync("src/data/moves.json", JSON.stringify({ data: movesJson }, null, 2));
