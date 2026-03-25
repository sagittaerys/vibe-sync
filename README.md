# VibeSync 

VibeSync is a cross-platform music transfer bridge that allows users to seamlessly move their playlists and library between streaming services

While traditional music transfer apps rely on basic search queries that often result in incorrect tracks (like "10-hour loops", live covers, or karaoke versions), VibeSync ensures high-fidelity transfers using a custom, multi-stage AI matching engine.

##  The Core Innovation: Layered Matching System

The hardest part of transferring music isn't moving the data; it's finding the exact right track on the destination platform. VibeSync solves this using a 3-stage pipeline optimized for both accuracy and cost-efficiency:

1. **Exact Match (Stage 1):** Instantly catches ~80% of tracks by normalizing strings (removing brackets, special characters, and lowercase conversions) and running direct comparisons.

2. **Fuzzy Match (Stage 2):** Uses a Levenshtein distance algorithm to calculate similarity scores, catching typos, slight spelling variations, and reordered words without needing an API call.

3. **AI Verification (Stage 3):** For the hardest 5-10% of tracks, the app passes candidates to **Anthropic's Claude 3 Haiku**. Claude acts as a strict music librarian, analyzing the metadata to pick the official audio or suggest vibe-based alternatives if the song is entirely missing.


##  Tech Stack

VibeSync is built on a modern, serverless JavaScript stack:

* **Framework:** Next.js 14 (App Router) 
* **Database:** Neon (Serverless PostgreSQL) 
* **ORM:** Drizzle ORM 
* **Authentication:** Better Auth (handling Spotify OAuth and secure sessions) 
* **State Management:** Zustand (for global playlist multi-selection) 
* **Styling & UI:** Tailwind CSS, shadcn/ui (Dialogs), and React Icons 
* **AI Integration:** Anthropic SDK 
* **APIs:** Spotify Web API, YouTube Data API v3 

## System Architecture

The application is designed to handle large playlist transfers without timing out the browser:
1. **OAuth Flow:** Users authenticate via Better Auth to securely grant playlist access.
2. **Dashboard:** Global state (`transferStore`) allows users to multi-select playlists and their "Liked Songs".
3. **Background Job Queue:** Upon confirmation, the app writes a `transfer_job` and individual `transfer_tracks` to the Neon database. 
4. **Processing:** The server-side engine executes the "Fetch → YouTube Search → Layered Match → Update DB" flow asynchronously.

##  Getting Started

### Prerequisites
* Node.js & `pnpm` 
* Spotify Developer Account (Client ID & Secret) 
* Google Cloud Console (YouTube Data API v3 Key) 
* Anthropic API Key 
* Neon Database URL 

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