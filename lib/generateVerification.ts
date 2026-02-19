import prisma from "./prisma";

// Generate a verification token
export async function generateVerificationToken(email: string) {
  const token = crypto.randomUUID();
  // const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // Expires in 24 hours

  // const expires = new Date(Date.now() + 60 * 60 * 1000); // Expires in 1 hour

  const expires = new Date(Date.now() + 2 * 60 * 1000); // Expires in 2 minutes
  // Check if a token already exists for the email
  const existingToken = await prisma.verificationToken.findFirst({
    where: { email },
  });
  if (existingToken) {
    await prisma.verificationToken.delete({
      where: { id : existingToken.id },
    });
  }
  return await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
}