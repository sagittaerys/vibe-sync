import { betterAuth } from "better-auth"
import { db } from "./db"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

export const auth = betterAuth({
    database:  drizzleAdapter(db, { 
    provider: "pg",
  }),

    socialProviders: {
        spotify: { 
            clientId: process.env.SPOTIFY_CLIENT_ID as string, 
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string, 
        }, 
    },
})