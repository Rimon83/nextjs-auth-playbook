"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator({
  password,
  className,
}: PasswordStrengthIndicatorProps) {
  const calculateStrength = (
    pass: string
  ): { strength: number; label: string; color: string } => {
    if (!pass) return { strength: 0, label: "", color: "" };

    let score = 0;

    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[^a-zA-Z0-9]/.test(pass)) score++;

    if (score <= 2)
      return { strength: 25, label: "Weak", color: "bg-destructive" };
    if (score === 3)
      return { strength: 50, label: "Fair", color: "bg-orange-500" };
    if (score === 4)
      return { strength: 75, label: "Good", color: "bg-yellow-500" };
    return { strength: 100, label: "Strong", color: "bg-green-500" };
  };

  const { strength, label, color } = calculateStrength(password);

  if (!password) return null;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all duration-300 ease-out", color)}
          style={{ width: `${strength}%` }}
        />
      </div>
      {label && (
        <p className="text-xs font-medium text-muted-foreground animate-fade-in">
          Password strength:{" "}
          <span className={cn(color.replace("bg-", "text-"))}>{label}</span>
        </p>
      )}
    </div>
  );
}
