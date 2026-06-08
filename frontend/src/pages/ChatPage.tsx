import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatApi } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Send,
  Loader2,
  MessageSquare,
  Bot,
  User,
} from 'lucide-react';

interface Chat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

interface Message {
  id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export default function ChatPage() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find((c) => c.id === activeChatId);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (activeChatId) {
      loadMessages(activeChatId);
    }
  }, [activeChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const loadChats = async () => {
    setLoading(true);
    try {
      const res = await chatApi.getAll();
      setChats(res.data);
      if (res.data.length > 0 && !activeChatId) {
        setActiveChatId(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const res = await chatApi.getOne(chatId);
      setMessages(res.data.messages || []);
      // Update chat in list with latest messages
      setChats((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, messages: res.data.messages } : c))
      );
    } catch {
      setMessages([]);
    }
  };

  const createChat = async () => {
    try {
      const res = await chatApi.create({ title: 'Yeni Sohbet' });
      const newChat = res.data;
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChat.id);
      setMessages([]);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteChat = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Bu sohbeti silmek istediğinize emin misiniz?')) return;
    try {
      await chatApi.delete(id);
      setChats((prev) => prev.filter((c) => c.id !== id));
      if (activeChatId === id) {
        setActiveChatId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeChatId) return;
    const content = input.trim();
    setInput('');
    setSending(true);

    // Optimistic user message
    const tempMsg: Message = {
      id: 'temp-' + Date.now(),
      chatId: activeChatId,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await chatApi.sendMessage(activeChatId, content);
      setMessages(res.data.messages || []);
      // Update chat title if AI renamed it
      setChats((prev) =>
        prev.map((c) => (c.id === activeChatId ? { ...c, title: res.data.title } : c))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex bg-background text-foreground">
      {/* Left Panel - Chat List */}
      <div className="w-80 border-r bg-card flex flex-col">
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg">AI Sohbet</span>
            </div>
            <Button size="icon" variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" className="w-full" onClick={createChat}>
            <Plus className="mr-1 h-3 w-3" /> Yeni Sohbet
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {loading && chats.length === 0 && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors group relative ${
                activeChatId === chat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium truncate">{chat.title}</span>
                <Trash2
                  className={`h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ${
                    activeChatId === chat.id ? 'text-primary-foreground' : 'text-muted-foreground'
                  }`}
                  onClick={(e) => deleteChat(chat.id, e)}
                />
              </div>

            </button>
          ))}
          {chats.length === 0 && !loading && (
            <div className="text-center text-xs text-muted-foreground py-6">
              Henüz sohbet yok
            </div>
          )}
        </div>

        <div className="border-t p-3">
          <Button variant="ghost" className="w-full" onClick={logout}>
            <ArrowLeft className="mr-1 h-3 w-3" /> Çıkış Yap
          </Button>
        </div>
      </div>

      {/* Right Panel - Chat Window */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Header */}
            <div className="border-b p-4 flex items-center justify-between bg-card">
              <div>
                <h2 className="font-semibold">{activeChat.title}</h2>
              </div>
              <div className="text-xs text-muted-foreground">
                {messages.length} mesaj
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && !sending && (
                <div className="text-center text-muted-foreground py-12">
                  <Bot className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>İlk mesajınızı gönderin</p>
                  <p className="text-xs mt-1">
                    AI her zaman cevap verecek
                  </p>
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted rounded-bl-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              {sending && (
                <div className="flex gap-2 justify-start">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4 bg-card">
              <div className="flex gap-2">
                <Input
                  placeholder="Mesajınızı yazın..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={sending}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={sending || !input.trim()}
                  size="icon"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">Bir sohbet seçin veya yeni oluşturun</p>
          </div>
        )}
      </div>
    </div>
  );
}
