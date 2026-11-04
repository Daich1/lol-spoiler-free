export interface Video {
  videoId: string;
  title: string;
  publishedAt: string;
  thumbnailUrl: string;
  gameNumber: number;
}

export interface Series {
  id: string;
  team1: string;
  team2: string;
  tournament: string;
  bestOf: number;
  games: (Video | null)[];
  latestPublishedAt: string;
}
