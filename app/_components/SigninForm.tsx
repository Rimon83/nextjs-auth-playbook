import React, { useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";

interface SigninFormProps {
  formData: { email: string; password: string };
  setFormData: React.Dispatch<
    React.SetStateAction<{ email: string; password: string }>
  >;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

const SigninForm = ({
  formData,
  setFormData,
  isLoading,
  setIsLoading,
}: SigninFormProps) => {
 const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
 
 
 
     try {
       const signInResult = await signIn("credentials", {
         email: formData.email,
         password: formData.password,
         redirect: false,
       });
       if (signInResult?.error) {
         setIsLoading(false);
         return;
       }
       // redirect to dashboard on successful sign in
       redirect("/dashboard");
 
     } catch (error) {
       // setErrors({ email: "", password: "Invalid email or password" });
     } finally {
       setIsLoading(false);
     }
   };
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4" style={{ animationDelay: "50ms" }}>
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={isLoading}
        />

        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          // onClick={() => setShowResetModal(true)}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Forgot password?
        </button>
      </div>

      <Button type="submit" isLoading={isLoading}>
        Sign In
      </Button>
    </form>
  );
};

export default SigninForm;
