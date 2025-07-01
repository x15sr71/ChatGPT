import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";
import { v4 as uuidv4 } from "uuid";
import mammoth from "mammoth";

const PDFParser = require("pdf2json");

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    const ext = path.extname(url).toLowerCase();
    const tempPath = path.join(tmpdir(), uuidv4() + ext);

    // Download file from Cloudinary
    const response = await axios.get(url, { responseType: "stream" });
    const writer = fs.createWriteStream(tempPath);

    await new Promise<void>((resolve, reject) => {
      response.data.pipe(writer);
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    let extractedText = "";

    if (ext === ".pdf") {
      const pdfParser = new PDFParser();
      extractedText = await new Promise<string>((resolve, reject) => {
        pdfParser.on("pdfParser_dataError", err => reject(err.parserError));
        pdfParser.on("pdfParser_dataReady", pdfData => {
          const texts = pdfData.Pages.flatMap((page: any) =>
            page.Texts.map((t: any) =>
              decodeURIComponent(t.R.map((r: any) => r.T).join(""))
            )
          );
          resolve(texts.join(" "));
        });

        pdfParser.loadPDF(tempPath);
      });

    } else if (ext === ".docx") {
      const result = await mammoth.extractRawText({ path: tempPath });
      extractedText = result.value;

    } else if (ext === ".txt") {
      extractedText = await fs.promises.readFile(tempPath, "utf-8");

    } else {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    return NextResponse.json({ extracted: extractedText.trim() });

  } catch (error) {
    console.error("Document parse error:", error);
    return NextResponse.json({ error: "Failed to extract text" }, { status: 500 });
  }
}
