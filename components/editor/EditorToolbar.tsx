"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null;

  const tools = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      label: "Bold",
      active: editor.isActive("bold"),
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      label: "Italic",
      active: editor.isActive("italic"),
    },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      label: "Heading",
      active: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      label: "Bullet list",
      active: editor.isActive("bulletList"),
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      label: "Ordered list",
      active: editor.isActive("orderedList"),
    },
    {
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      label: "Blockquote",
      active: editor.isActive("blockquote"),
    },
    {
      icon: Code,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      label: "Code block",
      active: editor.isActive("codeBlock"),
    },
  ];

  return (
    <div className="flex flex-wrap gap-1 border-b border-neutral-200 px-2 py-1.5">
      {tools.map(({ icon: Icon, action, label, active }) => (
        <button
          key={label}
          type="button"
          onClick={action}
          aria-label={label}
          className={`rounded p-1.5 transition-colors ${
            active
              ? "bg-blue-50 text-blue-700"
              : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
          }`}
        >
          <Icon size={15} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
