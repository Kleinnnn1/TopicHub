import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "./config";
import type { Post, PostPayload, PostStatus, UserProfile } from "@/types";

const POSTS = "posts";
const USERS = "users";

function toISOString(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
}

function toPost(id: string, data: Record<string, unknown>): Post {
  return {
    id,
    title: (data.title as string) ?? "",
    slug: (data.slug as string) ?? "",
    content: (data.content as string) ?? "",
    excerpt: (data.excerpt as string) ?? "",
    coverImage: (data.coverImage as string | null) ?? null,
    tags: (data.tags as string[]) ?? [],
    status: (data.status as PostStatus) ?? "draft",
    authorId: (data.authorId as string) ?? "",
    authorName: (data.authorName as string) ?? "",
    createdAt: toISOString(data.createdAt),
    updatedAt: toISOString(data.updatedAt),
  };
}

export async function getAllPosts(authorId: string): Promise<Post[]> {
  const q = query(
    collection(db, POSTS),
    where("authorId", "==", authorId),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => toPost(d.id, d.data()));
}

export async function getPublishedPosts(): Promise<Post[]> {
  const q = query(
    collection(db, POSTS),
    where("status", "==", "published"),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => toPost(d.id, d.data()));
}

export async function getPublishedPostsByAuthor(
  authorId: string,
): Promise<Post[]> {
  const q = query(
    collection(db, POSTS),
    where("authorId", "==", authorId),
    where("status", "==", "published"),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => toPost(d.id, d.data()));
}

export async function getPostById(id: string): Promise<Post | null> {
  const ref = doc(db, POSTS, id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return toPost(snapshot.id, snapshot.data());
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const q = query(
    collection(db, POSTS),
    where("slug", "==", slug),
    where("status", "==", "published"),
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return toPost(d.id, d.data());
}

export async function createPost(payload: PostPayload): Promise<string> {
  const ref = await addDoc(collection(db, POSTS), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updatePost(
  id: string,
  payload: Partial<PostPayload>,
): Promise<void> {
  const ref = doc(db, POSTS, id);
  await updateDoc(ref, {
    ...payload,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePost(id: string): Promise<void> {
  const ref = doc(db, POSTS, id);
  await deleteDoc(ref);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const ref = doc(db, USERS, uid);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  return {
    uid,
    displayName: data.displayName ?? "",
    email: data.email ?? "",
    bio: data.bio ?? "",
    createdAt: toISOString(data.createdAt),
  };
}

export async function isSlugTaken(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const q = query(collection(db, "posts"), where("slug", "==", slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return false;
  if (excludeId) {
    return snapshot.docs.some((doc) => doc.id !== excludeId);
  }
  return true;
}

export async function upsertUserProfile(
  uid: string,
  data: Partial<Omit<UserProfile, "uid" | "createdAt">>,
): Promise<void> {
  const ref = doc(db, USERS, uid);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    await setDoc(ref, { ...data, createdAt: serverTimestamp() });
  } else {
    await updateDoc(ref, data);
  }
}
