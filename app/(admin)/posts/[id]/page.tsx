"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { PostForm } from "@/components/admin/PostForm";
import { usePost } from "@/hooks/usePost";
import { updatePost } from "@/lib/firebase/firestore";
import { triggerRevalidation } from "@/lib/actions";
import { Spinner } from "@/components/ui/Spinner";
import type { PostFormValues } from "@/lib/validations";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { post, loading, error } = usePost(id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (post) document.title = `Edit: ${post.title} | TopicHub`;
  }, [post]);

  async function handleSubmit(values: PostFormValues) {
    setIsSubmitting(true);
    try {
      await updatePost(id, values);
      await triggerRevalidation(values.slug);
      toast.success(
        values.status === "published"
          ? "Post updated successfully."
          : "Draft saved successfully.",
      );
      router.push("/posts");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  if (error || !post)
    return (
      <p className="py-16 text-center text-sm text-red-500">
        {error ?? "Post not found."}
      </p>
    );

  return (
    <PostForm
      initialData={post}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
