"use client";

import { useEffect } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, type PostFormValues } from "@/lib/validations";
import { slugify, generateExcerpt } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import { TiptapEditor } from "@/components/editor/TiptapEditor";
import { isSlugTaken } from "@/lib/firebase/firestore";
import type { Post } from "@/types";

interface PostFormProps {
  initialData?: Post;
  onSubmit: (values: PostFormValues) => Promise<void>; // fixed: removed status param
  isSubmitting: boolean;
}

export function PostForm({
  initialData,
  onSubmit,
  isSubmitting,
}: PostFormProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    setError,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema) as Resolver<PostFormValues>,
    defaultValues: initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          content: initialData.content,
          excerpt: initialData.excerpt,
          coverImage: initialData.coverImage,
          tags: initialData.tags,
          status: initialData.status,
        }
      : {
          title: "",
          slug: "",
          content: "",
          excerpt: "",
          coverImage: null,
          tags: [],
          status: "draft" as const,
        },
  });

  const titleValue = watch("title");
  const contentValue = watch("content");
  const tagsValue = watch("tags");

  // Auto-generate slug from title (only on create)
  useEffect(() => {
    if (!isEditing && titleValue) {
      setValue("slug", slugify(titleValue), { shouldValidate: true });
    }
  }, [titleValue, isEditing, setValue]);

  // Auto-generate excerpt from content if empty
  useEffect(() => {
    if (contentValue) {
      const currentExcerpt = watch("excerpt");
      if (!currentExcerpt) {
        setValue("excerpt", generateExcerpt(contentValue));
      }
    }
  }, [contentValue, setValue, watch]);

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const input = e.currentTarget;
      const tag = input.value.trim().toLowerCase();
      if (tag && !tagsValue.includes(tag)) {
        setValue("tags", [...tagsValue, tag]);
      }
      input.value = "";
    }
  }

  function removeTag(tag: string) {
    setValue(
      "tags",
      tagsValue.filter((t) => t !== tag),
    );
  }

  // Slug check + status injection happen here, before calling parent's onSubmit
  async function handleSaveAsDraft(data: PostFormValues) {
    const taken = await isSlugTaken(data.slug, initialData?.id);
    if (taken) {
      setError("slug", {
        message: "This slug is already in use. Choose another.",
      });
      return;
    }
    await onSubmit({ ...data, status: "draft" });
  }

  async function handlePublish(data: PostFormValues) {
    const taken = await isSlugTaken(data.slug, initialData?.id);
    if (taken) {
      setError("slug", {
        message: "This slug is already in use. Choose another.",
      });
      return;
    }
    await onSubmit({ ...data, status: "published" });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">
            {isEditing ? "Edit Post" : "New Post"}
          </h1>
          {initialData && (
            <div className="mt-1 flex items-center gap-2">
              <StatusBadge status={initialData.status} />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSubmit(handleSaveAsDraft)}
            disabled={isSubmitting}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? <Spinner size="sm" /> : "Save as Draft"}
          </button>
          <button
            onClick={handleSubmit(handlePublish)}
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <Spinner size="sm" />
            ) : isEditing ? (
              "Update"
            ) : (
              "Publish"
            )}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-1.5">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-neutral-700"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Post title"
            {...register("title")}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {errors.title && (
            <p className="text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Slug */}
        <div className="space-y-1.5">
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-neutral-700"
          >
            Slug
          </label>
          <div className="flex items-center rounded-lg border border-neutral-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
            <span className="select-none border-r border-neutral-200 px-3 py-2.5 text-sm text-neutral-400">
              /blog/
            </span>
            <input
              id="slug"
              type="text"
              placeholder="post-slug"
              {...register("slug")}
              className="flex-1 rounded-r-lg px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
            />
          </div>
          {errors.slug && (
            <p className="text-xs text-red-500">{errors.slug.message}</p>
          )}
        </div>

        {/* Cover Image */}
        <div className="space-y-1.5">
          <label
            htmlFor="coverImage"
            className="block text-sm font-medium text-neutral-700"
          >
            Cover Image URL{" "}
            <span className="font-normal text-neutral-400">(optional)</span>
          </label>
          <Controller
            name="coverImage"
            control={control}
            render={({ field }) => (
              <input
                id="coverImage"
                type="url"
                placeholder="https://..."
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value || null)}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            )}
          />
          {errors.coverImage && (
            <p className="text-xs text-red-500">{errors.coverImage.message}</p>
          )}
        </div>

        {/* Content — Tiptap editor replaces textarea */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-neutral-700">
            Content
          </label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TiptapEditor value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.content && (
            <p className="text-xs text-red-500">{errors.content.message}</p>
          )}
        </div>

        {/* Excerpt */}
        <div className="space-y-1.5">
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-neutral-700"
          >
            Excerpt{" "}
            <span className="font-normal text-neutral-400">
              (auto-generated if left empty)
            </span>
          </label>
          <textarea
            id="excerpt"
            placeholder="Short description of the post..."
            rows={3}
            {...register("excerpt")}
            className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {errors.excerpt && (
            <p className="text-xs text-red-500">{errors.excerpt.message}</p>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <label
            htmlFor="tag-input"
            className="block text-sm font-medium text-neutral-700"
          >
            Tags{" "}
            <span className="font-normal text-neutral-400">
              (press Enter or comma to add)
            </span>
          </label>
          <div className="min-h-10.5 w-full rounded-lg border border-neutral-200 px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
            <div className="flex flex-wrap gap-2">
              {tagsValue.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-0.5 text-blue-400 hover:text-blue-700"
                    aria-label={`Remove tag ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                id="tag-input"
                type="text"
                placeholder={
                  tagsValue.length === 0 ? "react, nextjs, typescript…" : ""
                }
                onKeyDown={handleTagKeyDown}
                className="min-w-30 flex-1 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
