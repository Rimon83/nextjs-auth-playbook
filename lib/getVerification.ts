import prisma from "./prisma";

// Get verification by email
export async function getVerificationByEmail(email: string) {
 try {
  const verificationToken = await prisma.verificationToken.findFirst({
    where: { email },
  });
  return verificationToken;
  
 } catch (error) {
  return null
 }
   
}
// Get verification by token
export async function getVerificationByToken(token: string) {
 try {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });
  return verificationToken;
  
 } catch (error) {
  return null
  
 }
   
}