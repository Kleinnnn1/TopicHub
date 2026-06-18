import { getPublishedPostsServer } from "@/lib/firebase/firestore.server";
import { BlogPostList } from "@/components/blog/BlogPostList";

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPublishedPostsServer();
  const allTags = [...new Set(posts.flatMap((p) => p.tags))];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-neutral-900 mb-8">
        Blog
      </h1>
      <BlogPostList posts={posts} tags={allTags} />
    </div>
  );
}
