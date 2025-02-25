import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "leaderboard.json");

const readData = () => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};
const writeData = (data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};
export async function GET() {
  const leaderboard = readData();
  return NextResponse.json(leaderboard);
}
export async function POST(req: Request) {
    const { name, score } = await req.json();
    if (!name || score === undefined) {
      return NextResponse.json({ success: false, error: "Missing name or score" }, { status: 400 });
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
  }
  