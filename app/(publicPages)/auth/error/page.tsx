"use client"
import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle, XCircle, Home, LogIn } from "lucide-react";

// Define error types for better type safety
type AuthErrorType =
  | "Configuration"
  | "AccessDenied"
  | "Verification"
  | "OAuthSignin"
  | "OAuthCallback"
  | "OAuthCreateAccount"
  | "EmailCreateAccount"
  | "Callback"
  | "OAuthAccountNotLinked"
  | "EmailSignin"
  | "CredentialsSignin"
  | "SessionRequired"
  | "Default";

interface ErrorConfig {
  title: string;
  message: string;
  icon: React.ReactNode;
  color: string;
  autoRedirect?: boolean;
  redirectPath?: string;
  redirectDelay?: number;
}
// {
//   searchParams,
// }: {
//   searchParams?: Promise<{
//     error?: AuthErrorType | string;
//     callbackUrl?: string;
//     message?: string;
//   }>;
// }

export default  function AuthErrorPage() {
  const router = useRouter();
  const params = useSearchParams();
  const error = params?.get("error");
  const callbackUrl = params?.get("callbackUrl") || "/";
  const customMessage = params?.get("message");

  const updateError = error ? error.charAt(0).toLocaleUpperCase() + error.slice(1) : "Default";

  // Error configurations
  const errorConfigs: Record<AuthErrorType, ErrorConfig> = {
    Configuration: {
      title: "Configuration Error",
      message:
        "There is a problem with the server configuration. Please contact support.",
      icon: <AlertCircle className="h-12 w-12" />,
      color: "text-red-500",
    },
    AccessDenied: {
      title: "Access Denied",
      message: "You do not have permission to sign in.",
      icon: <XCircle className="h-12 w-12" />,
      color: "text-yellow-500",
    },
    Verification: {
      title: "Verification Failed",
      message:
        "The verification link is invalid or has expired. Please try signing in again.",
      icon: <AlertCircle className="h-12 w-12" />,
      color: "text-yellow-500",
      autoRedirect: true,
      redirectPath: "/auth/signin",
      redirectDelay: 5000,
    },
    CredentialsSignin: {
      title: "Sign In Failed",
      message:
        "Invalid email or password. Please check your credentials and try again.",
      icon: <XCircle className="h-12 w-12" />,
      color: "text-red-500",
      autoRedirect: true,
      redirectPath: "/auth/signin",
      redirectDelay: 3000,
    },
    OAuthAccountNotLinked: {
      title: "Account Not Linked",
      message:
        "This email is already associated with another account. Please sign in with the original method.",
      icon: <AlertCircle className="h-12 w-12" />,
      color: "text-blue-500",
    },
    Default: {
      title: "Authentication Error",
      message:
        customMessage || "An unexpected error occurred during authentication.",
      icon: <AlertCircle className="h-12 w-12" />,
      color: "text-gray-500",
    },
    // Add other error types with default values
    OAuthSignin: {
      title: "OAuth Sign In Error",
      message:
        "Error signing in with the selected provider. Please try another method.",
      icon: <AlertCircle className="h-12 w-12" />,
      color: "text-orange-500",
    },
    OAuthCallback: {
      title: "OAuth Callback Error",
      message: "Error during OAuth callback.",
      icon: <AlertCircle className="h-12 w-12" />,
      color: "text-orange-500",
    },
    OAuthCreateAccount: {
      title: "OAuth Create Account Error",
      message: "Error creating account with OAuth.",
      icon: <AlertCircle className="h-12 w-12" />,
      color: "text-orange-500",
    },
    EmailCreateAccount: {
      title: "Email Create Account Error",
      message: "Error creating account with email.",
      icon: <AlertCircle className="h-12 w-12" />,
      color: "text-orange-500",
    },
    Callback: {
      title: "Callback Error",
      message: "Error during callback.",
      icon: <AlertCircle className="h-12 w-12" />,
      color: "text-orange-500",
    },
    EmailSignin: {
      title: "Email Sign In Error",
      message: "Error signing in with email.",
      icon: <AlertCircle className="h-12 w-12" />,
      color: "text-orange-500",
    },
    SessionRequired: {
      title: "Session Required",
      message: "Please sign in to access this page.",
      icon: <AlertCircle className="h-12 w-12" />,
      color: "text-blue-500",
    },
  };

// Get the error configuration or use default
const config =  errorConfigs[ updateError as AuthErrorType] || errorConfigs.Default;

  // Auto-redirect if configured
  useEffect(() => {
    if (config?.autoRedirect && config?.redirectPath) {
      const timer = setTimeout(() => {
        router.push(config.redirectPath!);
      }, config?.redirectDelay || 3000);

      return () => clearTimeout(timer);
    }
  }, [config, router]);

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className={`${config?.color} p-3 rounded-full bg-opacity-10`}>
            {config?.icon}
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-3">
          {config?.title}
        </h1>

        {/* Error Message */}
        <p className="text-gray-600 text-center mb-8 leading-relaxed">
          {config?.message}
        </p>

        {/* Error Code (if present) */}
        {error && error !== "Default" && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 text-center">
              Error code:{" "}
              <code className="font-mono bg-gray-100 px-2 py-1 rounded">
                {error}
              </code>
            </p>
          </div>
        )}

        {/* Auto-redirect Countdown */}
        {config?.autoRedirect && config?.redirectDelay && (
          <div className="mb-6 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 text-center">
              Redirecting in {config.redirectDelay / 1000} seconds...
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-3">
          <Link
            href="/auth/signin"
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium  rounded-lg transition-colors px-4 py-2 text-sm"
          >
            <LogIn className="h-5 w-5" />
            Try Again
          </Link>

          <Link
            href={callbackUrl}
            className="text-sm flex-1 flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2  rounded-lg transition-colors"
          >
            <Home className="h-5 w-5" />
            Home
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Need help?{" "}
            <Link
              href="/contact"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Contact support
            </Link>{" "}
            or{" "}
            <Link
              href="/docs/auth-troubleshooting"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              view troubleshooting guide
            </Link>
          </p>
        </div>
      </div>

      {/* Debug Information (Only in development) */}
      {process.env.NODE_ENV === "development" && params && (
        <div className="mt-8 max-w-md w-full">
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-medium text-gray-700 cursor-pointer">
              Debug Information
            </summary>
            <pre className="mt-2 text-sm text-gray-600 overflow-auto p-3 bg-gray-100 rounded">
              {JSON.stringify(params, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
