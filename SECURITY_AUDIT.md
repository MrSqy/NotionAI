# 🔐 NotionAI — Güvenlik & Kod Kalitesi Denetim Raporu

> Tarih: 2026-05-29  
> Denetleyen: Kod Analiz Aracı  
> Kapsam: Backend (NestJS + Prisma + PostgreSQL + Redis + Socket.IO), Frontend (React + Vite + TipTap), Docker Compose Altyapısı

---

## 📊 Özet

| Kategori | Critical | High | Medium | Low | Info |
|----------|:--------:|:----:|:------:|:---:|:----:|
| Güvenlik Açıkları | 2 | 6 | 8 | 5 | 4 |
| Mimari/Performans | 0 | 2 | 4 | 3 | 6 |
| Kod Kalitesi | 0 | 1 | 5 | 4 | 8 |
| **Toplam** | **2** | **9** | **17** | **12** | **18** |

---

## ✅ Çözülen Maddeler

### ~~C1: Blocks Servisine Sahiplik Kontrolü~~ ✅ ÇÖZÜLDÜ
- `BlocksService.saveBlocks` artık `note.findFirst({ id: noteId, userId })` ile sahiplik kontrolü yapıyor.
- **Dosya:** `backend/src/modules/blocks/blocks.service.ts:20-26`

### ~~C2: Frontend XSS~~ ✅ ÇÖZÜLDÜ
- `blocksToHtml` fonksiyonu artık `escapeHtml()` ile karakter escape ediyor ve `DOMPurify.sanitize()` ile output temizleniyor.
- **Dosya:** `frontend/src/pages/Dashboard.tsx`

---

## 🚨 CRITICAL (Kritik)

*(Tüm critical maddeler çözülmüştür.)*

## 🔴 HIGH (Yüksek)
- **Dosya:** `frontend/src/pages/Dashboard.tsx:340-363`
- **Sorun:** `blocksToHtml` fonksiyonunda `c.text` değeri doğrudan HTML'e interpolasyon ediliyor, herhangi bir sanitizasyon veya escape yok.
- **Etki:** Bir kullanıcı `<script>alert('XSS')</script>` içeren bir not oluşturursa, bu kod diğer kullanıcıların tarayıcısında çalışır.
- **Çözüm:** DOMPurify kullanın veya TipTap'ın `getHTML()` çıktısını direkt kullanın (TipTap zaten XSS'e karşı daha güvenlidir).
  ```typescript
  import DOMPurify from 'dompurify';
  // blocksToHtml yerine TipTap'ın getHTML() çıktısını kullanın
  ```

---

## 🔴 HIGH (Yüksek)

### ~~H1: Rate Limiting Yok~~ ✅ ÇÖZÜLDÜ
- `@nestjs/throttler` kuruldu ve `APP_GUARD` olarak global aktif edildi (`ttl: 60000, limit: 30`).
- **Dosya:** `backend/src/app.module.ts:27-32`

### H2: CORS `"origin: true"` Herkese Açık

### ~~H2: CORS Herkese Açık~~ ✅ ÇÖZÜLDÜ
- `enableCors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' })` olarak güncellendi.
- **Dosya:** `backend/src/main.ts:11`

### H3: Socket.IO Auth Kontrolü Yok
- **Durum:** HÂLÂ AÇIK
- **Dosya:** `backend/src/modules/notifications/notifications.gateway.ts`
- **Sorun:** `cors: { origin: '*' }`, `handleConnection` içinde JWT yok, `payload.userId` doğrudan kullanılıyor.
- **Çözüm:** Socket.IO middleware ile JWT doğrulaması ekleyin.

### ~~H4: Tags DTO Validation~~ ✅ ÇÖZÜLDÜ
- `TagsController.create` artık `CreateTagDto` kullanıyor.
- **Dosya:** `backend/src/modules/tags/tags.controller.ts:20`

### H5: `$queryRawUnsafe` / `$executeRawUnsafe` Kullanımı

### H5: `$queryRawUnsafe` / `$executeRawUnsafe` Kullanımı
- **Durum:** HÂLÂ AÇIK
- **Dosya:** `backend/src/modules/search/search.service.ts`, `backend/src/modules/ai/ai.service.ts`
- **Risk:** Düşük (Prisma parametreleri escape ediyor) ama `$queryRaw` template literal version kullanılmalı.
- **Çözüm:** `$queryRaw` ve `$executeRaw` template literal version'a geçin.

