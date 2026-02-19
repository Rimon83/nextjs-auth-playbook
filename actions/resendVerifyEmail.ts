"use server"

import { generateVerificationToken } from "@/lib/generateVerification";
import { sendVerificationEmail } from "@/lib/sendingEmail";
import prisma from "@/lib/prisma"; 
import { getVerificationByToken } from "@/lib/getVerification";
type ResendEmailResult = { success: string } | { error: string };
export async function resendVerificationEmail(token: string): Promise<ResendEmailResult> {
 try{
  const expiredVerification = await getVerificationByToken(token);
  if (!expiredVerification) {
    return { error: "Invalid token" };
  }
  const user = await prisma.user.findUnique({
    where: { email: expiredVerification.email },
  });
  if (!user){
   return {error: "User not found"};
  }
  if (user.emailVerified) {
   return { success: "Email is already verified" };
  }
  // Generate new token
  const newVerificationToken = await generateVerificationToken(user.email);
  // Send verification email
  await sendVerificationEmail(newVerificationToken.email, newVerificationToken.token);
  return { success: "Verification email resent. Please check your inbox." };
 }
 catch(error){
  return { error: "Failed to resend verification email" };

 }
}