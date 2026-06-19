"use server";

import { adminDb } from "@/lib/firebase/admin";

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
