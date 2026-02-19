"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/app/_components/Input";
import { Button } from "@/app/_components/Button";
import { SocialButtons } from "@/app/_components/SocialButtons";
import { GithubIcon, GoogleIcon } from "@/app/dataConstants/SocialIcons";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { signin } from "@/actions/signin";
import {
  validateEmail,
  validatePassword,
  ValidationResult,
  validateSignInPassword
} from "@/lib/validation";
import FormError from "@/app/_components/FormError";

export default function SignInForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const oathError = searchParams.get("error");
  useEffect(() => {
    if (oathError === "OAuthAccountNotLinked") {
      setServerError(
        "An account with the same email already exists. Please sign in with different email",
      );
    }else{
      setServerError("")
    }
  },[searchParams])
  

  const [isButtonDisabled, setIsButtonDisabled] = useState({
    email: false,
    password: false,
  });

  const handleSignupClick = () => {
    window.location.href = "/auth/signup";
  };
  const validateField = (field: string, value: string): ValidationResult => {
    switch (field) {
      case "email":
        return validateEmail(value);
      case "password":
        return validateSignInPassword(value); 
      default:
        return { error: "", isValid: false };
    }
  };

  const handleBlur = (field: keyof typeof formData) => {
    setErrors({
      ...errors,
      [field]: validateField(field, formData[field]).error,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServerError("")
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value).error });

    setIsButtonDisabled({
      ...isButtonDisabled,
      [name]: validateField(name, value).isValid,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("")
    setIsLoading(true);

    try {
      const signInResult = await signin(formData);
      if ("error" in signInResult) {
        setServerError(signInResult.error);
        return
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  const handleForgotPasswordClick = () => {
    router.push("/auth/reset-password");
  }

  return (
    <>
      <FormError message={serverError} />
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl font-light text-foreground tracking-tight">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-sm">
            Sign in to continue to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4" style={{ animationDelay: "50ms" }}>
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
              error={errors.email}
              disabled={isLoading}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              maxLength={32}
              onBlur={() => handleBlur("password")}
              error={errors.password}
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleForgotPasswordClick}
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <Button
            disabled={!isButtonDisabled.email || !isButtonDisabled.password}
            type="submit"
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-4 text-muted-foreground font-medium">
              Or continue with
            </span>
          </div>
        </div>

        <SocialButtons
          provider="google"
          isLoading={isLoading}
          icon={<GoogleIcon />}
        />
        <SocialButtons
          provider="github"
          isLoading={isLoading}
          icon={<GithubIcon />}
        />

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={handleSignupClick}
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

      
    </>
  );
}
