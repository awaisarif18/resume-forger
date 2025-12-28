import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jobDesc } = await req.json();

    if (!resumeText || !jobDesc) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    const scriptPath = path.join(process.cwd(), "scripts", "scan_resume.py");
    const pythonCommand = process.platform === "win32" ? "python" : "python3";

    // FIX: Explicitly tell TypeScript this Promise returns a NextResponse
    return new Promise<NextResponse>((resolve) => {
      const pythonProcess = spawn(pythonCommand, [scriptPath]);

      let result = "";
      let error = "";

      pythonProcess.stdin.write(JSON.stringify({ resumeText, jobDesc }));
      pythonProcess.stdin.end();

      pythonProcess.stdout.on("data", (data) => {
        result += data.toString();
      });

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
            const parsed = JSON.parse(result);
            resolve(NextResponse.json(parsed));
          } catch (e) {
            console.error("Invalid JSON from Python:", result);
            resolve(
              NextResponse.json(
                { error: "Invalid response from AI engine" },
                { status: 500 }
              )
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
