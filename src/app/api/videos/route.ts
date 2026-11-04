import { NextResponse } from "next/server";
import { fetchVideos } from "@/lib/youtube";
import { groupIntoSeries } from "@/lib/parser";
import { Series } from "@/types";

// サーバーサイドのインメモリキャッシュ
let cache: { series: Series[]; expiresAt: number } | null = null;
const CACHE_TTL = 10 * 60 * 1000; // 10分

export async function GET() {
  try {
    const now = Date.now();

    // キャッシュが有効ならAPIを叩かずに返す
    if (cache && now < cache.expiresAt) {
      return NextResponse.json(
        { series: cache.series },
        {
          headers: {
            "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
            "X-Cache": "HIT",
          },
        }
      );
    }

    // キャッシュ切れ or 初回 → YouTube APIを叩く
    const rawVideos = await fetchVideos(200);
    const series = groupIntoSeries(rawVideos);

    cache = { series, expiresAt: now + CACHE_TTL };

    return NextResponse.json(
      { series },
      {
        headers: {
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
          "X-Cache": "MISS",
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch videos:", error);

    // APIエラーでもキャッシュがあれば古いデータを返す
    if (cache) {
      return NextResponse.json(
        { series: cache.series },
        {
          headers: { "X-Cache": "STALE" },
        }
      );
    }

    return NextResponse.json(
      { error: "動画の取得に失敗しました" },
      { status: 500 }
    );
  }
}
