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
    editorProps: {
      attributes: {
        class: "min-h-64 px-3 py-2.5 text-sm focus:outline-none cursor-text",
      },
    },
  });

  return (
    <div
      onClick={() => editor?.commands.focus()}
      className="rounded-lg border border-neutral-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 cursor-text"
    >
      <EditorToolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose prose-neutral max-w-none"
      />
    </div>
  );
}
