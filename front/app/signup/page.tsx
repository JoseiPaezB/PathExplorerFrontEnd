"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SignupForm } from '@/components/SignUpForm';

export default function SignupPage() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSuccess = (user: any) => {
    console.log('User registered:', user);
    setIsRedirecting(true);
    
    setTimeout(() => {
      if (user.role === "administrador") {
        router.push("/usuarios");
      } else {
        router.push("/dashboard");
      }
    }, 1500);
  };

  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SignupForm 
        apiBaseUrl="/api"
        onSuccess={handleSuccess}
        onError={(error) => console.error('Signup error:', error)}
      />
    </div>
  );
}