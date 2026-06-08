import { useEffect, useState, useCallback, useRef } from 'react';
import DOMPurify from 'dompurify';
import { useAuthStore } from '../store/authStore';
import { notesApi, tagsApi, blocksApi } from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';
import Sidebar from '../components/sidebar/Sidebar';
import TiptapEditor from '../components/editor/TiptapEditor';
import SearchModal from '../components/search/SearchModal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import {
  Pin,
  Archive,
  Trash2,
  Tag,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  summary: string | null;
  isArchived: boolean;
  isPinned: boolean;
  blocks: any[];
  tags: { tag: { id: string; name: string; color: string } }[];
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const [notes, setNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [, setEditorJson] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3b82f6');
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeNote = notes.find((n) => n.id === activeNoteId);

  useEffect(() => {
    if (user) {
      connectSocket(user.id);
      loadNotes();
      loadTags();
    }
    return () => {
      disconnectSocket();
    };
  }, [user]);

  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setEditorContent(blocksToHtml(activeNote.blocks));
    } else {
      setTitle('');
      setEditorContent('');
    }
  }, [activeNoteId]);

  const loadNotes = async () => {
    try {
      const res = await notesApi.getAll();
      setNotes(res.data);
      if (res.data.length > 0 && !activeNoteId) {
        setActiveNoteId(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadTags = async () => {
    try {
      const res = await tagsApi.getAll();
      setTags(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateNote = async () => {
    try {
      const res = await notesApi.create({ title: 'Yeni Not' });
      setNotes((prev) => [res.data, ...prev]);
      setActiveNoteId(res.data.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Bu notu silmek istediğine emin misin?')) return;
    try {
      await notesApi.delete(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (activeNoteId === id) setActiveNoteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateNote = useCallback(
    async (data: Partial<Note>) => {
      if (!activeNoteId) return;
      try {
        const res = await notesApi.update(activeNoteId, data);
        setNotes((prev) =>
          prev.map((n) => (n.id === activeNoteId ? { ...n, ...res.data } : n))
        );
      } catch (err) {
        console.error(err);
      }
    },
    [activeNoteId]
  );

  const debouncedSave = useCallback(
    (_html: string, json: any) => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(async () => {
        if (!activeNoteId) return;
        setSaving(true);
        try {
          const blocks = jsonToBlocks(json);
          await blocksApi.save(activeNoteId, blocks);
          await loadNotes();
        } catch (err) {
          console.error(err);
        } finally {
          setSaving(false);
        }
      }, 2000);
    },
    [activeNoteId]
  );

  const handleEditorChange = (html: string, json: any) => {
    setEditorContent(html);
    setEditorJson(json);
    debouncedSave(html, json);
  };

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    try {
      await tagsApi.create({ name: newTagName, color: newTagColor });
      setNewTagName('');
      setTagModalOpen(false);
      loadTags();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAttachTag = async (tagId: string) => {
    if (!activeNoteId) return;
    try {
      await tagsApi.attach(activeNoteId, tagId);
      loadNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDetachTag = async (tagId: string) => {
    if (!activeNoteId) return;
    try {
      await tagsApi.detach(activeNoteId, tagId);
      loadNotes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar
        notes={notes}
        activeNoteId={activeNoteId}
        onSelectNote={setActiveNoteId}
        onCreateNote={handleCreateNote}
        onDeleteNote={handleDeleteNote}
        onSearchOpen={() => setSearchOpen(true)}
        tags={tags}
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
        darkMode={darkMode}
        onToggleDark={toggleDark}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
      />

      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {activeNote ? (
          <>
            <div className="border-b px-6 py-3 flex items-center gap-3">
              <Input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  handleUpdateNote({ title: e.target.value });
                }}
                className="text-xl font-bold border-0 bg-transparent focus-visible:ring-0 px-0"
                placeholder="Başlıksız"
              />
              <div className="flex items-center gap-1 ml-auto">
                {saving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleUpdateNote({ isPinned: !activeNote.isPinned })}
                  title={activeNote.isPinned ? 'Sabitlemeyi Kaldır' : 'Sabitle'}
                >
                  <Pin className={`h-4 w-4 ${activeNote.isPinned ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleUpdateNote({ isArchived: !activeNote.isArchived })}
                  title={activeNote.isArchived ? 'Arşivden Çıkar' : 'Arşivle'}
                >
                  <Archive className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setTagModalOpen(true)}
                  title="Etiketler"
                >
                  <Tag className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDeleteNote(activeNote.id)}
                  title="Sil"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>

            {activeNote.summary && (
              <div className="px-6 py-2 bg-primary/5 text-xs text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-3 w-3" />
                {activeNote.summary}
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              <TiptapEditor
                content={editorContent}
                onChange={handleEditorChange}
                placeholder="Bir şeyler yazmaya başla..."
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center space-y-2">
              <Sparkles className="h-8 w-8 mx-auto text-primary/50" />
              <p>Yeni bir not oluşturmak için "Yeni Not" butonuna tıkla</p>
            </div>
          </div>
        )}
      </div>

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectNote={setActiveNoteId}
      />

      <Modal isOpen={tagModalOpen} onClose={() => setTagModalOpen(false)} title="Etiketler">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Yeni etiket adı"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
            />
            <input
              type="color"
              value={newTagColor}
              onChange={(e) => setNewTagColor(e.target.value)}
              className="h-9 w-9 rounded border cursor-pointer"
            />
            <Button onClick={handleCreateTag}>Ekle</Button>
          </div>
          <div className="space-y-2">
            {tags.map((t) => {
              const attached = activeNote?.tags?.some((at: any) => at.tag.id === t.id);
              return (
                <div key={t.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                    <span>{t.name}</span>
                  </div>
                  <Button
                    size="sm"
                    variant={attached ? 'outline' : 'default'}
                    onClick={() =>
                      attached ? handleDetachTag(t.id) : handleAttachTag(t.id)
                    }
                  >
                    {attached ? 'Kaldır' : 'Ekle'}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Helper: Prisma Block[] → HTML for TipTap
function blocksToHtml(blocks: any[]): string {
  if (!blocks || blocks.length === 0) return '<p></p>';
  const raw = blocks
    .map((b) => {
      const c = b.content;
      switch (b.type) {
        case 'heading':
          return `<h${c.level || 1}>${escapeHtml(c.text || '')}</h${c.level || 1}>`;
        case 'bulletList':
          return `<ul><li>${escapeHtml(c.text || '')}</li></ul>`;
        case 'orderedList':
          return `<ol><li>${escapeHtml(c.text || '')}</li></ol>`;
        case 'codeBlock':
          return `<pre><code>${escapeHtml(c.text || '')}</code></pre>`;
        case 'blockquote':
          return `<blockquote>${escapeHtml(c.text || '')}</blockquote>`;
        case 'image':
          return `<img src="${escapeHtml(c.src || '')}" alt="${escapeHtml(c.alt || '')}" />`;
        default:
          return `<p>${escapeHtml(c.text || '')}</p>`;
      }
    })
    .join('');
  return DOMPurify.sanitize(raw);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Helper: TipTap JSON → Prisma BlockInput[]
function jsonToBlocks(json: any): any[] {
  if (!json || !json.content) return [];
  return json.content.map((node: any, index: number) => {
    const base = { order: index, content: {} };
    switch (node.type) {
      case 'heading':
        return { ...base, type: 'heading', content: { level: node.attrs?.level || 1, text: textFromNode(node) } };
      case 'bulletList':
        return { ...base, type: 'bulletList', content: { text: textFromNode(node) } };
      case 'orderedList':
        return { ...base, type: 'orderedList', content: { text: textFromNode(node) } };
      case 'codeBlock':
        return { ...base, type: 'codeBlock', content: { text: textFromNode(node) } };
      case 'blockquote':
        return { ...base, type: 'blockquote', content: { text: textFromNode(node) } };
      case 'image':
        return { ...base, type: 'image', content: { src: node.attrs?.src || '', alt: node.attrs?.alt || '' } };
      default:
        return { ...base, type: 'paragraph', content: { text: textFromNode(node) } };
    }
  });
}

function textFromNode(node: any): string {
  if (!node.content) return '';
  return node.content.map((c: any) => c.text || '').join('');
}
