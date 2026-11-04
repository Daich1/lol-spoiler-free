import { NextResponse } from "next/server";
import { fetchVideos } from "@/lib/youtube";
import { groupIntoSeries } from "@/lib/parser";

export async function GET() {
  try {
    const rawVideos = await fetchVideos(200);
    const series = groupIntoSeries(rawVideos);
    return NextResponse.json(
      { series },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return NextResponse.json(
      { error: "動画の取得に失敗しました" },
      { status: 500 }
    );
  }
}
