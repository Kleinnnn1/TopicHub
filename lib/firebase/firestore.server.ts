import { adminDb } from "./admin";
import type { Post, PostStatus } from "@/types";

function toPost(id: string, data: FirebaseFirestore.DocumentData): Post {
  return {
    id,
    title: data.title ?? "",
    slug: data.slug ?? "",
    content: data.content ?? "",
    excerpt: data.excerpt ?? "",
    coverImage: data.coverImage ?? null,
    tags: data.tags ?? [],
    status: data.status as PostStatus,
    authorId: data.authorId ?? "",
    authorName: data.authorName ?? "",
    createdAt:
      data.createdAt?.toDate().toISOString() ?? new Date().toISOString(),
    updatedAt:
      data.updatedAt?.toDate().toISOString() ?? new Date().toISOString(),
  };
}

export async function getPublishedPostsServer(): Promise<Post[]> {
  const snapshot = await adminDb
    .collection("posts")
    .where("status", "==", "published")
    .orderBy("createdAt", "desc")
    .get();
  return snapshot.docs.map((d) => toPost(d.id, d.data()));
}

export async function getPostBySlugServer(slug: string): Promise<Post | null> {
  const snapshot = await adminDb
    .collection("posts")
    .where("slug", "==", slug)
    .where("status", "==", "published")
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return toPost(d.id, d.data());
}

export async function getUserProfileServer(uid: string) {
  const doc = await adminDb.collection("users").doc(uid).get();
  if (!doc.exists) return null;
  const data = doc.data()!;
  return {
    uid,
    displayName: data.displayName ?? "",
    email: data.email ?? "",
    bio: data.bio ?? "",
    createdAt:
      data.createdAt?.toDate().toISOString() ?? new Date().toISOString(),
  };
}
