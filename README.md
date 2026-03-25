# VibeSync 🎵

[cite_start]VibeSync is a cross-platform music transfer bridge that allows users to seamlessly move their playlists and library between streaming services[cite: 1, 1097]. 

[cite_start]While traditional music transfer apps rely on basic search queries that often result in incorrect tracks (like "10-hour loops", live covers, or karaoke versions), VibeSync ensures high-fidelity transfers using a custom, multi-stage AI matching engine[cite: 8, 9, 1221].

## 🚀 The Core Innovation: Layered Matching System

[cite_start]The hardest part of transferring music isn't moving the data; it's finding the exact right track on the destination platform[cite: 7, 8]. [cite_start]VibeSync solves this using a 3-stage pipeline optimized for both accuracy and cost-efficiency[cite: 1194]:

1. [cite_start]**Exact Match (Stage 1):** Instantly catches ~80% of tracks by normalizing strings (removing brackets, special characters, and lowercase conversions) and running direct comparisons[cite: 1194, 1202].
2. [cite_start]**Fuzzy Match (Stage 2):** Uses a Levenshtein distance algorithm to calculate similarity scores, catching typos, slight spelling variations, and reordered words without needing an API call[cite: 1195, 1208].
3. [cite_start]**AI Verification (Stage 3):** For the hardest 5-10% of tracks, the app passes candidates to **Anthropic's Claude 3 Haiku**[cite: 1187, 1196, 1197]. [cite_start]Claude acts as a strict music librarian, analyzing the metadata to pick the official audio or suggest vibe-based alternatives if the song is entirely missing[cite: 13, 1169, 1220].

## 🛠 Tech Stack

VibeSync is built on a modern, serverless JavaScript stack:

* [cite_start]**Framework:** Next.js 14 (App Router) [cite: 473]
* [cite_start]**Database:** Neon (Serverless PostgreSQL) [cite: 48, 102]
* [cite_start]**ORM:** Drizzle ORM [cite: 102, 103]
* [cite_start]**Authentication:** Better Auth (handling Spotify OAuth and secure sessions) [cite: 490, 560]
* [cite_start]**State Management:** Zustand (for global playlist multi-selection) [cite: 850, 854]
* [cite_start]**Styling & UI:** Tailwind CSS, shadcn/ui (Dialogs), and React Icons [cite: 528, 983, 984]
* [cite_start]**AI Integration:** Anthropic SDK [cite: 1166]
* [cite_start]**APIs:** Spotify Web API, YouTube Data API v3 [cite: 1148, 1284]

## 🏗 System Architecture

[cite_start]The application is designed to handle large playlist transfers without timing out the browser[cite: 33]:
1. [cite_start]**OAuth Flow:** Users authenticate via Better Auth to securely grant playlist access[cite: 284].
2. [cite_start]**Dashboard:** Global state (`transferStore`) allows users to multi-select playlists and their "Liked Songs"[cite: 846, 888].
3. [cite_start]**Background Job Queue:** Upon confirmation, the app writes a `transfer_job` and individual `transfer_tracks` to the Neon database[cite: 107, 108, 1260]. 
4. [cite_start]**Processing:** The server-side engine executes the "Fetch → YouTube Search → Layered Match → Update DB" flow asynchronously[cite: 1291, 1292].

## 🚦 Getting Started

### Prerequisites
* [cite_start]Node.js & `pnpm` [cite: 157]
* [cite_start]Spotify Developer Account (Client ID & Secret) [cite: 316]
* [cite_start]Google Cloud Console (YouTube Data API v3 Key) [cite: 1148]
* [cite_start]Anthropic API Key [cite: 1148]
* [cite_start]Neon Database URL 

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   pnpm install

2. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL="your-neon-postgres-url"
   AUTH_SECRET="your-generated-32-char-secret"
   BETTER_AUTH_URL="[http://127.0.0.1:3000](http://127.0.0.1:3000)"
   SPOTIFY_CLIENT_ID="your-spotify-client-id"
   SPOTIFY_CLIENT_SECRET="your-spotify-client-secret"
   ANTHROPIC_API_KEY="your-anthropic-key"
   YOUTUBE_API_KEY="your-youtube-api-key"


 ### 3. Push the Database Schema
    Sync your Drizzle schema to your Neon database instance:
      ```bash
          pnpm db:push


### 4. Run the Development Server
      Start the local development server to begin testing the application:
      ```bash
          pnpm dev

Developed by Olamilekan Aremu