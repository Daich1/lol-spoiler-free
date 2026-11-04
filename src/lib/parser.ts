import { RawVideo } from "./youtube";
import { Series, Video } from "@/types";

interface ParsedVideo {
  raw: RawVideo;
  team1: string;
  team2: string;
  gameNumber: number;
  tournament: string;
}

const BO5_KEYWORDS = [
  "決勝",
  "Final",
  "Finals",
  "Grand Final",
  "準決勝",
  "Semi",
  "Semifinal",
  "準々決勝",
  "Quarter",
  "Quarterfinal",
  "Playoff",
  "プレイオフ",
  "ノックアウト",
  "Knockout",
  "Bracket",
];

export function parseVideoTitle(raw: RawVideo): ParsedVideo | null {
  // パターン: ...｜Team1 vs Team2 N試合目 Tournament【...】
  // or: ...| Team1 vs Team2 N試合目 Tournament【...】
  const matchPattern =
    /[｜|]\s*([A-Za-z0-9\s]+?)\s*vs\.?\s*([A-Za-z0-9\s]+?)\s+(\d+)\s*試合目\s+(.+?)(?:【|$)/;
  const match = raw.title.match(matchPattern);

  if (!match) return null;

  const team1 = match[1].trim().toUpperCase();
  const team2 = match[2].trim().toUpperCase();
  const gameNumber = parseInt(match[3], 10);
  const tournament = match[4].trim();

  return { raw, team1, team2, gameNumber, tournament };
}

function determineBestOf(tournament: string, maxGameNumber: number): number {
  // Bo5キーワードチェック
  for (const keyword of BO5_KEYWORDS) {
    if (tournament.toLowerCase().includes(keyword.toLowerCase())) {
      return 5;
    }
  }
  // 4試合目以上があればBo5
  if (maxGameNumber >= 4) return 5;
  // デフォルトBo3
  return 3;
}

export function groupIntoSeries(rawVideos: RawVideo[]): Series[] {
  const parsed: ParsedVideo[] = [];

  for (const raw of rawVideos) {
    const result = parseVideoTitle(raw);
    if (result) parsed.push(result);
  }

  // シリーズキーでグループ化
  const groups = new Map<string, ParsedVideo[]>();

  for (const p of parsed) {
    // チーム名をソートしてキーを統一（A vs B と B vs A を同じにする）
    const teams = [p.team1, p.team2].sort();
    const key = `${teams[0]} vs ${teams[1]}|||${p.tournament}`;
    const existing = groups.get(key) ?? [];
    existing.push(p);
    groups.set(key, existing);
  }

  const seriesList: Series[] = [];

  for (const [key, videos] of groups) {
    const maxGameNumber = Math.max(...videos.map((v) => v.gameNumber));
    const first = videos[0];
    const tournament = first.tournament;
    const bestOf = determineBestOf(tournament, maxGameNumber);

    // ゲームスロットを作成
    const games: (Video | null)[] = Array(bestOf).fill(null);

    for (const v of videos) {
      if (v.gameNumber >= 1 && v.gameNumber <= bestOf) {
        games[v.gameNumber - 1] = {
          videoId: v.raw.videoId,
          title: v.raw.title,
          publishedAt: v.raw.publishedAt,
          thumbnailUrl: v.raw.thumbnailUrl,
          gameNumber: v.gameNumber,
        };
      }
    }

    // 最新投稿日
    const latestPublishedAt = videos
      .map((v) => v.raw.publishedAt)
      .sort()
      .reverse()[0];

    seriesList.push({
      id: key,
      team1: first.team1,
      team2: first.team2,
      tournament,
      bestOf,
      games,
      latestPublishedAt,
    });
  }

  // 最新順にソート
  seriesList.sort(
    (a, b) =>
      new Date(b.latestPublishedAt).getTime() -
      new Date(a.latestPublishedAt).getTime()
  );

  return seriesList;
}
