"use server";

import { generateVerificationToken } from "@/lib/generateVerification";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/sendingEmail";
import { validateEmail, validatePassword } from "@/lib/validation";
import bcrypt from "bcryptjs";

type SignupResult = { success: string } | { error: string };

const signup = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<SignupResult> => {
  const { email, password, name } = data;
  const lowercaseEmail = email.toLowerCase();

  // Validation
  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  if (!validateEmail(email).isValid) {
    return { error: validateEmail(email).error ?? "Invalid email" };
  }

  if (!validatePassword(password).isValid) {
    return { error: validatePassword(password).error ?? "Invalid password" };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: lowercaseEmail },
  });

  if (existingUser) {
    return { error: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email: lowercaseEmail,
      password: hashedPassword,
    },
  });
  // Generate verification token
  const verificationToken = await generateVerificationToken(lowercaseEmail);
  // Sending verification email
  await sendVerificationEmail(verificationToken.email, verificationToken.token)


  return {
    success: "Please check your email to verify.",
  };
};

export default signup;
