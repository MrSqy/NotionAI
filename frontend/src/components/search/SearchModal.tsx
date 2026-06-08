import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { searchApi } from '../../services/api';
import { Search, Loader2 } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNote: (noteId: string) => void;
}

export default function SearchModal({ isOpen, onClose, onSelectNote }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await searchApi.search(q);
      setResults(res.data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Semantik Arama">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Bir konu, fikir veya kelime yaz..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
          />
        </div>
        {loading && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
        <div className="max-h-80 overflow-y-auto space-y-2">
          {results.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                onSelectNote(r.id);
                onClose();
                setQuery('');
                setResults([]);
              }}
              className="w-full text-left rounded-lg border p-3 hover:bg-accent transition-colors"
            >
              <div className="font-medium">{r.title || 'Başlıksız'}</div>
              {r.summary && (
                <div className="text-sm text-muted-foreground line-clamp-2 mt-1">{r.summary}</div>
              )}
              <div className="text-xs text-muted-foreground mt-1">
                Benzerlik: {(r.similarity * 100).toFixed(1)}%
              </div>
            </button>
          ))}
          {!loading && query && results.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-4">
              Sonuç bulunamadı
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
