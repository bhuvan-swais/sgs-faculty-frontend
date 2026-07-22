"use client";

/**
 * The standalone Chapters list moved into the Notes section's "Chapters" tab.
 * This route now just redirects there so old links/bookmarks keep working.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChaptersRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/notes?tab=chapters");
  }, [router]);
  return null;
}
