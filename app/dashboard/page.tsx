"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function UserDashboard() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("/api/isAdmin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email }),
        });

        const data = await response.json();
        if (data.isAdmin) {
          router.push("/admin");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          User Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Welcome to your dashboard. This is a protected page for regular users.
        </p>
      </div>
    </div>
  );
}
