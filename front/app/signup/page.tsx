"use client";

import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/SignUpForm";

export default function SignupPage() {
  const router = useRouter();

  const handleSuccess = (user: any) => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen">
      <SignupForm
        apiBaseUrl="/api"
        onSuccess={handleSuccess}
        onError={(error) => console.error("Signup error:", error)}
      />
    </div>
  );
}