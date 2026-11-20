// fileUtils.js
import * as pdfjsLib from "pdfjs-dist/webpack";
import mammoth from "mammoth";

// Extract text from PDF
export const extractTextFromPDF = async (file) => {
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(it => it.str).join(" ") + "\n\n";
  }
  return text;
};

// Extract text from DOCX/DOC
export const extractTextFromDocx = async (file) => {
  const buf = await file.arrayBuffer();
  const res = await mammoth.extractRawText({ arrayBuffer: buf });
  return res.value;
};
