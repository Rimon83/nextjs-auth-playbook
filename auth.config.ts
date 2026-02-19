import GitHub from "next-auth/providers/github";
import { AuthError, type NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";
import prisma from "./lib/prisma";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { generateVerificationToken } from "./lib/generateVerification";
import { sendVerificationEmail } from "./lib/sendingEmail";

export default {
  providers: [
    Google,
    GitHub,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { accounts: true },
        });
        if (!user) {
          return null;
        }

        // User registered with OAuth but tries credentials
        const hasOAuthAccount = user.accounts.some(
          (account) => account.provider !== "credentials",
        );

        if (hasOAuthAccount && !user.password) {
          throw new Error("OAuthAccountNotLinked");
        }

        if (!user.password) {
          return null;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!isValidPassword) {
          return null;
        }

        // Check email verification (optional based on your requirements)
        if (!user.emailVerified) {
          // Regenerate email verification token
          const verificationToken = await generateVerificationToken(user.email);
           // Sending verification email
            await sendVerificationEmail(verificationToken.email, verificationToken.token)
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
