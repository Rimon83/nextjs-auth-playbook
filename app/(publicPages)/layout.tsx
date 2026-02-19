import { cn } from "@/lib/utils";
import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  // const session = await auth();
  // if (session?.user) {
  //   redirect("/dashboard");
  // }
  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4 w-full">
        <div className="relative w-full max-w-md animate-slide-up">
          <div
            className={cn(
              "relative bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50",
              "px-6 py-8 sm:px-12 sm:py-10 w-full"
            )}
            style={{
              boxShadow:
                "0 20px 60px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
           
              {children}
          </div>
      </div>
    </div>
  );
};

export default AuthLayout;
