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
    trustedOrigins: ["https://sage-vibesync.vercel.app", "http://127.0.0.1:3000"],
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
            scope: ["user-read-email", "playlist-read-private", "playlist-read-collaborative","user-library-read"],
                  }, 
         google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
            scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/youtube", 
        "https://www.googleapis.com/auth/youtube.force-ssl" 
    ],
        }, 
    },
})