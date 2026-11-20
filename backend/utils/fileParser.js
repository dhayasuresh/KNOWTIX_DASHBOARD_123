import fs from "fs";
import mammoth from "mammoth";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

export async function extractText(filePath, mimetype) {
  if (mimetype.includes("pdf")) {
    const data = await pdf(fs.readFileSync(filePath));
    return data.text;
  }
  if (mimetype.includes("wordprocessingml")) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }
  if (mimetype.includes("text")) {
    return fs.readFileSync(filePath, "utf8");
  }
  throw new Error(`Unsupported file type: ${mimetype}`);
}
