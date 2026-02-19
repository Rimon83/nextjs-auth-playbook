import prisma from "./prisma";

export async function getResetPasswordToken(token: string) {
 try {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });
  return verificationToken;
  
 } catch (error) {
  return null
  
 }
   
}