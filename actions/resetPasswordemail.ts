"use server"

import { generateVerificationToken } from "@/lib/generateVerification";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/sendingEmail";
import { validateEmail } from "@/lib/validation";

type ResetPasswordEmailResult = { success: string } | { error: string };

export async function resetPasswordEmail(email: string): Promise<ResetPasswordEmailResult> {
  try {
    // Validate email format
    if (validateEmail(email).isValid === false) {
      return { error: validateEmail(email).error || "invalid email" }
    }
    // Check if user with the email exists
    const userExists = await prisma.user.findUnique({
      where: { email },
    });
    if (!userExists) {
      return { error: "User with this email does not exist" };
    }
    // Check if user exist and password is not null (not social login)
    if (userExists && userExists.password === null) {
      return { error: "This email is associated with a social login. Please use the appropriate sign-in method." };
    }
    // Generate password reset token and send email
    const {token} = await generateVerificationToken(email)
    await sendPasswordResetEmail(email, token);
    return { success: "Password reset email sent successfully" };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { error: "Failed to send password reset email" };
  }
}