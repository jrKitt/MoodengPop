import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);

export async function GET() {
    const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order("score", { ascending: false })
        .limit(10);

    if (error) return NextResponse.json({ success: false, error }, { status: 500 });
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    const { name, score } = await req.json();
    if (!name || score === undefined) {
        return NextResponse.json(
            { success: false, error: "Missing name or score" },
            { status: 400 }
        );
    }

    const { data, error } = await supabase
        .from("leaderboard")
        .upsert([{ name, score }], { onConflict: "name" });

    if (error) return NextResponse.json({ success: false, error }, { status: 500 });

    return NextResponse.json({ success: true, leaderboard: data });
}
