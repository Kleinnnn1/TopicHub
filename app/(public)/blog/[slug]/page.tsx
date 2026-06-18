import { notFound } from "next/navigation";
import {
  getPostBySlugServer,
  getPublishedPostsServer,
  getUserProfileServer,
} from "@/lib/firebase/firestore.server";
import { PostContent } from "@/components/blog/PostContent";

export const revalidate = 60;

// Pre-render all published slugs at build time
export async function generateStaticParams() {
  const posts = await getPublishedPostsServer();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlugServer(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} | TopicHub`,
    description: post.excerpt,
  };
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlugServer(params.slug);
  if (!post) notFound();

  const author = await getUserProfileServer(post.authorId);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full rounded-xl object-cover mb-8 max-h-96"
        />
      )}
      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="font-display text-4xl font-bold text-neutral-900 mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <span>{author?.displayName ?? post.authorName}</span>
          <span>·</span>
          <time dateTime={post.createdAt}>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </header>
      <PostContent content={post.content} />
    </article>
  );
}
