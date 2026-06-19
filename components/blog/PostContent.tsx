import DOMPurify from "isomorphic-dompurify";

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  const clean = DOMPurify.sanitize(content);

  return (
    <div
      className="prose prose-neutral max-w-none
        prose-headings:font-display
        prose-headings:font-bold
        prose-h1:text-3xl
        prose-h2:text-2xl
        prose-h3:text-xl
        prose-p:text-neutral-700
        prose-p:leading-relaxed
        prose-a:text-blue-600
        prose-a:no-underline
        hover:prose-a:underline
        prose-strong:text-neutral-900
        prose-code:rounded
        prose-code:bg-neutral-100
        prose-code:px-1.5
        prose-code:py-0.5
        prose-code:text-sm
        prose-code:text-neutral-800
        prose-code:before:content-none
        prose-code:after:content-none
        prose-pre:rounded-xl
        prose-pre:border
        prose-pre:border-neutral-200
        prose-pre:bg-neutral-50
        prose-blockquote:border-l-blue-600
        prose-blockquote:text-neutral-600
        prose-img:rounded-xl
        prose-hr:border-neutral-200"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
