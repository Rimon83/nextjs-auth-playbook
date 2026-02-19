"use server";

import { getDeviceInfo } from "@/lib/getDeviceInfo";
import { getResetPasswordToken } from "@/lib/getResetPasswordToken";
import prisma from "@/lib/prisma";
import { sendPasswordResetConfirmation } from "@/lib/sendingEmail";
import bcrypt from "bcryptjs";

type ResetPasswordResult = { success: string } | { error: string };
export async function resetPassword(
  password: string,
  token: string,
): Promise<ResetPasswordResult> {
  try {
    //Get verification token from database by token
    const verificationToken = await getResetPasswordToken(token);
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

    if (!user) {
      return { error: "User not found" };
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    // Update user's password field
    await prisma.user.update({
      where: { email: verificationToken.email },
      data: { password: hashedPassword },
    });
    // Delete the used token
    await prisma.verificationToken.delete({
      where: { token },
    });

    const { browser, os } = await getDeviceInfo();
    // Send welcome email
    if (user) {
      await sendPasswordResetConfirmation(
        user.email,
        user?.name || "",
        browser,
        os,
      );
    }

    return { success: "Password is updated successfully" };
  } catch (error) {
    return { error: "Failed to update the password" };
  }
}

export async function ProtectResetPassword(token: string) {
  //Get verification token from database by token
  const verificationToken = await getResetPasswordToken(token);
  if (!verificationToken) {
    return { error: "This verification link is no longer valid." };
  }
}