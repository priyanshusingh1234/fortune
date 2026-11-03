import type { NextAuthOptions } from "next-auth";

// Automatically sanitize NEXTAUTH_URL to remove any accidental trailing slashes entered in Vercel
if (process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL.trim().replace(/\/+$/, "");
} else if (process.env.VERCEL_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`.replace(/\/+$/, "");
}

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "hackclub",
      name: "Hack Club",
      type: "oauth",
      wellKnown: "https://auth.hackclub.com/.well-known/openid-configuration",
      authorization: {
        url: "https://auth.hackclub.com/oauth/authorize",
        params: {
          scope: "openid email name profile slack_id verification_status",
        },
      },
      token: "https://auth.hackclub.com/oauth/token",
      userinfo: "https://auth.hackclub.com/api/v1/user",
      clientId: process.env.HACKCLUB_CLIENT_ID || "6eaf67a0ebf1921c10b685be094873c8",
      clientSecret: process.env.HACKCLUB_CLIENT_SECRET || "e73c506700cc1d7a88d69997cc8cdfabcf81991747c282513567d65c307b314a",
      profile(profile) {
        const slackId = profile.slack_id || profile.sub || profile.id || "";
        return {
          id: slackId || profile.id || profile.sub,
          name: profile.name || profile.slack_handle || "Hack Clubber",
          email: profile.email,
          image: profile.avatar_url || profile.picture || "https://assets.hackclub.com/icon-rounded.png",
          slack_id: slackId,
          verification_status: profile.verification_status,
        };
      },
    },
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      const targetBase = (process.env.NEXTAUTH_URL || baseUrl || "").replace(/\/+$/, "");
      if (url.startsWith("/")) {
        return `${targetBase}${url}`;
      }
      try {
        const parsedUrl = new URL(url);
        const parsedBase = new URL(targetBase);
        if (parsedUrl.origin === parsedBase.origin) {
          return url;
        }
      } catch {}
      return targetBase;
    },
    async jwt({ token, user, profile }) {
      if (user) {
        token.id = user.id;
        token.slack_id = (user as any).slack_id || (profile as any)?.slack_id;
        token.verification_status = (user as any).verification_status;
      }
      if (profile && (profile as any).slack_id) {
        token.slack_id = (profile as any).slack_id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id || token.sub;
        (session.user as any).slack_id = token.slack_id || token.id;
        (session.user as any).verification_status = token.verification_status;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "fortune_ysws_super_secret_hackclub_key_2026_priyanshu",
  useSecureCookies: process.env.NODE_ENV === "production",
};
