"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorToolbar } from "./EditorToolbar";

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export function TiptapEditor({ value, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Write your post content here..." }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="rounded-lg border border-neutral-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
      <EditorToolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose prose-neutral max-w-none px-3 py-2.5 text-sm min-h-64 focus:outline-none"
      />
    </div>
  );
}
