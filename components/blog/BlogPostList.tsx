"use client";

import { useState } from "react";
import { TagFilter } from "@/components/blog/TagFilter";
import { PostCard } from "@/components/blog/PostCard";
import type { Post } from "@/types";

interface BlogPostListProps {
  posts: Post[];
  tags: string[];
}

export function BlogPostList({ posts, tags }: BlogPostListProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = selected
    ? posts.filter((p) => p.tags.includes(selected))
    : posts;

  return (
    <div className="space-y-8">
      {tags.length > 0 && (
        <TagFilter tags={tags} selected={selected} onChange={setSelected} />
      )}
      {filtered.length === 0 ? (
        <p className="text-center text-neutral-500 py-16">No posts yet.</p>
      ) : (
        <div className="grid gap-6">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
