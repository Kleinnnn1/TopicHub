"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { TagFilter } from "@/components/blog/TagFilter";
import { PostCard } from "@/components/blog/PostCard";
import type { Post } from "@/types";

interface BlogPostListProps {
  posts: Post[];
  tags: string[];
}

export function BlogPostList({ posts, tags }: BlogPostListProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = posts.filter((post) => {
    const matchesTag = selected ? post.tags.includes(selected) : true;
    const matchesSearch = searchQuery
      ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesTag && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search posts..."
          className="w-full rounded-lg border border-neutral-200 py-2.5 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Tag filter */}
      {tags.length > 0 && (
        <TagFilter tags={tags} selected={selected} onChange={setSelected} />
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-center text-neutral-500 py-16">
          {searchQuery || selected
            ? "No posts match your search."
            : "No posts yet."}
        </p>
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
