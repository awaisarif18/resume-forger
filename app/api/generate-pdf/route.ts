import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";

export async function POST(req: NextRequest) {
  // SECURITY: Block this route on Vercel so it doesn't crash the server
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        error:
          "Server-side PDF generation is disabled in production. Please use client-side printing.",
      },
      { status: 403 }
    );
  }

  try {
    const { html } = await req.json();

    if (!html) {
      return NextResponse.json(
        { error: "Missing HTML content" },
        { status: 400 }
      );
    }

    // 1. Point to your LOCAL Windows Chrome
    // If you haven't set this in .env.local, we fallback to the default path
    const executablePath =
      process.env.CHROMIUM_PATH ||
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

    const browser = await puppeteer.launch({
      executablePath,
      headless: true,
    });

    const page = await browser.newPage();

    // 2. Render the HTML
    await page.setContent(html, { waitUntil: "networkidle0" });

    // 3. Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", bottom: "20px" },
    });

    await browser.close();

    // 4. Return the file
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
      },
    });
  } catch (error: any) {
    console.error("Local PDF Gen Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
