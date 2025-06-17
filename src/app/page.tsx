"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/to-do-list");
    }
  }, [isSignedIn]);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Welcome to your Next To Do List app!</h1>
      <p>Sign up to start using your new app.</p>
    </div>
  );
}
