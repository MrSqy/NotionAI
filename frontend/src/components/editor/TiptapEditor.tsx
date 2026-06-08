import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { useEffect } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string, json: any) => void;
  placeholder?: string;
}

export default function TiptapEditor({ content, onChange, placeholder }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({ placeholder: placeholder || 'Bir şeyler yaz...' }),
      Image,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getJSON());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1 border-b p-2 mb-2">
        <ToolbarBtn
          active={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          label="H1"
        />
        <ToolbarBtn
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          label="H2"
        />
        <ToolbarBtn
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          label="B"
        />
        <ToolbarBtn
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          label="I"
        />
        <ToolbarBtn
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          label="• List"
        />
        <ToolbarBtn
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          label="1. List"
        />
        <ToolbarBtn
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          label="Quote"
        />
        <ToolbarBtn
          active={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          label="Code"
        />
      </div>
      <EditorContent editor={editor} className="prose prose-sm max-w-none dark:prose-invert p-4" />
    </div>
  );
}

function ToolbarBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
        active ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
      }`}
    >
      {label}
    </button>
  );
}
