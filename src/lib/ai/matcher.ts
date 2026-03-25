import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export type SpotifyTrack = {
  name: string;
  artist: string;
};

export type Candidate = {
  id: string;
  title: string;
};

export type MatchResult = {
  matchId: string | null;
  isConfident: boolean;
  stage: "exact" | "fuzzy" | "ai" | "not_found";
};

// exact match function
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/\[.*?\]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function exactMatch(
  track: SpotifyTrack,
  candidates: Candidate[],
): MatchResult | null {
  const normalizedTrack = normalize(track.name + " " + track.artist);

  for (const candidate of candidates) {
    const normalizedCandidate = normalize(candidate.title);
    if (normalizedCandidate.includes(normalizedTrack)) {
      return { matchId: candidate.id, isConfident: true, stage: "exact" };
    }
  }
  return null;
}

// stage 2 — fuzzy match using Levenshtein distance
function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] =
        b[i - 1] === a[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1,
            );
    }
  }
  return matrix[b.length][a.length];
}

function similarityScore(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

function fuzzyMatch(
  track: SpotifyTrack,
  candidates: Candidate[],
): MatchResult | null {
  const query = normalize(track.name + " " + track.artist);
  let bestScore = 0;
  let bestCandidate: Candidate | null = null;

  for (const candidate of candidates) {
    const score = similarityScore(query, normalize(candidate.title));
    if (score > bestScore) {
      bestScore = score;
      bestCandidate = candidate;
    }
  }

  // 0.6 threshold — confident enough to accept without AI
  if (bestScore >= 0.6 && bestCandidate) {
    return {
      matchId: bestCandidate.id,
      isConfident: bestScore >= 0.8,
      stage: "fuzzy",
    };
  }

  return null;
}

// stage 3 — AI-powered match using Claude -- this  where ai comes in after previous stages fail.
async function aiMatch(
  track: SpotifyTrack,
  candidates: Candidate[],
): Promise<MatchResult> {
  const prompt = `You are a strict music matching system.

Spotify Track:
- Name: "${track.name}"
- Artist: "${track.artist}"

Candidates:
${candidates.map((c, i) => `${i + 1}. [${c.id}] ${c.title}`).join("\n")}

Rules:
- Match must be the same song and artist
- Ignore remixes, covers, live versions unless original is unavailable
- Prefer official versions over unofficial uploads
- Avoid "10 hour loops", "8D audio", reaction videos, or covers
- If none match confidently, return null

Respond with STRICT JSON ONLY — no explanation:
{"matchId": "id_here", "isConfident": true}
OR
{"matchId": null, "isConfident": false}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 100,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      matchId: parsed.matchId,
      isConfident: parsed.isConfident,
      stage: "ai",
    };
  } catch (error) {
    console.error("Claude verification failed:", error);
    return { matchId: null, isConfident: false, stage: "not_found" };
  }
}

// main function to match a track against candidates using all stages
export async function matchTrack(
  track: SpotifyTrack,
  candidates: Candidate[],
): Promise<MatchResult> {
  if (candidates.length === 0) {
    return { matchId: null, isConfident: false, stage: "not_found" };
  }

  // 1
  const exact = exactMatch(track, candidates);
  if (exact) return exact;

  // 2
  const fuzzy = fuzzyMatch(track, candidates);
  if (fuzzy) return fuzzy;

  // 3 -- this costs money, so I want it called if the first two stages fail to find a confident match.
  return aiMatch(track, candidates);
}
