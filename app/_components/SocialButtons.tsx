"use client";

import { Button } from "./Button";
import providerAuth from "@/actions/providerAuth";

interface SocialAuthButtonsProps {
  provider: "google" | "github";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export function SocialButtons({
  provider,
  isLoading,
  icon: Icon,
}: SocialAuthButtonsProps) {
  const handleSubmit = async () => {
    await providerAuth(provider);
   
   
  }
  
  return (
    <form className="w-full" action={handleSubmit}>
      <Button
        variant="social"
        disabled={isLoading}
        className="flex items-center justify-center gap-2"
        type="submit"
      >
        {Icon}
        <span>{provider.charAt(0).toUpperCase() + provider.slice(1)}</span>
      </Button>
    </form>
  );
}
