import { betterAuth } from "better-auth"
import { db } from "./db"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { user, session, account, verification } from "./db/schema"

export const auth = betterAuth({
    database: drizzleAdapter(db, { 
      provider: "pg",
      schema: {
        user,
        session,
        account,
        verification,
      }
    }),
    trustedOrigins: ["https://sage-vibesync.vercel.app"],
    advanced: {
      crossSubdomainCookies: {
        enabled: false,
      },
      defaultCookieAttributes: {
        secure: true,
        sameSite: "none",
      }
    },
    socialProviders: {
        spotify: { 
            clientId: process.env.SPOTIFY_CLIENT_ID as string, 
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string, 
        }, 
    },
})