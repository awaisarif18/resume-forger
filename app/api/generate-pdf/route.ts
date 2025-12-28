import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function POST(req: NextRequest) {
  try {
    const { html } = await req.json();

    if (!html) {
      return NextResponse.json({ error: "Missing HTML" }, { status: 400 });
    }

    let browser;

    if (process.env.NODE_ENV === "development") {
      // --- Local Development (Windows) ---
      const localExecutablePath =
        process.env.CHROMIUM_PATH ||
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
      browser = await puppeteer.launch({
        executablePath: localExecutablePath,
        headless: true,
      });
    } else {
      // --- Vercel Production (Linux) ---

      // 1. Force the library to download the binary from a stable URL
      // This bypasses the "missing file" error on Vercel
      const executablePath = await chromium.executablePath(
        "https://github.com/Sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar"
      );

      // 2. Load Fonts (Optional, but good for emojis/symbols)
      // await chromium.font("https://github.com/googlefonts/noto-emoji/raw/main/fonts/NotoColorEmoji.ttf");

      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath,
        headless: chromium.headless,
      });
    }

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", bottom: "20px" },
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
      },
    });
  } catch (error: any) {
    console.error("PDF Gen Error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF", details: error.message },
      { status: 500 }
    );
  }
}
