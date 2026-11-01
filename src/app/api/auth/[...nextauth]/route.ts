import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";

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
        return {
          id: profile.id || profile.sub || profile.slack_id,
          name: profile.name || profile.slack_handle || "Hack Clubber",
          email: profile.email,
          image: profile.avatar_url || profile.picture || "https://assets.hackclub.com/icon-rounded.png",
          slack_id: profile.slack_id,
          verification_status: profile.verification_status,
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, user, profile }) {
      if (user) {
        token.id = user.id;
        token.slack_id = (user as any).slack_id;
        token.verification_status = (user as any).verification_status;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).slack_id = token.slack_id;
        (session.user as any).verification_status = token.verification_status;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "fortune_ysws_super_secret_hackclub_key_2026_priyanshu",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

