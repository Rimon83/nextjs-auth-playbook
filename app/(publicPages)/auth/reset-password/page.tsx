"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/app/_components/Input";
import { Button } from "@/app/_components/Button";

import { redirect, useRouter, useSearchParams } from "next/navigation";
import {
  matchedPassword,
  validateEmail,
  validatePassword,
  ValidationResult,
} from "@/lib/validation";
import FormError from "@/app/_components/FormError";
import { resetPasswordEmail } from "@/actions/resetPasswordemail";
import FormSuccess from "@/app/_components/FormSuccess";
import { PasswordStrengthIndicator } from "@/app/_components/PasswordStrengthIndicator";
import Link from "next/link";
import { ProtectResetPassword, resetPassword } from "@/actions/resetPassword";

export default function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [isButtonDisabled, setIsButtonDisabled] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const validateField = (
    field: string,
    value: string,
    data: typeof formData,
  ): ValidationResult => {
    switch (field) {
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
    setErrors({
      ...errors,
      [field]: validateField(field, formData[field], formData).error || "",
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
        matchedPassword(value, updatedFormData.confirmPassword).error || "";
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

  // Handle send reset password link to user
  const handleResetPasswordEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await resetPasswordEmail(formData.email).then((result) => {
        if ("error" in result) {
          setError(result.error);
        }
        if ("success" in result) {
          setSuccess(result?.success);
        }
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (!token) {
        setError("Token is missing");
        return;
      }
      await resetPassword(formData.password, token).then((result) => {
        if ("error" in result) {
          setError(result.error);
        }
        if ("success" in result) {
          setTimeout(() => {
             setSuccess(result?.success);
             setFormData({
               email: "",
               password: "",
               confirmPassword: "",
             });
             setIsButtonDisabled((prev) => ({...prev, password: false, confirmPassword: false}))

          },3000)
         router.push("/auth/signin")
          
        }
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  const onSubmit = useCallback(async () => {
    if (!token) {
      setPageLoading(false);
      return;
    }

    setPageLoading(true);

    try {
      const result = await ProtectResetPassword(token);

      if (result?.error) {
        router.replace("/auth/signin");
        return;
      } else {
        setPageLoading(false);
      }
    } catch (error) {
      console.error(error);
      router.replace("/auth/signin");
    }
  }, [token, router]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <>
      {pageLoading && (
        <div className="w-full min-h-screen flex justify-center items-center">
          Loading ....
        </div>
      )}
      {token && !pageLoading && (
        <>
          <FormError message={error} />
          <FormSuccess message={success} />
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="font-display text-3xl font-light text-foreground tracking-tight">
                Reset Your Password
              </h1>
              <p className="text-muted-foreground text-sm">
                Enter your new password below
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="space-y-4" style={{ animationDelay: "50ms" }}>
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
                  !isButtonDisabled.password ||
                  !isButtonDisabled.confirmPassword
                }
              >
                Reset Password
              </Button>
            </form>
          </div>
          <div className="my-8 p-4 border-t border-gray-200">
            <Link
              href="/auth/signin"
              className="block text-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        </>
      )}
      {!token && (
        <>
          <FormError message={error} />
          <FormSuccess message={success} />
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="font-display text-3xl font-light text-foreground tracking-tight">
                Forget your password?
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email to receive a password reset link.
              </p>
            </div>

            <form onSubmit={handleResetPasswordEmail} className="space-y-5">
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
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                disabled={
                  success.includes("successfully") || !isButtonDisabled.email
                }
              >
                Send Reset Link
              </Button>
            </form>
          </div>
          <div className="my-8 p-4 border-t border-gray-200">
            <Link
              href="/auth/signin"
              className="block text-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        </>
      )}
    </>
  );
}
