# NotionAI — AI Destekli Akıllı Not Alma Platformu

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Tech Stack](https://img.shields.io/badge/stack-NestJS%20%7C%20React%20%7C%20PostgreSQL-blue)

Notion benzeri **block-based editör** ile zengin metin düzenleme, **Groq AI destekli sohbet & özetleme**, **etiket önerisi** ve **pgvector semantik arama** sunan modern bir not alma uygulaması.

> Bu proje NestJS + PostgreSQL (pgvector) + React + TipTap + Groq + Docker teknoloji yığını üzerine kurulmuştur.

---

## 🎥 Tanıtım

| Özellik | Açıklama |
|---------|----------|
| 📝 Block-Based Editör | H1, H2, bold, italic, liste, alıntı, kod bloğu |
| 💬 AI Sohbet | Notlarınızdan yararlanan akıllı sohbet asistanı |
| 🤖 AI Özetleme | Groq Llama 3.1 ile otomatik 2-3 cümlelik özet |
| 🔍 Semantik Arama | "Para biriktirme" yazınca "tasarruf" geçen notları da bulur |
| 🏷️ Etiket Sistemi | Renkli etiketler, notlara etiket ilişkilendirme |
| 🌙 Dark Mode | Karanlık/Aydınlık tema geçişi |
| ⚡ Auto-Save | 2 saniye debounce ile otomatik kaydetme |
| 🔐 JWT Auth | Access token (15dk) + Refresh token (7gün) |
| 🗄️ Soft Delete | Notlar kalıcı silinmiyor, arşivleniyor |

---

## 🚀 Hızlı Başlangıç

### Ön Koşullar
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Kurulum

```bash
# 1. Projeye git
cd "Kimi denemesi"

# 2. .env dosyasını oluştur
cp .env.example .env

# 3. .env'i doldur (opsiyonel ama önerilir)
# OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# JWT_SECRET=super_secret_jwt_key_change_in_production
# JWT_REFRESH_SECRET=super_secret_refresh_key_change_in_production

# 4. Tüm servisleri ayağa kaldır (ilk kurulum ~3-5 dk)
docker compose up --build -d

# 5. Logları izle
docker compose logs -f backend
```

### Erişim

| Servis | URL | Açıklama |
|--------|-----|----------|
| Frontend | http://localhost:5173 | React uygulaması |
| Backend API | http://localhost:3001 | NestJS REST API |

### Durdurma & Sıfırlama

```bash
# Servisleri durdur
docker compose down

# Veritabanı dahil tamamen sıfırla
docker compose down -v

# Tek servis yeniden başlat
docker compose restart backend
```

---

## 📸 Ekran Görüntüleri

| Dashboard | AI Özetleme | Semantik Arama |
|-----------|-------------|----------------|
| *(Screenshot placeholder)* | *(Screenshot placeholder)* | *(Screenshot placeholder)* |

> Not: Ekran görüntülerini eklemek için `docs/screenshots/` dizinine yükleyin ve yukarıdaki tabloyu güncelleyin.

---

## 🏗️ Mimari

### Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| **Backend** | NestJS 10 + TypeScript |
| **ORM / DB** | Prisma 5 + PostgreSQL 15 (pgvector) |
| **Cache / PubSub** | Redis 7 |
| **Auth** | Passport.js + JWT (access + refresh) |
| **AI / LLM** | Groq API (llama-3.1-8b-instant, read-only note context) |
| **Real-time** | Socket.IO |
| **Frontend** | React 19 + Vite + TypeScript |
| **UI / Styling** | Tailwind CSS + shadcn/ui |
| **Editor** | TipTap (block-based, Notion-like) |
| **Container** | Docker + Docker Compose |

### Mimari Diyagram

```
┌─────────────┐      REST / GraphQL / WS      ┌──────────────┐
│   React     │  ◄──────────────────────────►  │   NestJS     │
│  (Vite)     │                                │  (Modüler)   │
└─────────────┘                                └──────┬───────┘
                                                      │
                           ┌──────────────────────────┼──────────┐
                           │                          │          │
                      ┌────▼────┐              ┌──────▼─────┐  ┌▼────────┐
                      │ Prisma  │              │  Redis     │  │ OpenAI  │
                      │(PostgreSQL             │  (Cache/   │  │  API    │
                      │ pgvector)│             │   PubSub)  │  │         │
                      └─────────┘              └────────────┘  └─────────┘
```

### Veritabanı Şeması

```
User ──1:N──→ Note ──1:N──→ Block
 │              │
 │              N:M (NoteTag)
 │              │
 └──1:N──→ Tag  Embedding (pgvector)
 │
 ├──1:N──→ Session
 └──1:N──→ Notification
```

### Backend Modüller

```
src/modules/
├── auth/          → Kayıt, giriş, JWT, refresh token
├── users/         → Profil, kullanıcı bilgileri
├── notes/         → CRUD, soft delete (archive), pin
├── blocks/        → Block editor içeriği (TipTap ↔ Prisma)
├── tags/          → Etiket CRUD, not-etag ilişkisi
├── ai/            → Groq AI özet, sohbet, etiket önerisi
├── search/        → pgvector semantik arama (cosine similarity)
├── notifications/ → Socket.IO real-time bildirimler
└── chat/          → AI sohbet (not bağlamlı, read-only)
```

---

## 🔐 Güvenlik

Projeye uygulanan güvenlik önlemleri:

| Önlem | Açıklama |
|-------|----------|
| **IDOR Koruması** | Her kullanıcı sadece kendi notlarına/bloklarına erişebilir |
| **Rate Limiting** | Dakikada 30 istek ( `@nestjs/throttler` ) |
| **CORS Kısıtlaması** | Sadece `FRONTEND_URL`'den gelen isteklere izin |
| **Socket.IO JWT Auth** | WebSocket bağlantılarında token doğrulaması |
| **Input Validation** | `class-validator` ile DTO doğrulama (etiket renkleri, uzunluklar) |
| **JWT Secret Env** | Hardcoded fallback kaldırıldı, env zorunlu |
| **Refresh Token Rotation** | Her refresh'te yeni token çifti üretilir |
| **Soft Delete** | Notlar kalıcı silinmiyor, `isArchived` olarak işaretleniyor |

Detaylı güvenlik denetim raporu için [SECURITY_AUDIT.md](./SECURITY_AUDIT.md) dosyasına bakın.

---

## 📡 API Dokümantasyonu

> **Swagger / OpenAPI:** Backend çalışırken `http://localhost:3001/api/docs` adresinden interaktif API dokümantasyonuna erişebilirsiniz. *(Not: `@nestjs/swagger` entegrasyonu yapılandırılmalıdır.)*

### Auth
| Method | Endpoint | Açıklama | Public |
|--------|----------|----------|--------|
| `POST` | `/auth/register` | Yeni kullanıcı kaydı | ✅ |
| `POST` | `/auth/login` | Giriş, token al | ✅ |
| `POST` | `/auth/refresh` | Access token yenile | ✅ |
| `POST` | `/auth/logout` | Çıkış, session sil | ❌ |

### Notes
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/notes?archived=&search=` | Notları listele |
| `GET` | `/notes/:id` | Tek not getir |
| `POST` | `/notes` | Not oluştur |
| `PATCH` | `/notes/:id` | Not güncelle (title, summary, pin, archive) |
| `DELETE` | `/notes/:id` | Not arşivle (soft delete) |

### Blocks
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `POST` | `/blocks/:noteId` | Notun bloklarını kaydet (replace) |

### Tags
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/tags` | Etiketleri listele |
| `POST` | `/tags` | Etiket oluştur |
| `POST` | `/tags/:noteId/:tagId` | Nota etiket ekle |
| `DELETE` | `/tags/:noteId/:tagId` | Nottan etiket kaldır |
| `DELETE` | `/tags/:id` | Etiket sil |

### Search
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/search?q=` | Semantik arama (Groq key yoksa fallback) |

### Chat
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `POST` | `/chats` | Sohbet oluştur |
| `GET` | `/chats` | Sohbetleri listele |
| `GET` | `/chats/:id` | Tek sohbet getir |
| `PATCH` | `/chats/:id` | Sohbet güncelle (başlık) |
| `DELETE` | `/chats/:id` | Sohbet sil |
| `POST` | `/chats/:id/messages` | Mesaj gönder (AI otomatik cevaplar) |

---

## 🐳 Docker Compose Servisleri

| Servis | Image | Port | Açıklama |
|--------|-------|------|----------|
| `postgres` | `ankane/pgvector:latest` | — | PostgreSQL + pgvector extension |
| `redis` | `redis:7-alpine` | 6379 | Cache & PubSub |
| `backend` | `node:20-slim` | 3001 | NestJS API |
| `frontend` | `node:20-alpine` | 5173 | React dev server |

---

## 📝 Proje Yapısı

```
Kimi denemesi/
├── backend/
│   ├── src/
│   │   ├── modules/       → İş mantığı modülleri
│   │   ├── common/        → Guards, decorators, pipes
│   │   ├── prisma/        → Prisma client & schema
│   │   ├── main.ts        → Bootstrap
│   │   └── app.module.ts  → Root module
│   ├── prisma/schema.prisma
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/    → UI bileşenleri (editor, sidebar, search)
│   │   ├── pages/         → Login, Register, Dashboard
│   │   ├── services/      → API & Socket.IO client
│   │   ├── store/         → Zustand auth store
│   │   └── App.tsx
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
├── SECURITY_AUDIT.md      → Güvenlik denetim raporu
├── USAGE.md               → Kullanım kılavuzu
└── projeler.txt           → Proje önerileri
```

---

## ⚙️ Çevre Değişkenleri

| Değişken | Zorunlu | Varsayılan | Açıklama |
|----------|:-------:|------------|----------|
| `OPENAI_API_KEY` | ❌ | — | Groq API key (AI özellikleri için) |
| `JWT_SECRET` | ✅ | — | JWT imza secret'ı |
| `JWT_REFRESH_SECRET` | ✅ | — | Refresh token imza secret'ı |
| `DATABASE_URL` | ✅ | — | PostgreSQL bağlantı URL'i |
| `REDIS_URL` | ✅ | — | Redis bağlantı URL'i |
| `FRONTEND_URL` | ❌ | `http://localhost:5173` | CORS için frontend adresi |
| `PORT` | ❌ | `3001` | Backend portu |
| `VITE_API_URL` | ❌ | `http://localhost:3001` | Frontend API URL'i |
| `VITE_WS_URL` | ❌ | `ws://localhost:3001` | Frontend WebSocket URL'i |

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen aşağıdaki adımları izleyin:

1. Bu depoyu fork edin.
2. Yeni bir feature branch oluşturun: `git checkout -b feature/amazing-feature`
3. Değişikliklerinizi commit edin: `git commit -m 'feat: add amazing feature'`
4. Branch'inizi push edin: `git push origin feature/amazing-feature`
5. Bir **Pull Request** açın.

### Geliştirme Kuralları

- TypeScript strict mode kurallarına uyun.
- Yeni özellikler için test yazmaya özen gösterin.
- Commit mesajlarında [Conventional Commits](https://www.conventionalcommits.org/) formatını kullanın.
- Büyük değişiklikler öncesinde bir issue açarak tartışmaya katılın.

### Yol Haritası (Roadmap)

Yeni özellik önerileri:
- [ ] Not paylaşımı (share link)
- [ ] Gerçek zamanlı işbirlikçi düzenleme (Yjs + TipTap)
- [ ] Markdown / PDF dışa aktarma
- [ ] Not geçmişi (version history)
- [ ] Admin paneli
- [ ] E-posta bildirimleri
- [ ] Mobil uygulama (React Native / PWA)

---

## 📄 Lisans

MIT License
