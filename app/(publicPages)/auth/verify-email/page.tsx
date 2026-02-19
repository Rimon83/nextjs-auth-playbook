"use client";
import { resendVerificationEmail } from "@/actions/resendVerifyEmail";
import { protectRoute, verifyEmail } from "@/actions/verifyEmail";
import { Button } from "@/app/_components/Button";
import FormError from "@/app/_components/FormError";
import FormSuccess from "@/app/_components/FormSuccess";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { MdVerifiedUser } from "react-icons/md";

const errors = [
  {
    message: "Invalid token",
    description:
      "The verification token is invalid. Please request a new verification email.",
  },
  {
    message: "Token expired",
    description:
      "The verification token has expired. Please request a new verification email.",
  },
  {
    message: "User not found",
    description:
      "No user found for this verification token. Please contact support.",
  },
];
export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [tokenExpired, setTokenExpired] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("verify email")
  const router = useRouter();
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    if (!token) {
      setIsLoading(false);
      return setError("No token provided");
    }
    setTokenExpired(token);
    try {
      await verifyEmail(token).then((result) => {
        if ("error" in result) {
          setError(result.error);
          setCurrentPage("resend email")
        }
        if ("success" in result) {
          setSuccess(result?.success);
        }
      });
    } catch (error) {
      console.log("Error verifying email:", error);
      setError("Failed to verify email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setIsLoading(true);
    
    try {
      await resendVerificationEmail(tokenExpired).then((result) => {
        if ("error" in result) {
          setError(result.error);
        }
        if ("success" in result) {
          setSuccess(result?.success);
          setError("")
        }
      });
    } catch (error) {
      setError("Failed to send verify email");
    } finally {
      setIsLoading(false);
    }
  };

  // Protect Verify email route if the token is already used
  const onSubmit = useCallback(async () => {
    if (!token) return;

    setPageLoading(true);

    try {
      const result = await protectRoute(token);

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
      console.log(currentPage);

  return (
    <>
      {pageLoading ? (
        <div className="w-full min-h-screen flex justify-center items-center">
          Loading ....
        </div>
      ) : (
        <div className=" flex flex-col items-center justify-center bg-gray-50 px-4 w-full">
          <FormError message={error} />
          <FormSuccess message={success} />
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              {/* Success Icon */}
              <div className="my-4 mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <MdVerifiedUser size={25} className="text-green-600" />
              </div>
            </div>
            {currentPage === "verify email" && (
              <div className="bg-white p-8 rounded-lg shadow w-full flex flex-col items-center space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Confirm Verification
                </h2>
                <div className="text-center space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm text-gray-500">
                      CLick the Button to verify your email address. 🎉
                    </h3>
                  </div>
                  <form onSubmit={handleVerifyEmail}>
                    <Button
                      variant="primary"
                      isLoading={isLoading}
                      type="submit"
                      disabled={
                        error.includes("longer valid") ||
                        success.includes("verified")
                      }
                    >
                      Verify Email
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
          {(currentPage === "resend email" && error ) && (
            <div className="mt-4 text-center">
              {errors && (
                <p className="text-sm text-gray-600">
                  {errors.find((e) => e.message === error)?.description}
                </p>
              )}

              <form onSubmit={handleResendEmail} className="mt-8">
                <Button type="submit" variant="primary" isLoading={isLoading}>
                  Resend Verification Email
                </Button>
              </form>
            </div>
          )}
          {/* {error && error.includes("longer valid") && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Verification link is no longer valid. Or Email is already verified.
          </p>
        </div>
      )} */}

          {success.includes("resent") && (
            <div className="mt-4 text-center">
              <p className="text-sm text-green-600">
                The email verification is sent successfully. Please check your
                inbox and click the link to verify your email address.
              </p>
            </div>
          )}
          <div className="my-8 p-4 border-t border-gray-200">
            <Link
              href="/auth/signin"
              className="block text-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
