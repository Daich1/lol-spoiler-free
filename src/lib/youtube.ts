const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = "UCPLVTmdgB-ljT3S5xGBhBQA"; // @JapaneseKoreanUG

interface YouTubePlaylistItem {
  snippet: {
    title: string;
    publishedAt: string;
    resourceId: {
      videoId: string;
    };
    thumbnails: {
      medium?: { url: string };
      default?: { url: string };
    };
  };
}

interface YouTubePlaylistResponse {
  items: YouTubePlaylistItem[];
  nextPageToken?: string;
}

interface YouTubeChannelResponse {
  items: {
    contentDetails: {
      relatedPlaylists: {
        uploads: string;
      };
    };
  }[];
}

async function getUploadsPlaylistId(): Promise<string> {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
  );
  if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);
  const data: YouTubeChannelResponse = await res.json();
  return data.items[0].contentDetails.relatedPlaylists.uploads;
}

export interface RawVideo {
  videoId: string;
  title: string;
  publishedAt: string;
  thumbnailUrl: string;
}

export async function fetchVideos(maxResults = 100): Promise<RawVideo[]> {
  if (!YOUTUBE_API_KEY) {
    throw new Error("YOUTUBE_API_KEY is not set");
  }

  const playlistId = await getUploadsPlaylistId();
  const videos: RawVideo[] = [];
  let pageToken: string | undefined;

  while (videos.length < maxResults) {
    const url = new URL(
      "https://www.googleapis.com/youtube/v3/playlistItems"
    );
    url.searchParams.set("part", "snippet");
    url.searchParams.set("playlistId", playlistId);
    url.searchParams.set("maxResults", "50");
    url.searchParams.set("key", YOUTUBE_API_KEY);
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);
    const data: YouTubePlaylistResponse = await res.json();

    for (const item of data.items) {
      videos.push({
        videoId: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        publishedAt: item.snippet.publishedAt,
        thumbnailUrl:
          item.snippet.thumbnails.medium?.url ??
          item.snippet.thumbnails.default?.url ??
          "",
      });
    }

    if (!data.nextPageToken || videos.length >= maxResults) break;
    pageToken = data.nextPageToken;
  }

  return videos.slice(0, maxResults);
}
