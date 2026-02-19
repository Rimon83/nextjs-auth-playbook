"use server";
import { signIn } from "@/auth";
import { validateEmail, validateSignInPassword } from "@/lib/validation";
import { AuthError } from "next-auth";

type SigninResult = {
  error: string;
} 
// signin function accepts data as params
export async function signin(data: { email: string; password: string }): Promise<SigninResult> {
  try {
    // Validate email format
    if (validateEmail(data.email).isValid === false) {
      return { error: validateEmail(data.email).error || "invalid email" }
      }
    

    // Validate password strength
    if (validateSignInPassword(data.password).isValid === false) {
      return{error: validateSignInPassword(data.password).error || "Invalid password"}
    }

     await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirectTo: "/dashboard",
    });
   
    return {"error":""};
  } catch (error) {

    if (error instanceof AuthError) {
      
      if (error?.cause?.err?.message === "OAuthAccountNotLinked") {
        return {
          error:
            "An account with the same email already exists. Please use a different sign‑in method.",
        };
      }


      switch (error?.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        case "AccessDenied":
          return {error: "Please verify your email before signing in, otherwise contact support."};
        default:
          return { error: "An unknown error occurred" };
      }
    }
    throw error;
  }
}
