"use client"
import { Button } from "./_components/Button";

export default function Home() {
  const handleGetStartedClick = () => {
    window.location.href = "/auth/signin";
  }
  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4">
      <div className="max-w-md mx-auto cursor-pointer">
        <Button
          variant="primary"
          className="px-8 py-4 cursor-pointer"
          onClick={handleGetStartedClick}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
