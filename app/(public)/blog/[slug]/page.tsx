import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPostBySlugServer,
  getUserProfileServer,
} from "@/lib/firebase/firestore.server";
import { PostContent } from "@/components/blog/PostContent";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlugServer(slug);
  if (!post) return {};
  return {
    title: `${post.title} | TopicHub`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlugServer(slug);
  if (!post) notFound();

  const author = await getUserProfileServer(post.authorId);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-10 space-y-4">
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <h1 className="font-display text-4xl font-bold text-neutral-900">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-lg text-neutral-500">{post.excerpt}</p>
        )}
        <p className="text-sm text-neutral-400">
          By{" "}
          <Link
            href={`/about/${post.authorId}`}
            className="font-medium text-neutral-600 hover:text-blue-600 hover:underline"
          >
            {author?.displayName ?? post.authorName}
          </Link>
          {" · "}
          {formatDate(post.createdAt)}
        </p>
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full rounded-xl object-cover"
          />
        )}
      </div>
      <PostContent content={post.content} />
    </div>
  );
}
