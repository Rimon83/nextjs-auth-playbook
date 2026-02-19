import NextAuth, { DefaultSession } from "next-auth";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";

declare module "next-auth" {
  interface User {
    image?: string | null;
    role?: string | null;
    emailVerified?: Date | null;
  }

  interface Session {
    user: User & DefaultSession["user"];
    provider?: string;
  
  }
  
}


   

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,

  callbacks: {
    async jwt({ token, user, account, trigger, profile }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.image = user.image;
        token.role = user?.role;
        token.provider = account?.provider;
      }

      // Handle session updates (when user updates profile)
      if (trigger === "update") {
        // Fetch latest user data from database
        const updatedUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            name: true,
            image: true,
            role: true,
          },
        });

        if (updatedUser) {
          token.name = updatedUser.name;
          token.image = updatedUser.image;
          token.role = updatedUser.role;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.image = token.image as string;
        session.user.role = token.role as string;
      }

      // Provider info for API calls
      session.provider = token.provider as string;

      return session;
    },
    // Not allow user to signin if the the email is not verified
    async signIn({ user, account}) {
      if (!user || (account?.provider === "credentials" && !user.emailVerified)) {
        return false;
      }
      return true;
    },
  },
  events: {
    // If OAuth provider, update the emailVerified in DB with date value because we don't need to verify email for OAuth users
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    signOut: "/auth/signout",
  },
});
