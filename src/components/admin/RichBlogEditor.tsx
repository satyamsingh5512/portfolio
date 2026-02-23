"use client";

import { Button } from "@/components/ui/button";
import CharacterCount from "@tiptap/extension-character-count";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import typescript from "highlight.js/lib/languages/typescript";
import { createLowlight } from "lowlight";
import {
  Bold,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

// ─── Lowlight setup ───────────────────────────────────────────────────────────
const lowlight = createLowlight();
lowlight.register("javascript", javascript);
lowlight.register("typescript", typescript);
lowlight.register("css", css);
lowlight.register("python", python);
lowlight.register("bash", bash);

// ─── Types ────────────────────────────────────────────────────────────────────
export interface RichBlogEditorPayload {
  json: Record<string, unknown>;
  html: string;
  text: string;
}

interface RichBlogEditorProps {
  initialContent?: Record<string, unknown>;
  onChange: (data: RichBlogEditorPayload) => void;
}

// ─── Toolbar Button ───────────────────────────────────────────────────────────
function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`h-8 w-8 ${active ? "bg-white/20 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
    >
      {children}
    </Button>
  );
}

// ─── Menu Bar ─────────────────────────────────────────────────────────────────
function MenuBar({ editor }: { editor: ReturnType<typeof useEditor> | null }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSetLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", previousUrl ?? "");

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!editor) return;
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "blog");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Upload failed");
        }
        const { url } = await res.json();
        if (
          !url ||
          typeof url !== "string" ||
          !url.includes("res.cloudinary.com")
        ) {
          throw new Error("Upload did not return a Cloudinary URL");
        }
        editor.chain().focus().setImage({ src: url }).run();
      } catch (err) {
        console.error("Image upload failed:", err);
        window.alert(
          err instanceof Error ? err.message : "Image upload failed",
        );
      } finally {
        // reset so same file can be chosen again
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [editor],
  );

  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-xl border-b border-white/10 bg-white/5 p-2">
      {/* Text formatting */}
      <ToolbarButton
        title="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>

      <Divider />

      {/* Headings */}
      <ToolbarButton
        title="Heading 1"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>

      <Divider />

      {/* Lists */}
      <ToolbarButton
        title="Bullet List"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Ordered List"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>

      <Divider />

      {/* Blocks */}
      <ToolbarButton
        title="Blockquote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Inline Code"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Code Block"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Horizontal Rule"
        active={false}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus className="h-4 w-4" />
      </ToolbarButton>

      <Divider />

      {/* Link */}
      <ToolbarButton
        title="Toggle Link"
        active={editor.isActive("link")}
        onClick={handleSetLink}
      >
        <LinkIcon className="h-4 w-4" />
      </ToolbarButton>

      {/* Image upload */}
      <ToolbarButton
        title="Insert Image"
        active={false}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon className="h-4 w-4" />
      </ToolbarButton>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleImageUpload}
      />

      <Divider />

      {/* History */}
      <ToolbarButton
        title="Undo"
        active={false}
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Redo"
        active={false}
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo className="h-4 w-4" />
      </ToolbarButton>

      {/* Character count (right-aligned) */}
      <span className="ml-auto text-xs text-white/30">
        {editor.storage.characterCount.characters()} chars
      </span>
    </div>
  );
}

function Divider() {
  return <div className="mx-1 h-5 w-px bg-white/10" />;
}

// ─── Main Editor ──────────────────────────────────────────────────────────────
export function RichBlogEditor({
  initialContent,
  onChange,
}: RichBlogEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image.configure({
        allowBase64: false,
        inline: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: "text-blue-400 underline underline-offset-2 cursor-pointer",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "rounded-lg bg-white/5 p-4 font-mono text-sm",
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing your story…",
      }),
      CharacterCount,
      Typography,
    ],
    content: initialContent ?? "",
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[500px] p-8 focus:outline-none",
      },
    },
    onUpdate({ editor }) {
      onChange({
        json: editor.getJSON() as Record<string, unknown>,
        html: editor.getHTML(),
        text: editor.getText(),
      });
    },
  });

  // Sync content once the editor is ready (handles edit mode where editor starts null
  // because immediatelyRender: false, so the dep must include `editor` itself).
  useEffect(() => {
    if (!editor || !initialContent) return;
    const current = JSON.stringify(editor.getJSON());
    const incoming = JSON.stringify(initialContent);
    if (current !== incoming) {
      editor.commands.setContent(initialContent, { emitUpdate: false });
    }
  }, [editor, initialContent]);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02]">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
