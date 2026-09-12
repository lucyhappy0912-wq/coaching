"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function HashRedirect({ from, to }: { from: string; to: string }) {
  const router = useRouter();

  useEffect(() => {
    if (window.location.hash.replace("#", "") === from) {
      router.replace(to);
    }
  }, [from, router, to]);

  return null;
}
