"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("URL-ul imaginii:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const btnClass = "p-2 rounded-md hover:bg-slate-100 transition-colors text-slate-600 disabled:opacity-50";
  const activeClass = "bg-slate-200 text-slate-900";

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={cn(btnClass, editor.isActive("bold") && activeClass)}
        title="Bold"
      >
        <Bold className="size-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cn(btnClass, editor.isActive("italic") && activeClass)}
        title="Italic"
      >
        <Italic className="size-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={cn(btnClass, editor.isActive("strike") && activeClass)}
        title="Strikethrough"
      >
        <Strikethrough className="size-4" />
      </button>
      
      <div className="mx-2 h-4 w-px bg-slate-300" />
      
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(btnClass, editor.isActive("heading", { level: 2 }) && activeClass)}
        title="Heading 2"
      >
        <Heading2 className="size-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={cn(btnClass, editor.isActive("heading", { level: 3 }) && activeClass)}
        title="Heading 3"
      >
        <Heading3 className="size-4" />
      </button>
      
      <div className="mx-2 h-4 w-px bg-slate-300" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(btnClass, editor.isActive("bulletList") && activeClass)}
        title="Bullet List"
      >
        <List className="size-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(btnClass, editor.isActive("orderedList") && activeClass)}
        title="Ordered List"
      >
        <ListOrdered className="size-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={cn(btnClass, editor.isActive("blockquote") && activeClass)}
        title="Blockquote"
      >
        <Quote className="size-4" />
      </button>
      
      <div className="mx-2 h-4 w-px bg-slate-300" />

      <button onClick={addImage} className={btnClass} title="Add Image">
        <ImageIcon className="size-4" />
      </button>

      <div className="mx-2 h-4 w-px bg-slate-300" />

      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className={btnClass}
        title="Undo"
      >
        <Undo className="size-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className={btnClass}
        title="Redo"
      >
        <Redo className="size-4" />
      </button>
    </div>
  );
};

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[300px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/15">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
