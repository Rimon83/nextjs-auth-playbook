"use server"
import { getVerificationByToken } from "@/lib/getVerification";
import prisma from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/sendingEmail";


type VerifyEmailResult = { success: string } | { error: string };
export async function verifyEmail(token: string): Promise<VerifyEmailResult> {
 try {
  //Get verification token from database by token
  const verificationToken = await getVerificationByToken(token);
  if (!verificationToken) {
    return { error: "This verification link is no longer valid." };
  }
  // Check if token is expired
  if (verificationToken.expires < new Date()) {
    return { error: "Token expired" };
  }
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email: verificationToken.email },
  });

  // Check if the email is verified
  if (user?.emailVerified) {
   return { success: "Email is already verified" };
  }

  if (!user) {
    return { error: "User not found" };
  }
  // Update user's emailVerified field
  await prisma.user.update({
    where: { email: verificationToken.email },
    data: { email: verificationToken.email, emailVerified: new Date() },
  });
  // Delete the used token
  await prisma.verificationToken.delete({
    where: { token },
  });

  // Send welcome email
  if (user) {
    await sendWelcomeEmail(user.email, user.name || undefined);
  }

  return { success: "Email verified successfully" };
 } catch (error) {
  return { error: "Failed to verify email" };
 }
}

export async function protectRoute(token: string) {
  //Get verification token from database by token
  const verificationToken = await getVerificationByToken(token);
  if (!verificationToken) {
    return { error: "This verification link is no longer valid." };
  }
}