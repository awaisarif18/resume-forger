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
      // Local Windows Development
      browser = await puppeteer.launch({
        channel: "chrome", // Uses your local installed Chrome
        headless: true,
      });
    } else {
      // Vercel Production (Linux)
      // We set specific font support to avoid loading errors
      await chromium.font(
        "https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf"
      );

      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    }

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
      },
    });
  } catch (error: any) {
    console.error("PDF Error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF", details: error.message },
      { status: 500 }
    );
  }
}
