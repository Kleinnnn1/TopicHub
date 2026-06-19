"use server";

import { adminDb } from "@/lib/firebase/admin";

export async function triggerRevalidation(slug?: string) {
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/revalidate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-revalidate-secret": process.env.REVALIDATE_SECRET ?? "",
    },
    body: JSON.stringify({ slug }),
  });
}

export async function checkSlugTaken(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const snapshot = await adminDb
    .collection("posts")
    .where("slug", "==", slug)
    .get();
  if (snapshot.empty) return false;
  if (excludeId) {
    return snapshot.docs.some((doc) => doc.id !== excludeId);
  }
  return true;
}
