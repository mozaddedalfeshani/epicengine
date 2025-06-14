"use client";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Check if user is admin or regular user
      const response = await fetch("/api/isAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: result.user.email }),
      });

      const data = await response.json();

      if (data.isAdmin) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
            Welcome to EpicEngine
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Sign in to access your dashboard
          </p>
        </div>

        <Button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 py-6 text-lg"
          variant="outline">
          <FcGoogle className="w-6 h-6" />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
