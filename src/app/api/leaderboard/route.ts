import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "leaderboard.json");

const readData = (): { name: string; score: number }[] => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data) as { name: string; score: number }[];
  } catch (error) {
    console.error("Error reading data:", error);
    return [];
  }
};

const writeData = (data: { name: string; score: number }[]) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing data:", error);
  }
};

export async function GET() {
  const leaderboard = readData();
  return NextResponse.json(leaderboard);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received data:", body); 

    const { name, score } = body;
    if (!name || score === undefined) {
      console.error("Invalid request data:", body);
      return NextResponse.json(
        { success: false, error: "Missing name or score" },
        { status: 400 }
      );
    }

    let leaderboard = readData();
    const existingUser = leaderboard.find((player) => player.name === name);

    if (existingUser) {
      existingUser.score += 1;
    } else {
      leaderboard.push({ name, score: 1 });
    }

    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10);

    writeData(leaderboard);
    return NextResponse.json({ success: true, leaderboard });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
