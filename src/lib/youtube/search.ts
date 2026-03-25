export type YouTubeCandidate = {
  id: string;
  title: string;
};

export async function searchYouTube(
  trackName: string,
  artist: string
): Promise<YouTubeCandidate[]> {
  const query = `${artist} ${trackName} official audio`;

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("q", query);
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", "5");
  url.searchParams.set("key", process.env.YOUTUBE_API_KEY!);

  try {
    const res = await fetch(url.toString());

    if (!res.ok) {
      throw new Error(`YouTube API error: ${res.status}`);
    }

    const data = await res.json();

    if (!data.items) return [];

    const candidates: YouTubeCandidate[] = data.items
      .map((item: any) => {
        const videoId = item?.id?.videoId;
        const title = item?.snippet?.title;

        if (!videoId || !title) return null;

        return {
          id: videoId,
          title,
        };
      })
      .filter(Boolean);

    return candidates;
  } catch (error) {
    console.error("YouTube search failed:", error);
    return [];
  }
}