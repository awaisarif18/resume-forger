import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function POST(req: NextRequest) {
  try {
    const { html } = await req.json();

    if (!html) {
      return NextResponse.json(
        { error: "HTML content is required" },
        { status: 400 }
      );
    }

    let browser;

    // 1. Determine Environment (Local vs. Vercel)
    if (process.env.NODE_ENV === "development" || process.env.CHROMIUM_PATH) {
      // LOCAL MODE
      browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        executablePath: process.env.CHROMIUM_PATH, // Reads from .env.local
        headless: true,
      });
    } else {
      // PRODUCTION MODE (Vercel)
      chromium.setGraphicsMode = false;
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    }

    const page = await browser.newPage();

    // 2. Inject Tailwind CSS and Reset Styles
    // We wrap the user's raw HTML in a proper structure with the CDN
    const fullContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
             /* Ensure exact color printing */
             @page { margin: 0; }
             body { 
               -webkit-print-color-adjust: exact; 
               print-color-adjust: exact;
             }
          </style>
        </head>
        <body class="bg-white">
          ${html}
        </body>
      </html>
    `;

    // 3. Set Content & Wait for Network
    // 'networkidle0' is CRITICAL here: it waits until the Tailwind script
    // has finished downloading and running before generating the PDF.
    await page.setContent(fullContent, { waitUntil: "networkidle0" });

    // 4. Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        bottom: "20px",
        left: "20px",
        right: "20px",
      },
    });

    await browser.close();

    // 5. Return Response
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=resume.pdf",
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
