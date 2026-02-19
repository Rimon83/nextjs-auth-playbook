"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "social";
}

export function Button({
  isLoading,
  children,
  variant = "primary",
  className,
  ...props
}: AuthButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      className={cn(
        "relative w-full py-3.5 px-6 rounded-lg font-semibold text-[15px]",
        "transition-all duration-200 ease-out",
        "disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        variant === "primary" && [
          "bg-blue-500 text-primary-foreground",
          "hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20",
          "focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2",
          "active:scale-[0.98] cursor-pointer",
        ],
        variant === "secondary" && [
          "bg-secondary text-secondary-foreground border border-border",
          "hover:bg-secondary/80 hover:border-border/70",
          "focus:outline-none focus:ring-2 focus:ring-ring/50 focus:ring-offset-2",
          "active:scale-[0.98] cursor-pointer",
        ],
        variant === "social" && [
          "bg-card text-foreground border border-border",
          "hover:bg-secondary hover:border-border/70",
          "focus:outline-none focus:ring-2 focus:ring-ring/50 focus:ring-offset-2",
          "active:scale-[0.98] cursor-pointer",
        ],

        isPressed && "scale-[0.98]",
        className,
      )}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
