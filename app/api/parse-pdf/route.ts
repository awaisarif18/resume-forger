import { NextRequest, NextResponse } from "next/server";

// ------------------------------------------------------------------
// 1. POLYFILLS: Mock browser features for Node.js
// pdf-parse relies on 'DOMMatrix' for text positioning calculations.
// We define a minimal version of it globally before the library loads.
// ------------------------------------------------------------------
if (typeof Promise.withResolvers === "undefined") {
  // @ts-expect-error - Polyfill for older Node versions if needed
  Promise.withResolvers = function () {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

if (typeof global.DOMMatrix === "undefined") {
  // @ts-expect-error - Mocking the global DOMMatrix class
  global.DOMMatrix = class DOMMatrix {
    a = 1;
    b = 0;
    c = 0;
    d = 1;
    e = 0;
    f = 0;
    is2D = true;
    isIdentity = true;
    constructor() {}
    translate() {
      return this;
    }
    scale() {
      return this;
    }
    rotate() {
      return this;
    }
    multiply() {
      return this;
    }
    inverse() {
      return this;
    }
    setMatrixValue() {
      return this;
    }
  };
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ---------------------------------------------------------
    // 2. SAFE IMPORT: Handle CommonJS vs ES Module weirdness
    // Sometimes 'require' returns the function, sometimes an object.
    // ---------------------------------------------------------
    /* eslint-disable @typescript-eslint/no-require-imports */
    let pdfParser = require("pdf-parse");

    // Check if it's the ".default" export (Common ES Module issue)
    if (typeof pdfParser !== "function" && pdfParser.default) {
      pdfParser = pdfParser.default;
    }

    // 3. EXECUTE
    const data = await pdfParser(buffer);

    // Return cleaned text
    return NextResponse.json({ text: data.text });
  } catch (error: any) {
    console.error("PDF Parse Error:", error);
    return NextResponse.json(
      { error: "Failed to parse PDF", details: error.message },
      { status: 500 }
    );
  }
}
