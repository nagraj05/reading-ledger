"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export function ClerkRedirect() {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      window.location.href = "/post-login";
    }
  }, [isSignedIn, isLoaded]);

  return null;
}
