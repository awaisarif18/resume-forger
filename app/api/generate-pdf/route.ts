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
      // Make sure this path is correct for YOUR computer!
      // Common paths:
      // "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
      // "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
      const localExecutablePath =
        process.env.CHROMIUM_PATH ||
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

      browser = await puppeteer.launch({
        executablePath: localExecutablePath,
        headless: true,
      });
    } else {
      // --- Vercel Production (Linux) ---
      // We set graphics mode to 'false' to save memory
      chromium.setGraphicsMode = false;

      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    }

    const page = await browser.newPage();

    // Set content and wait for fonts to load
    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

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
