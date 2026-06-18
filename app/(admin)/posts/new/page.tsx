"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PostForm } from "@/components/admin/PostForm";
import { createPost } from "@/lib/firebase/firestore";
import { generateExcerpt } from "@/lib/utils";
import { triggerRevalidation } from "@/lib/actions";
import { useAuth } from "@/hooks/useAuth";
import type { PostFormValues } from "@/lib/validations";

export default function NewPostPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "New Post | TopicHub";
  }, []);

  async function handleSubmit(values: PostFormValues) {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await createPost({
        title: values.title,
        slug: values.slug,
        content: values.content,
        excerpt: values.excerpt || generateExcerpt(values.content),
        coverImage: values.coverImage,
        tags: values.tags,
        status: values.status,
        authorId: user.uid,
        authorName:
          user.displayName ?? user.email?.split("@")[0] ?? "Anonymous",
      });
      await triggerRevalidation(values.slug);
      toast.success(
        values.status === "published"
          ? "Post published successfully."
          : "Draft saved successfully.",
      );
      router.push("/posts");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <PostForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
}
