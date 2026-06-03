"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";
import { useEffect, useState } from "react";
import {
  Bold,
  Code2,
  Eye,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";

export function RichEditor({
  value,
  onChange,
  placeholder,
  minHeight = 280,
}: {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  minHeight?: number;
}) {
  const [mode, setMode] = useState<"visual" | "source">("visual");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Viết mô tả sản phẩm…",
      }),
      Markdown.configure({
        html: false,
        linkify: false,
        breaks: true,
        transformPastedText: true,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "md-content prose-sm focus:outline-none w-full rounded-b-lg border border-t-0 border-paper-line bg-white px-4 py-3",
        style: `min-height: ${minHeight}px;`,
      },
    },
    onUpdate: ({ editor: ed }) => {
      const md = (ed.storage as unknown as { markdown: { getMarkdown: () => string } }).markdown.getMarkdown();
      onChange(md);
    },
  });

  // Sync external value -> editor (khi defaults thay đổi do edit row khác)
  useEffect(() => {
    if (!editor) return;
    const current = (editor.storage as unknown as { markdown: { getMarkdown: () => string } }).markdown.getMarkdown();
    if (value !== current) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) {
    return (
      <div
        className="rounded-lg border border-paper-line bg-paper-soft text-sm text-ink-muted"
        style={{ minHeight }}
      >
        <p className="p-3">Đang nạp editor…</p>
      </div>
    );
  }

  return (
    <div>
      <Toolbar editor={editor} mode={mode} onToggleMode={() => setMode((m) => (m === "visual" ? "source" : "visual"))} />
      {mode === "visual" ? (
        <EditorContent editor={editor} />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight }}
          spellCheck={false}
          className="md-source w-full rounded-b-lg border border-t-0 border-paper-line bg-paper-soft px-4 py-3 font-mono text-sm leading-relaxed focus:outline-none"
        />
      )}
    </div>
  );
}

function Toolbar({
  editor,
  mode,
  onToggleMode,
}: {
  editor: Editor;
  mode: "visual" | "source";
  onToggleMode: () => void;
}) {
  const disabled = mode === "source";
  return (
    <div className="flex flex-wrap items-center justify-between gap-1 rounded-t-lg border border-paper-line bg-paper-soft p-1">
      <div className="flex flex-wrap items-center gap-0.5">
      <Btn
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={!disabled && editor.isActive("bold")}
        disabled={disabled}
        title="Bold (Ctrl+B)"
      >
        <Bold size={14} />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={!disabled && editor.isActive("italic")}
        disabled={disabled}
        title="Italic (Ctrl+I)"
      >
        <Italic size={14} />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={!disabled && editor.isActive("strike")}
        disabled={disabled}
        title="Strikethrough"
      >
        <Strikethrough size={14} />
      </Btn>
      <Sep />
      <Btn
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={!disabled && editor.isActive("heading", { level: 2 })}
        disabled={disabled}
        title="Heading 2"
      >
        <Heading2 size={14} />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={!disabled && editor.isActive("heading", { level: 3 })}
        disabled={disabled}
        title="Heading 3"
      >
        <Heading3 size={14} />
      </Btn>
      <Sep />
      <Btn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={!disabled && editor.isActive("bulletList")}
        disabled={disabled}
        title="Bullet list"
      >
        <List size={14} />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={!disabled && editor.isActive("orderedList")}
        disabled={disabled}
        title="Ordered list"
      >
        <ListOrdered size={14} />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={!disabled && editor.isActive("blockquote")}
        disabled={disabled}
        title="Blockquote"
      >
        <Quote size={14} />
      </Btn>
      <Sep />
      <LinkButton editor={editor} disabled={disabled} />
      <Sep />
      <Btn
        onClick={() => editor.chain().focus().undo().run()}
        disabled={disabled || !editor.can().undo()}
        title="Undo (Ctrl+Z)"
      >
        <Undo size={14} />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().redo().run()}
        disabled={disabled || !editor.can().redo()}
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo size={14} />
      </Btn>
      </div>

      <button
        type="button"
        onClick={onToggleMode}
        title={mode === "visual" ? "Chuyển sang chế độ Markdown source" : "Chuyển sang chế độ Visual"}
        className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-semibold transition ${
          mode === "source"
            ? "bg-ink text-white"
            : "text-ink-soft hover:bg-white hover:text-ink"
        }`}
      >
        {mode === "visual" ? <><Code2 size={12} /> Markdown</> : <><Eye size={12} /> Visual</>}
      </button>
    </div>
  );
}

function LinkButton({ editor, disabled }: { editor: Editor; disabled?: boolean }) {
  const isActive = !disabled && editor.isActive("link");
  return (
    <Btn
      disabled={disabled}
      onClick={() => {
        if (isActive) {
          editor.chain().focus().unsetLink().run();
          return;
        }
        const url = prompt("Nhập URL:");
        if (!url) return;
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
      }}
      active={isActive}
      title={isActive ? "Bỏ link" : "Thêm link"}
    >
      <LinkIcon size={14} />
    </Btn>
  );
}

function Btn({
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
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`grid h-7 w-7 place-items-center rounded transition ${
        active
          ? "bg-ink text-white"
          : "text-ink-soft hover:bg-white hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
      }`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span className="mx-0.5 h-5 w-px bg-paper-line" aria-hidden />;
}