### ~~H6: `RolesGuard` `user` Objesi~~ ✅ ÇÖZÜLDÜ
- `AuthGuard` zaten `APP_GUARD` olarak `RolesGuard`'dan önce çalışıyor. `user` undefined olursa `AuthGuard` önce `UnauthorizedException` atıyor.
- **Dosya:** `backend/src/app.module.ts:50-53`

---

## 🟡 MEDIUM (Orta)

### M1: `localStorage` Kullanımı — XSS Durumunda Token Çalınması
- **Dosya:** `frontend/src/store/authStore.ts`
- **Sorun:** JWT access token `localStorage`'da saklanıyor.
- **Etki:** Bir XSS açığı (örneğin C1 çözülmemişse) exploit edilirse saldırgan token'ı çalabilir.
- **Çözüm:** `httpOnly`, `secure`, `sameSite=strict` cookie kullanın. Backend `Set-Cookie` header ile token göndermeli.

### ~~M2: `JWT_SECRET` Hardcoded Fallback~~ ✅ ÇÖZÜLDÜ
- `app.module.ts`'te `JWT_SECRET` zorunlu kontrolü var, undefined ise `throw new Error` atıyor.
- **Dosya:** `backend/src/app.module.ts:19-22`

### ~~M3: `db push --accept-data-loss`~~ ✅ ÇÖZÜLDÜ
- `docker-compose.yml`'de `prisma migrate deploy` kullanılıyor. Migration dosyaları `backend/prisma/migrations/` altında versiyon kontrolüne eklendi.
- **Dosya:** `docker-compose.yml:62`, `backend/prisma/migrations/`

### M4: Şifre Güçlülük Kuralları Eksik
- **Dosya:** `backend/src/modules/auth/dto/register.dto.ts`
- **Sorun:** `@MinLength(6)` dışında şifre güçlülük kuralı yok. `"123456"` veya `"password"` kabul edilir.
- **Etki:** Kullanıcılar zayıf şifreler kullanabilir.
- **Çözüm:**
  ```typescript
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: 'Şifre en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir',
  })
  password: string;
  ```

### M5: `BlocksService.saveBlocks` Verimsiz İşlem
- **Dosya:** `backend/src/modules/blocks/blocks.service.ts:20-30`
- **Sorun:** Her kaydetmede `deleteMany` + `createMany` yapılıyor. Büyük notlar için verimsiz.
- **Etki:** Performans sorunları, gereksiz veritabanı yükü.
- **Çözüm:** Upsert veya diff-based güncelleme stratejisi kullanın.

### M6: `NotesService.findAll` Sayfalama Yok
- **Dosya:** `backend/src/modules/notes/notes.service.ts:14-30`
- **Sorun:** Tüm notları, blokları ve etiketleri tek seferde getiriyor. Kullanıcı 1000 nota sahipse performans çöker.
- **Çözüm:** Pagination ekleyin:
  ```typescript
  findAll(userId: string, archived?: boolean, search?: string, page = 1, limit = 20) {
    return this.prisma.note.findMany({
      skip: (page - 1) * limit,
      take: limit,
      // ...
    });
  }
  ```

### M7: `AiService.processNote` Her Değişiklikte OpenAI API Çağrısı
- **Dosya:** `backend/src/modules/ai/ai.service.ts`
- **Sorun:** Her blok kaydetmede ve title değişikliğinde OpenAI API çağrısı yapılıyor.
- **Etki:** Yüksek maliyet, rate limit aşımı, kullanıcı deneyimi yavaşlaması.
- **Çözüm:** Debounce (örneğin 30 saniye) veya kullanıcı tetiklemeli ("AI ile özetle" butonu) yapın.

### ~~M8: `Dashboard.tsx` Try-Catch Hataları~~ ✅ ÇÖZÜLDÜ
- Catch bloklarına `console.error(err)` eklendi.
- **Dosya:** `frontend/src/pages/Dashboard.tsx`

---

## 🟢 LOW (Düşük)

