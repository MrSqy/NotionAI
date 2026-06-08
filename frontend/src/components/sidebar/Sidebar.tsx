import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

import {
  Plus,
  Search,
  LogOut,
  Moon,
  Sun,
  Pin,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface SidebarProps {
  notes: any[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string) => void;
  onSearchOpen: () => void;
  tags: any[];
  selectedTag: string | null;
  onSelectTag: (id: string | null) => void;
  darkMode: boolean;
  onToggleDark: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  notes,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  onSearchOpen,
  tags,
  selectedTag,
  onSelectTag,
  darkMode,
  onToggleDark,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const { user, logout } = useAuthStore();
  const [filter, setFilter] = useState('');
  const [showArchived] = useState(false);

  const filteredNotes = notes
    .filter((n) => {
      if (showArchived) return n.isArchived;
      return !n.isArchived;
    })
    .filter((n) => {
      if (selectedTag) return n.tags?.some((t: any) => t.tag.id === selectedTag);
      return true;
    })
    .filter((n) =>
      n.title.toLowerCase().includes(filter.toLowerCase())
    );

  if (collapsed) {
    return (
      <div className="w-12 border-r bg-card flex flex-col items-center py-4 gap-3">
        <Button size="icon" variant="ghost" onClick={onToggleCollapse}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={onCreateNote}>
          <Plus className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={onSearchOpen}>
          <Search className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => window.location.href = '/chat'}>
          <MessageSquare className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={onToggleDark}>
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-72 border-r bg-card flex flex-col h-full">
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">NotionAI</span>
          </div>
          <Button size="icon" variant="ghost" onClick={onToggleCollapse}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onCreateNote}>
            <Plus className="mr-1 h-3 w-3" /> Yeni Not
          </Button>
          <Button variant="outline" size="icon" onClick={onSearchOpen}>
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => window.location.href = '/chat'}>
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
        <Input
          placeholder="Notlarda ara..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {filteredNotes.map((note) => (
          <button
            key={note.id}
            onClick={() => onSelectNote(note.id)}
            className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${
              activeNoteId === note.id
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium truncate">
                {note.title || 'Başlıksız'}
              </span>
              {note.isPinned && <Pin className="h-3 w-3 opacity-70" />}
            </div>
            {note.summary && (
              <div className="text-xs opacity-70 line-clamp-1 mt-0.5">{note.summary}</div>
            )}
          </button>
        ))}
        {filteredNotes.length === 0 && (
          <div className="text-center text-xs text-muted-foreground py-6">
            Henüz not yok
          </div>
        )}
      </div>

      <div className="border-t p-3 space-y-3">
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => onSelectTag(null)}
            className={`text-xs rounded-full px-2 py-0.5 border ${
              !selectedTag ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            Tümü
          </button>
          {tags.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTag(t.id)}
              className={`text-xs rounded-full px-2 py-0.5 border flex items-center gap-1 ${
                selectedTag === t.id ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
              style={{ borderColor: t.color }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
              {t.name}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground truncate max-w-[140px]">
            {user?.email}
          </div>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={onToggleDark}>
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
