"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
}

export function Input({
  label,
  error,
  success,
  type,
  className,
  ...props
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
     setIsFocused(false);
    props.onChange?.(e);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type={inputType}
          className={cn(
            "peer w-full px-4 py-3.5 rounded-lg border bg-input/50 backdrop-blur-sm",
            "font-body text-[15px] text-foreground placeholder:text-transparent",
            "transition-all duration-200 ease-out",
            "focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring focus:bg-card",
            "focus:shadow-lg focus:shadow-ring/5",
            error &&
              "border-destructive focus:ring-destructive/20 focus:border-destructive",
            success &&
              "border-success focus:ring-success/20 focus:border-success",
            !error && !success && "border-border hover:border-ring/50",
            className
          )}
          placeholder={label}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            setHasValue(e.target.value.length > 0);
            props.onBlur?.(e);
          }}
          onChange={handleChange}
          {...props}
        />
        <label
          className={cn(
            "absolute left-4 transition-all duration-200 ease-out pointer-events-none font-medium",
            "text-muted-foreground",
            isFocused || hasValue || props.value
              ? "top-0 -translate-y-1/2 text-xs bg-card px-2"
              : "top-1/2 -translate-y-1/2 text-[15px]",
            error && "text-destructive",
            success && "text-success",
            isFocused && !error && !success && "text-ring"
          )}
        >
          {label}
        </label>
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-destructive mt-1.5 ml-1 animate-slide-in-right font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