### L1: `SearchModal` `similarity` `undefined` Olabilir
- **Dosya:** `frontend/src/components/search/SearchModal.tsx:70`
- **Sorun:** Fallback modda `similarity` değeri gelmeyebilir, `toFixed` `TypeError` fırlatabilir.
- **Çözüm:** `{(r.similarity ? r.similarity * 100 : 0).toFixed(1)}%`

### L2: `UpdateNoteDto` `summary` Alanı Validation Eksik
- **Dosya:** `backend/src/modules/notes/dto/update-note.dto.ts`
- **Sorun:** `summary` alanı `@IsString()` ile sınırlandırılmamış. Çok uzun string gönderilebilir.
- **Çözüm:** `@IsString() @MaxLength(2000) @IsOptional()` ekleyin.

### L3: `Cookie-Parser` Kullanılıyor Ama Cookie-Based Auth Yok
- **Dosya:** `backend/src/main.ts:9`
- **Sorun:** `cookie-parser` middleware eklenmiş ama JWT token'lar `Authorization` header'dan alınıyor.
- **Çözüm:** Ya cookie-based auth yapın ya da `cookie-parser`'ı kaldırın.

### L4: `NotificationsGateway` `sendToUser` Hiç Kullanılmıyor
- **Dosya:** `backend/src/modules/notifications/notifications.gateway.ts:54-56`
- **Sorun:** Metod tanımlanmış ama hiç çağrılmamış.
- **Çözüm:** Not oluşturma/güncelleme event'lerinde bildirim tetikleyin veya kaldırın.

### L5: `depends_on` Sadece Container Başlangıcını Bekler
- **Dosya:** `docker-compose.yml:50-54`
- **Sorun:** `backend` servisi `postgres`'in container'ı başlayana kadar bekler ama PostgreSQL'in hazır olmasını beklemez.
- **Çözüm:** `wait-for-it.sh` veya `dockerize` kullanın.

---

## ℹ️ INFO (Bilgilendirme)

### I1: `any` Tipi Çok Fazla Kullanılmış
- **Dosya:** `frontend/src/pages/Dashboard.tsx`, `backend/src/modules/notes/notes.service.ts`
- **Öneri:** Tip güvenliği için interface'ler tanımlayın.

### I2: `Dashboard.tsx` Çok Büyük Bileşen
- **Dosya:** `frontend/src/pages/Dashboard.tsx` (392 satır)
- **Öneri:** Custom hook'lar (`useNotes`, `useTags`) ve alt bileşenlere ayırın.

### I3: `blocksToHtml` / `jsonToBlocks` Format Uyumsuzluğu Riski
- **Dosya:** `frontend/src/pages/Dashboard.tsx:339-392`
- **Öneri:** TipTap'ın `getHTML()` ve `getJSON()` çıktılarını doğrudan saklayın, custom mapping yerine.

### I4: `Tag.name` Max Length Yok
- **Dosya:** `backend/prisma/schema.prisma:86`
- **Öneri:** `@db.VarChar(50)` veya DTO'da `@MaxLength(50)` ekleyin.

---

## 🛠️ Öncelikli Düzeltme Planı

| Öncelik | Madde | Tahmini Süre |
|---------|-------|-------------|
| Öncelik | Madde | Tahmini Süre | Durum |
|---------|-------|-------------|-------|
| 1 | C1: Blocks servisine sahiplik kontrolü | 15 dk | ✅ Çözüldü |
| 2 | C2: Frontend XSS koruması (DOMPurify) | 30 dk | ✅ Çözüldü |
| 3 | H1: Rate limiting (@nestjs/throttler) | 30 dk | ✅ Çözüldü |
| 4 | H3: Socket.IO JWT auth middleware | 45 dk | 🔴 Açık |
| 5 | H4: Tags DTO + validation | 15 dk | ✅ Çözüldü |
| 6 | M1: httpOnly cookie-based auth | 1 saat | 🟡 Açık |
| 7 | M2: JWT_SECRET hardcoded kaldırma | 10 dk | ✅ Çözüldü |
| 8 | M3: db push → migrate deploy | 10 dk | ✅ Çözüldü |
| 9 | M6: Pagination ekleme | 30 dk | 🟡 Açık |

---

*Bu rapor, projenin mevcut durumuna göre hazırlanmıştır. Üretim ortamına taşınmadan önce yukarıdaki critical ve high seviyeli maddelerin çözülmesi şiddetle tavsiye edilir.*
