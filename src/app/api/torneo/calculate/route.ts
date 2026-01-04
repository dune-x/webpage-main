import { type NextRequest, NextResponse } from "next/server";
import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs/promises";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const pythonScriptPath = path.join(process.cwd(), "python", "scheduler.py");
    
    // Create a temporary file for input data
    const tempFilePath = path.join(process.cwd(), "tmp", `input_${Date.now()}.json`);
    await fs.mkdir(path.join(process.cwd(), "tmp"), { recursive: true });
    await fs.writeFile(tempFilePath, JSON.stringify(data));

    return new Promise((resolve) => {
      const pythonProcess = spawn("python", [pythonScriptPath, tempFilePath]);
      
      let resultData = "";
      let errorData = "";

      pythonProcess.stdout.on("data", (data) => {
        resultData += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        errorData += data.toString();
      });

      pythonProcess.on("close", async (code) => {
        // Cleanup temp file
        await fs.unlink(tempFilePath).catch(() => {});
        
        if (code !== 0) {
          resolve(NextResponse.json({ error: "Python process failed", details: errorData }, { status: 500 }));
        } else {
          try {
            const parsedResult = JSON.parse(resultData);
            resolve(NextResponse.json(parsedResult));
          } catch (e) {
            resolve(NextResponse.json({ error: "Failed to parse Python output", output: resultData }, { status: 500 }));
          }
        }
      });
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
