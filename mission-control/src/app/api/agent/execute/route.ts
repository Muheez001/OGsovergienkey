import { NextResponse } from "next/server";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const { agentId, instruction } = await request.json();

    if (!agentId || !instruction) {
      return NextResponse.json({ success: false, message: "Agent ID and instruction are required" }, { status: 400 });
    }

    const orchestratorPath = path.resolve(process.cwd(), "..", "ai-orchestrator");
    
    if (!fs.existsSync(orchestratorPath)) {
        throw new Error(`Orchestrator directory not found at: ${orchestratorPath}`);
    }

    const command = `npx ts-node --transpile-only src/execute-task.ts ${agentId} "${instruction}"`;
    console.log(`[API] Executing task command: ${command}`);

    const { stdout, stderr } = await execAsync(command, {
      cwd: orchestratorPath,
      timeout: 300000, 
      env: { ...process.env, TS_NODE_TRANSPILE_ONLY: "true" }
    });

    if (stderr && stderr.includes("Error")) {
        console.error(`[API] Task Execution Stderr: ${stderr}`);
    }

    return NextResponse.json({
      success: true,
      logs: stdout,
      message: "Task executed and recorded on-chain successfully",
    });

  } catch (error: any) {
    console.error("[API] Task Execution Error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to execute agent task",
    }, { status: 500 });
  }
}
