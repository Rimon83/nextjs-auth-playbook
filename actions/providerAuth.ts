"use server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

// Provider authentication actions
export default async function providerAuth(provider: string) {
  try {
     await signIn(provider, { redirectTo: "/dashboard" });
  } catch (error) {
     if (error instanceof AuthError) {
          console.log({"OAuth Error ": error.type})

        }
     
    
    throw error;
  }
}
