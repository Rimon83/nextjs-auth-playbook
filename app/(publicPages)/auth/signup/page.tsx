"use client";

import { Button } from "@/app/_components/Button";
import { Input } from "@/app/_components/Input";
import { PasswordStrengthIndicator } from "@/app/_components/PasswordStrengthIndicator";
import { SocialButtons } from "@/app/_components/SocialButtons";
import { GithubIcon, GoogleIcon } from "@/app/dataConstants/SocialIcons";
import React, { useEffect, useState } from "react";
import {
  validateName,
  validateEmail,
  validatePassword,
  matchedPassword,
  ValidationResult,
} from "@/lib/validation";
import FormError from "@/app/_components/FormError";
import FormSuccess from "@/app/_components/FormSuccess";
import signup from "@/actions/signup";

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

 

 const validateField = (
  field: string,
  value: string,
  data: typeof formData
): ValidationResult => {
  switch (field) {
    case "name":
      return validateName(value);

    case "email":
      return validateEmail(value);

    case "password":
      return validatePassword(value);

    case "confirmPassword":
      return matchedPassword(data.password, value);

    default:
      return { error: "", isValid: false };
  }
};


  const handleBlur = (field: keyof typeof formData) => {
    // setTouchedFields({ ...touchedFields, [field]: true });
    setErrors({
      ...errors,
      [field]: validateField(field, formData[field], formData).error,
    });
  };

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setError("");
  setSuccess("");
  const { name, value } = e.target;

  const updatedFormData = {
    ...formData,
    [name]: value,
  };

  setFormData(updatedFormData);

  const fieldValidation = validateField(name, value, updatedFormData);

  const newErrors = {
    ...errors,
    [name]: fieldValidation.error,
  };

  // 🔥 Cross-field validation handled HERE
  if (name === "password" && updatedFormData.confirmPassword) {
    newErrors.confirmPassword =
      matchedPassword(
        value,
        updatedFormData.confirmPassword
      ).error || "";
  }

  if (name === "confirmPassword" && updatedFormData.password) {
    newErrors.password =
      validatePassword(updatedFormData.password).error || "";
  }

  setErrors(newErrors);

  setIsButtonDisabled({
    ...isButtonDisabled,
    [name]: fieldValidation.isValid,
  });
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const nameValidation = validateName(formData.name);
    const emailValidation = validateEmail(formData.email);
    const passwordValidation = validatePassword(formData.password);
    const passwordMatched = matchedPassword(
      formData.password,
      formData.confirmPassword,
    );

    if (
      !nameValidation.isValid ||
      !emailValidation.isValid ||
      !passwordValidation.isValid ||
      !passwordMatched.isValid
    ) {
      setErrors({
        name: nameValidation.error || "",
        email: emailValidation.error || "",
        password: passwordValidation.error || "",
        confirmPassword: passwordMatched.error || "",
      });
      return;
    }

    setErrors({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setIsLoading(true);
    try {
      // Create user via API
      // const response = await fetch("/api/auth/signup", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     name: formData.name,
      //     email: formData.email,
      //     password: formData.password,
      //   }),
      // });

      // const data = await response.json();

      // if (!response.ok) {
      //   setError(data.error);
      // } else {
      //   setSuccess(data.success);
      // }

      // Create user using action
      const result = await signup(formData);
      if ("error" in result) {
        setError(result.error);
        return
      } 
      setSuccess(result.success);

      // Clear the input fields
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setIsButtonDisabled({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
      });

      // // Auto sign-in after successful signup
      // const signInResult = await signIn("credentials", {
      //   email: formData.email,
      //   password: formData.password,
      //   redirect: false,
      // });

      // if (signInResult?.error) {
      //   // If auto sign-in fails, redirect to signin page
      //   router.push("/auth/signin?message=Please sign in with your new account");
      // } else {
      //   // Success - redirect to dashboard
      //   router.push("/dashboard");
      // }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <FormError message={error} />
      <FormSuccess message={success} />
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl font-light text-foreground tracking-tight">
            Create Account
          </h1>
          <p className="text-muted-foreground text-sm">
            Sign up to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4" style={{ animationDelay: "50ms" }}>
            <Input
              label="Full Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur("name")}
              error={errors.name}
              disabled={isLoading}
            />

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

            <div className="space-y-2">
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur("password")}
                error={errors.password}
                disabled={isLoading}
                maxLength={32}
              />
              <PasswordStrengthIndicator password={formData.password} />
            </div>
            <div className="space-y-2">
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={() => handleBlur("confirmPassword")}
                error={errors.confirmPassword}
                disabled={isLoading}
                maxLength={32}
              />
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            disabled={
              !isButtonDisabled.name ||
              !isButtonDisabled.email ||
              !isButtonDisabled.password ||
              !isButtonDisabled.confirmPassword
            }
          >
            Create Account
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
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => (window.location.href = "/auth/signin")}
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
