import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jobDesc } = await req.json();

    if (!resumeText || !jobDesc) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    // 1. Locate the script
    // process.cwd() is the root folder in both Local and Vercel
    const scriptPath = path.join(process.cwd(), "scripts", "scan_resume.py");

    // 2. Select Python Interpreter
    // Windows uses 'python', Vercel (Linux) uses 'python3'
    const pythonCommand = process.platform === "win32" ? "python" : "python3";

    return new Promise((resolve) => {
      const pythonProcess = spawn(pythonCommand, [scriptPath]);

      let result = "";
      let error = "";

      // Send data to Python script
      pythonProcess.stdin.write(JSON.stringify({ resumeText, jobDesc }));
      pythonProcess.stdin.end();

      // Collect data
      pythonProcess.stdout.on("data", (data) => {
        result += data.toString();
      });

      // Collect errors
      pythonProcess.stderr.on("data", (data) => {
        error += data.toString();
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          console.error("Python Script Error:", error);
          resolve(
            NextResponse.json(
              { error: "Scanner failed", details: error },
              { status: 500 }
            )
          );
        } else {
          try {
            // Parse the JSON output from Python
            const parsed = JSON.parse(result);
            resolve(NextResponse.json(parsed));
          } catch (e) {
            console.error("Invalid JSON from Python:", result);
            resolve(
              NextResponse.json({ error: "Invalid response" }, { status: 500 })
            );
          }
        }
      });
    });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
